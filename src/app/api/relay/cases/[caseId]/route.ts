import { NextRequest, NextResponse } from "next/server";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";
import { isAdminAuthorized } from "@/lib/admin-auth";
import type { RelayCaseStatus, RelayStepStatus } from "@/types/relay";

type PatchPayload = {
  status?: RelayCaseStatus;
  paymentStatus?: "unpaid" | "pending" | "paid" | "failed";
  assignedCoordinator?: string;
  assignedRunner?: string;
  stepUpdates?: Array<{ id: string; status: RelayStepStatus }>;
  eventMessage?: string;
  eventType?: "ops_assigned" | "step_updated" | "presence_required" | "note" | "case_completed";
};

export async function GET(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await context.params;
  try {
    const relayCase = await getRelayCaseById(caseId);
    if (!relayCase) {
      return NextResponse.json({ error: "Agent request not found." }, { status: 404 });
    }
    return NextResponse.json({ case: relayCase });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load relay case." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ caseId: string }> }) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized ops update. Set RELAY_OPS_SECRET and send x-relay-ops-secret." },
      { status: 401 }
    );
  }

  const { caseId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as PatchPayload;

  try {
    const existing = await getRelayCaseById(caseId);
    if (!existing) {
      return NextResponse.json({ error: "Agent request not found." }, { status: 404 });
    }

    const nextSteps =
      body.stepUpdates && body.stepUpdates.length
        ? existing.steps.map((step) => {
            const update = body.stepUpdates?.find((item) => item.id === step.id);
            if (!update) return step;
            return {
              ...step,
              status: update.status,
              completedAt: update.status === "completed" ? new Date().toISOString() : step.completedAt,
            };
          })
        : existing.steps;

    const updated = await updateRelayCase(caseId, {
      status: body.status,
      paymentStatus: body.paymentStatus,
      assignedCoordinator: body.assignedCoordinator,
      assignedRunner: body.assignedRunner,
      steps: nextSteps,
      eventMessage: body.eventMessage,
      eventType: body.eventType,
      actor: "ops",
    });

    return NextResponse.json({ case: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update relay case." },
      { status: 500 }
    );
  }
}
