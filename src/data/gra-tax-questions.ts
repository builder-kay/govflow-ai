import type { SmartQuestion } from "@/types";

export const graTaxQuestions: SmartQuestion[] = [
  {
    id: "gra-taxpayer-type",
    question: "What type of taxpayer are you today?",
    whyWeAsk: "Tax setup and filing obligations differ for individuals, sole businesses, and companies.",
    options: [
      { id: "individual", label: "Individual / employee" },
      { id: "self-employed", label: "Self-employed / sole proprietor" },
      { id: "company", label: "Registered company / partnership" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },
  {
    id: "gra-tax-location",
    question: "Which location is easiest for GRA support?",
    whyWeAsk: "This helps us suggest follow-up channels and practical office planning.",
    options: [
      { id: "accra", label: "Accra" },
      { id: "cape-coast", label: "Cape Coast" },
      { id: "kumasi", label: "Kumasi" },
      { id: "other", label: "Another region" },
    ],
  },
  {
    id: "gra-tax-need-tin",
    question: "Do you already have your tax number (TIN/Ghana Card PIN linked)?",
    whyWeAsk: "You need this before filing returns, paying taxes, and using most GRA taxpayer services.",
    options: [
      { id: "yes", label: "Yes, I have it" },
      { id: "no", label: "No, I need help getting it" },
      { id: "unsure", label: "Not sure if mine is active" },
    ],
  },
  {
    id: "gra-tax-income-range",
    question: "What is your monthly taxable income range (estimate)?",
    whyWeAsk: "We use this to show a simple estimate and what to prepare before filing.",
    options: [
      { id: "below-3000", label: "Below GHS 3,000" },
      { id: "3000-10000", label: "GHS 3,000 - 10,000" },
      { id: "10000-30000", label: "GHS 10,000 - 30,000" },
      { id: "above-30000", label: "Above GHS 30,000" },
    ],
  },
  {
    id: "gra-tax-records",
    question: "How ready are your tax records?",
    whyWeAsk: "Missing records and receipts are one of the biggest reasons for filing stress and penalties.",
    options: [
      { id: "ready", label: "I keep proper records and receipts" },
      { id: "partial", label: "I have some records but not complete" },
      { id: "none", label: "I need help setting up records" },
    ],
  },
];

export const graTaxAnswerKeys = [
  "graTaxpayerType",
  "graTaxLocation",
  "graTaxNeedTin",
  "graTaxIncomeRange",
  "graTaxRecordKeeping",
] as const;

export const graTaxQuestionKeyMap: Record<string, (typeof graTaxAnswerKeys)[number]> = {
  "gra-taxpayer-type": "graTaxpayerType",
  "gra-tax-location": "graTaxLocation",
  "gra-tax-need-tin": "graTaxNeedTin",
  "gra-tax-income-range": "graTaxIncomeRange",
  "gra-tax-records": "graTaxRecordKeeping",
};
