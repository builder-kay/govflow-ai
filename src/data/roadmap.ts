import type { Roadmap, RiskFactor, RiskFix, SavedRoadmapSummary, DocumentAnalysis } from "@/types";
import {
  buildStartBusinessRiskFactors,
  buildStartBusinessRiskFixes,
  startBusinessBaseRoadmap,
} from "@/lib/start-business-roadmap";

/** @deprecated Use startBusinessBaseRoadmap from @/lib/start-business-roadmap */
export const foodDeliveryRoadmap: Roadmap = startBusinessBaseRoadmap;

export const startBusinessRoadmap: Roadmap = startBusinessBaseRoadmap;

export const riskFactors: RiskFactor[] = buildStartBusinessRiskFactors({});
export const riskFixes: RiskFix[] = buildStartBusinessRiskFixes({});

export const savedRoadmaps: SavedRoadmapSummary[] = [
  {
    id: "start-business",
    title: "Business Startup",
    location: "Ghana",
    progress: 25,
    riskLevel: "medium",
    nextStep: "Check business name",
  },
  {
    id: "passport-renewal",
    title: "Passport Renewal",
    location: "Accra",
    progress: 60,
    riskLevel: "low",
    nextStep: "Biometric appointment",
  },
  {
    id: "ghana-card-replacement",
    title: "Ghana Card Replacement",
    location: "Kumasi",
    progress: 10,
    riskLevel: "low",
    nextStep: "Prepare replacement documents",
  },
];

export const mockDocumentAnalysis: DocumentAnalysis = {
  documentType: "FDA Food Hygiene Permit Form",
  purpose:
    "This form helps the FDA understand your food business, location, food activities, and hygiene readiness before approval or inspection.",
  importantSections: [
    "Business name",
    "Business location",
    "Type of food activity",
    "Food-handler information",
    "Declaration and signature",
  ],
  missingAreas: [
    "Signature is missing",
    "Full business location is incomplete",
    "Food-handler certificate not attached",
    "Date field is empty",
  ],
  nextAction:
    "Complete the missing fields, attach required supporting documents, and confirm whether your food activity requires inspection.",
};
