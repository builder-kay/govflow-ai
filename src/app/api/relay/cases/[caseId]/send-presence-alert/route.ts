import { NextResponse } from "next/server";
import { sendArkeselSms } from "@/lib/arkesel";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";

function hasOpsAccess(request: Request): boolean {
  const secret = process.env.RELAY_OPS_SECRET;
  if (!secret) return false;
  return request.headers.get("x-relay-ops-secret") === secret;
}

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  if (!hasOpsAccess(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { caseId } = await context.params;
  const relayCase = await getRelayCaseById(caseId);
  if (!relayCase) {
    return NextResponse.json({ error: "Agent request not found." }, { status: 404 });
  }

  const nextUserStep = relayCase.steps.find(
    (step) => step.assignee === "user" && step.requiresUserPresence && step.status !== "completed"
  );
  const actionTitle = nextUserStep?.title ?? "your next in-person step";
  const actionDetail = (nextUserStep?.description ?? "Please check your dashboard for instructions.")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150);

  const sms = await sendArkeselSms(
    relayCase.intake.contact.phone,
    `GovFlow Agent alert: your presence is now required. Next action: ${actionTitle}. ${actionDetail}. We will also follow up on WhatsApp.`
  );
  if (!sms.ok) {
    return NextResponse.json({ error: sms.error || "Could not send SMS." }, { status: 502 });
  }

  const updated = await updateRelayCase(caseId, {
    status: "awaiting_user",
    eventType: "presence_required",
    eventMessage: "Presence alert sent via SMS and in-app. Coordinator will also follow up on WhatsApp.",
    actor: "ops",
  });

  return NextResponse.json({ ok: true, case: updated });
}
