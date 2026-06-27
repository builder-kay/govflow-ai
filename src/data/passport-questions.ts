import type { SmartQuestion } from "@/types";

export const passportQuestions: SmartQuestion[] = [
  {
    id: "passport-type",
    question: "What passport service do you need?",
    whyWeAsk: "New, renewal, and replacement applications have different forms, documents, and steps.",
    options: [
      { id: "new", label: "New passport (first time)" },
      { id: "renewal", label: "Renewal" },
      { id: "replacement", label: "Replacement (lost, stolen, or damaged)" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "passport-location",
    question: "Which Passport Application Centre (PAC) is closest to you?",
    whyWeAsk: "You must book an appointment at a PAC for biometrics after applying online.",
    options: [
      { id: "accra", label: "Accra" },
      { id: "cape-coast", label: "Cape Coast" },
      { id: "kumasi", label: "Kumasi" },
      { id: "other", label: "Another region" },
    ],
  },
  {
    id: "passport-ghana-card",
    question: "Do you have a valid Ghana Card?",
    whyWeAsk: "Ghana Card is the main ID used for passport applications in Ghana.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "expired", label: "Expired or needs update" },
    ],
  },
  {
    id: "passport-birth-cert",
    question: "Do you have your birth certificate?",
    whyWeAsk: "First-time applicants usually need a birth certificate to prove Ghanaian citizenship.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "unsure", label: "Not sure where it is" },
    ],
  },
  {
    id: "passport-travel",
    question: "When do you need to travel?",
    whyWeAsk: "Passport processing times vary. This helps us flag urgency and appointment planning.",
    options: [
      { id: "soon", label: "Within 1–2 months" },
      { id: "later", label: "In 3–6 months" },
      { id: "no-rush", label: "No fixed date yet" },
    ],
  },
];

export const passportAnswerKeys = [
  "passportType",
  "passportLocation",
  "passportGhanaCard",
  "passportBirthCert",
  "passportTravel",
] as const;

export const passportQuestionKeyMap: Record<string, (typeof passportAnswerKeys)[number]> = {
  "passport-type": "passportType",
  "passport-location": "passportLocation",
  "passport-ghana-card": "passportGhanaCard",
  "passport-birth-cert": "passportBirthCert",
  "passport-travel": "passportTravel",
};
