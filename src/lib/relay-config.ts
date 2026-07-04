import type {
  RelayCaseMetrics,
  RelayCaseRequest,
  RelayCaseStep,
  RelayServiceType,
} from "@/types/relay";

export const RELAY_FEATURE_NAME = "GovFlow Agent";
export const RELAY_PILOT_SERVICE: RelayServiceType = "passport";
export const RELAY_DEFAULT_FEE_GHS = 280;
export const RELAY_DEFAULT_SLA_HOURS = 72;
export const RELAY_DOCUMENTS_BUCKET = process.env.RELAY_DOCUMENTS_BUCKET || "relay-documents";
export const RELAY_REQUIRED_PASSPORT_DOCUMENTS = [
  "Birth certificate (or affidavit where applicable)",
  "Ghana Card (front and back)",
  "Passport photograph page requirements confirmation",
  "Proof of address (utility bill or tenancy document)",
];

export function buildRelayPassportSteps(_request: RelayCaseRequest): RelayCaseStep[] {
  return [
    {
      id: crypto.randomUUID(),
      title: "Admin review of your intake",
      description:
        "GovFlow admin verifies your request details and confirms whether everything is ready to proceed.",
      assignee: "govflow_coordinator",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "WhatsApp consultation and agreement",
      description:
        "Admin reaches you on WhatsApp to align scope, timeline, and final service fee before payment.",
      assignee: "user",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Secure payment confirmation",
      description:
        "After agreement, you return to GovFlow to make secure payment and unlock active case handling.",
      assignee: "user",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Upload passport supporting documents",
      description:
        "Submit your birth certificate, Ghana Card, and related documents for coordinated processing.",
      assignee: "user",
      status: "pending",
      requiresUserPresence: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Passport portal form support",
      description:
        "GovFlow validates your uploads, prepares forms, and confirms details before official submission.",
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
