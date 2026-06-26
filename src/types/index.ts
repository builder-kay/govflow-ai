export type RiskLevel = "low" | "medium" | "high";
export type StepStatus = "not_started" | "in_progress" | "completed" | "locked" | "needs_review";
export type ChecklistPriority = "required" | "optional" | "depends";

export interface Service {
  id: string;
  title: string;
  description: string;
  agency: string;
  icon: string;
  requiredDocuments: string[];
  estimatedTimeline: string;
  feeNote: string;
  commonDelayReasons: string[];
  steps: string[];
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
}

export interface Office {
  id: string;
  name: string;
  service: string;
  useCase: string;
  address: string;
  phone: string;
  hours?: string;
  confirmNote: string;
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
}

export interface SavedRoadmapSummary {
  id: string;
  title: string;
  location: string;
  progress: number;
  riskLevel: RiskLevel;
  nextStep: string;
}

export interface DocumentAnalysis {
  documentType: string;
  purpose: string;
  importantSections: string[];
  missingAreas: string[];
  nextAction: string;
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
  foodPreparation?: string;
  location?: string;
  businessName?: string;
  hiring?: string;
}
