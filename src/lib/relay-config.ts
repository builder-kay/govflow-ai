import type {
  RelayCaseMetrics,
  RelayCaseRequest,
  RelayCaseStep,
  RelayServiceType,
} from "@/types/relay";

export const RELAY_FEATURE_NAME = "GovFlow Relay";
export const RELAY_PILOT_SERVICE: RelayServiceType = "passport";
export const RELAY_DEFAULT_FEE_GHS = 280;
export const RELAY_DEFAULT_SLA_HOURS = 72;

export function buildRelayPassportSteps(_request: RelayCaseRequest): RelayCaseStep[] {
  return [
    {
      id: crypto.randomUUID(),
      title: "Intake verification and checklist review",
      description: "Coordinator validates your documents and confirms application category.",
      assignee: "govflow_coordinator",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Passport portal form support",
      description: "GovFlow helps complete and verify online form details before submission.",
      assignee: "govflow_coordinator",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Appointment booking and readiness",
      description: "GovFlow secures suitable slots and confirms your in-person requirements.",
      assignee: "govflow_coordinator",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Biometric capture visit",
      description: "You attend the appointment; GovFlow sends exact instructions and reminders.",
      assignee: "user",
      status: "pending",
      requiresUserPresence: true,
    },
    {
      id: crypto.randomUUID(),
      title: "Office follow-ups and status checks",
      description:
        "Coordinator and field runner handle follow-ups until passport is ready for collection.",
      assignee: "field_runner",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Collection handoff",
      description: "You collect or authorize collection based on current immigration rules.",
      assignee: "user",
      status: "pending",
      requiresUserPresence: true,
    },
  ];
}

export function getEmptyRelayMetrics(): RelayCaseMetrics {
  return {
    totalCases: 0,
    completedCases: 0,
    awaitingUserCases: 0,
    averageCompletionHours: 0,
    averageFirstActionHours: 0,
    presenceAlertsSent: 0,
  };
}
