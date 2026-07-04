import { NextResponse } from "next/server";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  const userId = request.headers.get("x-govflow-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user id." }, { status: 401 });
  }

  const { caseId } = await context.params;

  try {
    const relayCase = await getRelayCaseById(caseId);
    if (!relayCase || relayCase.userId !== userId) {
      return NextResponse.json({ error: "Agent request not found." }, { status: 404 });
    }

    const nextAwaitingStep = relayCase.steps.find(
      (step) => step.assignee === "user" && step.requiresUserPresence && step.status !== "completed"
    );
    if (!nextAwaitingStep) {
      return NextResponse.json({ error: "No pending user-presence step found." }, { status: 400 });
    }

    const steps = relayCase.steps.map((step) =>
      step.id === nextAwaitingStep.id
        ? { ...step, status: "completed" as const, completedAt: new Date().toISOString() }
        : step
    );

    const remainingPending = steps.some((step) => step.status !== "completed");
    const updated = await updateRelayCase(caseId, {
      steps,
      status: remainingPending ? "in_progress" : "completed",
      eventType: remainingPending ? "step_updated" : "case_completed",
      eventMessage: remainingPending
        ? `User confirmed completion: ${nextAwaitingStep.title}.`
        : "All relay steps completed.",
      actor: "user",
    });

    return NextResponse.json({ case: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update user step." },
      { status: 500 }
    );
  }
}
