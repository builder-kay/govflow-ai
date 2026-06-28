import type { SmartQuestion } from "@/types";

export const startBusinessQuestions: SmartQuestion[] = [
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
    id: "business-category",
    question: "What kind of business are you starting?",
    whyWeAsk: "Your industry affects which permits, inspections, and agencies you may need beyond basic registration.",
    options: [
      { id: "retail", label: "Retail / shop" },
      { id: "food", label: "Food & beverage (restaurant, catering, delivery)" },
      { id: "services", label: "Professional or personal services (salon, consulting, repairs)" },
      { id: "online", label: "Online / home-based business" },
      { id: "other", label: "Other / not sure yet" },
    ],
  },
  {
    id: "location",
    question: "Do you already have a business location?",
    whyWeAsk: "Your location affects local assembly permits, sector approvals, and the address on your registration.",
    options: [
      { id: "shop", label: "Yes, I have a shop or office" },
      { id: "home", label: "I work from home" },
      { id: "online", label: "I operate online only" },
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

/** @deprecated Use startBusinessQuestions instead */
export const foodBusinessQuestions = startBusinessQuestions;
