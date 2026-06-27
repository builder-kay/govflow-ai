import type { SmartQuestion } from "@/types";

export const ghanaCardQuestions: SmartQuestion[] = [
  {
    id: "gc-application-type",
    question: "What Ghana Card service do you need?",
    whyWeAsk: "New registration, replacement, and update requests use different steps.",
    options: [
      { id: "new", label: "New registration" },
      { id: "replacement", label: "Replacement (lost, stolen, damaged)" },
      { id: "update", label: "Update details (name, date of birth, etc.)" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "gc-has-birth-cert",
    question: "Do you have your birth certificate?",
    whyWeAsk: "Birth certificate is a key identity document for many Ghana Card requests.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "unsure", label: "Not sure where it is" },
    ],
  },
  {
    id: "gc-has-contact",
    question: "Do you have an active phone number and email?",
    whyWeAsk: "These help with notifications, OTP verification, and follow-up.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "phone-only", label: "Phone only" },
      { id: "none", label: "No, not ready yet" },
    ],
  },
  {
    id: "gc-location",
    question: "Which area is easiest for you to visit for registration?",
    whyWeAsk: "We'll tailor your plan to the nearest NIA service point.",
    options: [
      { id: "accra", label: "Accra" },
      { id: "cape-coast", label: "Cape Coast" },
      { id: "kumasi", label: "Kumasi" },
      { id: "other", label: "Another region" },
    ],
  },
];

export const ghanaCardAnswerKeys = [
  "ghanaCardType",
  "ghanaCardBirthCert",
  "ghanaCardContact",
  "ghanaCardLocation",
] as const;

export const ghanaCardQuestionKeyMap: Record<
  string,
  (typeof ghanaCardAnswerKeys)[number]
> = {
  "gc-application-type": "ghanaCardType",
  "gc-has-birth-cert": "ghanaCardBirthCert",
  "gc-has-contact": "ghanaCardContact",
  "gc-location": "ghanaCardLocation",
};
