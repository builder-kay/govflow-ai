import type { RiskFactor, RiskFix, Roadmap, SmartQuestion } from "@/types";
import { foodDeliveryRoadmap, riskFactors, riskFixes } from "@/data/roadmap";
import { foodBusinessQuestions } from "@/data/questions";
import {
  passportAnswerKeys,
  passportQuestionKeyMap,
  passportQuestions,
} from "@/data/passport-questions";
import { passportRoadmap, passportRiskFactors, passportRiskFixes } from "@/data/passport-roadmap";
import {
  ghanaCardAnswerKeys,
  ghanaCardQuestionKeyMap,
  ghanaCardQuestions,
} from "@/data/ghana-card-questions";
import {
  ghanaCardRoadmap,
  ghanaCardRiskFactors,
  ghanaCardRiskFixes,
} from "@/data/ghana-card-roadmap";
import {
  graTaxAnswerKeys,
  graTaxQuestionKeyMap,
  graTaxQuestions,
} from "@/data/gra-tax-questions";
import { graTaxRoadmap, graTaxRiskFactors, graTaxRiskFixes } from "@/data/gra-tax-roadmap";
import {
  nationalServiceAnswerKeys,
  nationalServiceQuestionKeyMap,
  nationalServiceQuestions,
} from "@/data/national-service-questions";
import {
  nationalServiceRoadmap,
  nationalServiceRiskFactors,
  nationalServiceRiskFixes,
} from "@/data/national-service-roadmap";

export interface ServiceFlow {
  id: string;
  questions: SmartQuestion[];
  questionKeyMap: Record<string, string>;
  answerKeys: readonly string[];
  roadmap: Roadmap;
  riskFactors: RiskFactor[];
  riskFixes: RiskFix[];
  checklistTitle: string;
  checklistDescription: string;
  roadmapTitle: string;
  roadmapDescription: string;
  generatingMessage: string;
}

const startBusinessFlow: ServiceFlow = {
  id: "start-business",
  questions: foodBusinessQuestions,
  questionKeyMap: {
    "business-type": "businessType",
    "food-preparation": "foodPreparation",
    location: "location",
    "business-name": "businessName",
    hiring: "hiring",
  },
  answerKeys: ["businessType", "foodPreparation", "location", "businessName", "hiring"],
  roadmap: foodDeliveryRoadmap,
  riskFactors,
  riskFixes,
  checklistTitle: "Food Business Startup Checklist",
  checklistDescription:
    "Track every task you need to complete for your food delivery business in Cape Coast.",
  roadmapTitle: "Your Food Business Roadmap",
  roadmapDescription:
    "Based on your answers, here is a step-by-step plan for starting a small food delivery business in Cape Coast.",
  generatingMessage:
    "Building steps for business registration, tax, FDA, and local permits in Cape Coast.",
};

const passportFlow: ServiceFlow = {
  id: "passport",
  questions: passportQuestions,
  questionKeyMap: passportQuestionKeyMap,
  answerKeys: passportAnswerKeys,
  roadmap: passportRoadmap,
  riskFactors: passportRiskFactors,
  riskFixes: passportRiskFixes,
  checklistTitle: "Passport Application Checklist",
  checklistDescription:
    "Track documents, online application, payment, appointment, and collection for your Ghana passport.",
  roadmapTitle: "Your Passport Roadmap",
  roadmapDescription:
    "Based on your answers, here is a step-by-step plan for your Ghana passport application.",
  generatingMessage: "Building steps for documents, online application, appointment, and collection.",
};

const ghanaCardFlow: ServiceFlow = {
  id: "ghana-card",
  questions: ghanaCardQuestions,
  questionKeyMap: ghanaCardQuestionKeyMap,
  answerKeys: ghanaCardAnswerKeys,
  roadmap: ghanaCardRoadmap,
  riskFactors: ghanaCardRiskFactors,
  riskFixes: ghanaCardRiskFixes,
  checklistTitle: "Ghana Card Checklist",
  checklistDescription:
    "Track document preparation, registration, and collection steps for your Ghana Card.",
  roadmapTitle: "Your Ghana Card Roadmap",
  roadmapDescription:
    "Based on your answers, here is a step-by-step plan to complete your Ghana Card process.",
  generatingMessage: "Building steps for document checks, registration support, and collection.",
};

const graTaxFlow: ServiceFlow = {
  id: "gra-tin",
  questions: graTaxQuestions,
  questionKeyMap: graTaxQuestionKeyMap,
  answerKeys: graTaxAnswerKeys,
  roadmap: graTaxRoadmap,
  riskFactors: graTaxRiskFactors,
  riskFixes: graTaxRiskFixes,
  checklistTitle: "GRA / Tax Checklist",
  checklistDescription:
    "Track taxpayer setup, record preparation, tax estimation, filing, and payment follow-up.",
  roadmapTitle: "Your GRA / Tax Roadmap",
  roadmapDescription:
    "Based on your answers, here is a practical plan to understand, calculate, and file your taxes with GRA guidance.",
  generatingMessage:
    "Building tax setup, tax number, filing, and tax calculation guidance for your profile.",
};

const nationalServiceFlow: ServiceFlow = {
  id: "national-service",
  questions: nationalServiceQuestions,
  questionKeyMap: nationalServiceQuestionKeyMap,
  answerKeys: nationalServiceAnswerKeys,
  roadmap: nationalServiceRoadmap,
  riskFactors: nationalServiceRiskFactors,
  riskFixes: nationalServiceRiskFixes,
  checklistTitle: "National Service Checklist",
  checklistDescription:
    "Track every step from school clearance through posting acceptance and service validation.",
  roadmapTitle: "Your National Service Roadmap",
  roadmapDescription:
    "Based on your answers, here is a clear plan to complete NSS posting and reporting successfully.",
  generatingMessage:
    "Building your national service plan for clearance, posting checks, acceptance, and reporting.",
};

const SERVICE_FLOWS: Record<string, ServiceFlow> = {
  "start-business": startBusinessFlow,
  passport: passportFlow,
  "national-service": nationalServiceFlow,
  "ghana-card": ghanaCardFlow,
  "gra-tin": graTaxFlow,
};

export function getServiceFlow(serviceId: string | null | undefined): ServiceFlow {
  if (serviceId && SERVICE_FLOWS[serviceId]) {
    return SERVICE_FLOWS[serviceId];
  }
  return startBusinessFlow;
}

export function getSupportedServiceIds(): string[] {
  return Object.keys(SERVICE_FLOWS);
}

export function serviceHasQuestions(serviceId: string): boolean {
  return Boolean(SERVICE_FLOWS[serviceId]);
}
