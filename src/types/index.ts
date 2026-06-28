export type RiskLevel = "low" | "medium" | "high";
export type StepStatus = "not_started" | "in_progress" | "completed" | "locked" | "needs_review";
export type ChecklistPriority = "required" | "optional" | "depends";

export interface Service {
  id: string;
  title: string;
  description: string;
  overview: string;
  involves: string[];
  agency: string;
  icon: string;
  requiredDocuments: string[];
  estimatedTimeline: string;
  feeNote: string;
  commonDelayReasons: string[];
  steps: string[];
}

export interface ServiceStepTask {
  id: string;
  label: string;
  description: string;
  whyItMatters?: string;
  checklistItemId?: string;
}

export interface ServiceStepGuide {
  id: string;
  serviceId: string;
  index: number;
  title: string;
  summary: string;
  agency: string;
  assistantTopic?: string;
  checklistItemIds: string[];
  tasks: ServiceStepTask[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  agency: string;
  status: StepStatus;
  description?: string;
  requiredAction?: string;
  documents?: string[];
  risk?: string;
  note?: string;
  condition?: string;
  checklist?: string[];
  buttonLabel: string;
  buttonHref?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  section: string;
  priority: ChecklistPriority;
  explanation: string;
  whyItMatters: string;
  completed: boolean;
  resourceLink?: {
    url: string;
    label: string;
  };
  helpActions?: ChecklistHelpAction[];
  showBusinessTypeHelp?: boolean;
}

export interface ChecklistHelpAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface Office {
  id: string;
  name: string;
  service: string;
  useCase: string;
  address: string;
  /** Ghana city/area id for filtering — see ghana-cities */
  city: string;
  osmQuery?: string;
  phone: string;
  hours?: string;
  confirmNote: string;
  portalUrl?: string;
  portalLabel?: string;
}

export interface RiskFactor {
  id: string;
  title: string;
  description: string;
}

export interface RiskFix {
  id: string;
  label: string;
  href?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  location: string;
  businessType: string;
  progress: number;
  riskLevel: RiskLevel;
  estimatedTime: string;
  mainNextStep: string;
  steps: RoadmapStep[];
  checklist: ChecklistItem[];
  agencies: string[];
  documents: string[];
  warnings: string[];
}

export interface SmartQuestion {
  id: string;
  question: string;
  whyWeAsk: string;
  options: { id: string; label: string }[];
  showBusinessTypeHelp?: boolean;
}

export interface SavedRoadmapSummary {
  id: string;
  title: string;
  location: string;
  progress: number;
  riskLevel: RiskLevel;
  nextStep: string;
}

export type RoadmapInstanceStatus = "active" | "paused";

export interface SavedRoadmapInstance {
  serviceId: string;
  checklist: ChecklistItem[];
  roadmap: Roadmap;
  answers: UserAnswers;
  hasCompletedQuestions: boolean;
  status: RoadmapInstanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAnalysis {
  documentType: string;
  purpose: string;
  importantSections: string[];
  missingAreas: string[];
  nextAction: string;
}

export type SavedDocumentStatus = "processing" | "ready" | "error";

export interface SavedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  summary?: string;
  /** Extracted text stored for AI chat memory (truncated for localStorage) */
  extractedText?: string;
  /** Structured analysis shown on the documents page */
  analysis?: DocumentAnalysis;
  status?: SavedDocumentStatus;
}

export interface AccessibilitySettings {
  language: string;
  explanationStyle: "simple" | "normal" | "detailed";
  biggerText: boolean;
  voiceReading: boolean;
  highContrast: boolean;
  reduceAnimations: boolean;
  mode: "simple" | "quick";
}

export interface UserAnswers {
  businessType?: string;
  businessCategory?: string;
  /** @deprecated Use businessCategory instead */
  foodPreparation?: string;
  location?: string;
  businessName?: string;
  hiring?: string;
  passportType?: string;
  passportLocation?: string;
  passportGhanaCard?: string;
  passportBirthCert?: string;
  passportTravel?: string;
  ghanaCardType?: string;
  ghanaCardBirthCert?: string;
  ghanaCardContact?: string;
  ghanaCardLocation?: string;
  graTaxpayerType?: string;
  graTaxLocation?: string;
  graTaxNeedTin?: string;
  graTaxIncomeRange?: string;
  graTaxRecordKeeping?: string;
  nationalServiceCompletionStatus?: string;
  nationalServicePortalStatus?: string;
  nationalServiceRegionPreference?: string;
  nationalServicePostingStatus?: string;
}
