import { NextResponse } from "next/server";
import { sendArkeselSms } from "@/lib/arkesel";
import { listRelayCasesForUser, updateRelayCase } from "@/lib/relay-repository";

export async function GET(request: Request) {
  const cronSecret = process.env.RELAY_CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const targetUserId = request.headers.get("x-relay-user-id");
  if (!targetUserId) {
    return NextResponse.json(
      { error: "Provide x-relay-user-id header for scoped reminder checks." },
      { status: 400 }
    );
  }

  try {
    const cases = await listRelayCasesForUser(targetUserId);
    const awaitingUserCases = cases.filter((item) => item.status === "awaiting_user");

    let remindersSent = 0;
    for (const relayCase of awaitingUserCases) {
      const nextUserStep = relayCase.steps.find(
        (step) => step.assignee === "user" && step.requiresUserPresence && step.status !== "completed"
      );
      const actionTitle = nextUserStep?.title ?? "your next in-person step";
      const actionDetail = (
        nextUserStep?.description ?? "Open GovFlow and follow the dashboard instructions."
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 150);

      const sms = await sendArkeselSms(
        relayCase.intake.contact.phone,
        `GovFlow Agent reminder: your presence is needed. Next action: ${actionTitle}. ${actionDetail}. We will also follow up on WhatsApp.`
      );
      if (!sms.ok) continue;

      remindersSent += 1;
      await updateRelayCase(relayCase.id, {
        eventType: "presence_required",
        eventMessage: "Presence reminder sent via SMS and in-app. WhatsApp follow-up flagged.",
        actor: "system",
      });
    }

    return NextResponse.json({
      checked: awaitingUserCases.length,
      remindersSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not run reminders job." },
      { status: 500 }
    );
  }
}
