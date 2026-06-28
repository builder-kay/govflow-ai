export type RelayServiceType = "passport";

export type RelayCaseStatus =
  | "intake_received"
  | "payment_pending"
  | "ops_triage"
  | "in_progress"
  | "awaiting_user"
  | "completed"
  | "cancelled";

export type RelayStepAssignee = "govflow_coordinator" | "field_runner" | "user";

export type RelayStepStatus = "pending" | "in_progress" | "awaiting_user" | "completed" | "blocked";

export type RelayEventType =
  | "case_created"
  | "payment_initialized"
  | "payment_confirmed"
  | "ops_assigned"
  | "step_updated"
  | "presence_required"
  | "case_completed"
  | "note";

export interface RelayContactDetails {
  fullName: string;
  phone: string;
  email?: string;
}

export interface RelayPassportDetails {
  applicationType: "first_time" | "renewal" | "replacement";
  preferredRegion: string;
  urgentTravelDate?: string;
  hasGhanaCard: boolean;
  hasBirthCertificate: boolean;
  needsPickupSupport: boolean;
}

export interface RelayConsent {
  allowOfficeFollowups: boolean;
  allowDocumentHandling: boolean;
  acceptedFeePolicy: boolean;
  acceptedLegalNotice: boolean;
}

export interface RelayCaseRequest {
  serviceType: RelayServiceType;
  contact: RelayContactDetails;
  passportDetails: RelayPassportDetails;
  consent: RelayConsent;
  notes?: string;
}

export interface RelayCaseStep {
  id: string;
  title: string;
  description: string;
  assignee: RelayStepAssignee;
  status: RelayStepStatus;
  dueAt?: string;
  completedAt?: string;
  requiresUserPresence: boolean;
}

export interface RelayCaseEvent {
  id: string;
  type: RelayEventType;
  message: string;
  createdAt: string;
  actor: string;
}

export interface RelayDocumentMeta {
  id: string;
  caseId: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  storagePath?: string;
}

export interface RelayCase {
  id: string;
  userId: string;
  serviceType: RelayServiceType;
  status: RelayCaseStatus;
  feeGhs: number;
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";
  paystackReference?: string;
  paystackAuthorizationUrl?: string;
  assignedCoordinator?: string;
  assignedRunner?: string;
  slaHours: number;
  intake: RelayCaseRequest;
  steps: RelayCaseStep[];
  events: RelayCaseEvent[];
  documents: RelayDocumentMeta[];
  createdAt: string;
  updatedAt: string;
}

export interface RelayCaseMetrics {
  totalCases: number;
  completedCases: number;
  awaitingUserCases: number;
  averageCompletionHours: number;
  averageFirstActionHours: number;
  presenceAlertsSent: number;
}
