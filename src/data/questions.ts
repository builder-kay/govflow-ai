import type { SmartQuestion } from "@/types";

export const foodBusinessQuestions: SmartQuestion[] = [
  {
    id: "business-type",
    question: "What type of business do you want to register?",
    whyWeAsk: "Different business types have different registration forms, fees, and requirements.",
    showBusinessTypeHelp: true,
    options: [
      { id: "sole", label: "Sole proprietorship" },
      { id: "partnership", label: "Partnership" },
      { id: "limited", label: "Limited company" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "food-preparation",
    question: "Will you prepare or package the food yourself?",
    whyWeAsk: "If you prepare or package food, you may need FDA food hygiene approval and food-handler certificates.",
    options: [
      { id: "yes-cook", label: "Yes, I will cook or package the food" },
      { id: "delivery-only", label: "No, I will only deliver" },
      { id: "shared-kitchen", label: "I will use a shared kitchen" },
      { id: "unsure", label: "I'm not sure yet" },
    ],
  },
  {
    id: "location",
    question: "Do you already have a business location?",
    whyWeAsk: "Your location affects local assembly permits, FDA inspection, and the address on your registration.",
    options: [
      { id: "shop", label: "Yes, I have a shop or kitchen" },
      { id: "home", label: "I work from home" },
      { id: "shared", label: "I use a shared kitchen" },
      { id: "not-yet", label: "Not yet" },
    ],
  },
  {
    id: "business-name",
    question: "Do you already have a business name?",
    whyWeAsk: "You need a unique name for registration. Having 2–3 options helps avoid delays.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "ideas", label: "I have a few ideas" },
    ],
  },
  {
    id: "hiring",
    question: "Will you hire workers soon?",
    whyWeAsk: "Hiring may affect tax obligations, labour requirements, and business category.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },
];
