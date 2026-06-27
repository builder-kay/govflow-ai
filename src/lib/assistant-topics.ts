export interface AssistantTopicConfig {
  initialPrompt: string;
  greeting: string;
}

export const ASSISTANT_TOPICS: Record<string, AssistantTopicConfig> = {
  "registration-form": {
    initialPrompt:
      "I need help filling my business registration form. Can you guide me section by section?",
    greeting:
      "Upload your business registration form (PDF or photo) and I'll walk you through each section.",
  },
  "business-name": {
    initialPrompt: "How do I choose a good business name for registration in Ghana?",
    greeting: "Tell me your business idea and I'll help you pick strong name options.",
  },
  "business-address": {
    initialPrompt: "What business address should I use for registration if I work from home?",
    greeting: "Describe your setup and I'll help you decide what address to use on the form.",
  },
  "business-type": {
    initialPrompt:
      "Should I register as a sole proprietorship, partnership, or limited company for a small food business?",
    greeting: "Ask me to compare business types in simple language.",
  },
  "registration-fees": {
    initialPrompt: "How do I pay ORC business registration fees and what should I expect?",
    greeting: "I can explain fee payment steps. Always confirm current rates on the official ORC site.",
  },
  "payment-receipt": {
    initialPrompt: "I lost my business registration payment receipt. What should I do?",
    greeting: "Tell me what happened and I'll suggest next steps to recover or replace proof of payment.",
  },
  "registration-certificate": {
    initialPrompt: "My business registration certificate is delayed. What can I do?",
    greeting: "Share where you are in the process and I'll help you follow up.",
  },
  "ghana-card": {
    initialPrompt: "How do I register for a Ghana Card? What documents do I need?",
    greeting: "I'll guide you through Ghana Card registration step by step.",
  },
  "ghana-card-pin": {
    initialPrompt: "How do I find or confirm my Ghana Card PIN for tax registration?",
    greeting: "Ask about Ghana Card PIN / TIN and I'll explain in simple terms.",
  },
  "gra-business": {
    initialPrompt: "How do I link my new business to GRA for tax setup in Ghana?",
    greeting: "Tell me your business stage and I'll guide your GRA next steps.",
  },
  "gra-tax-profile": {
    initialPrompt:
      "Help me understand my taxpayer category and what tax obligations I should prepare for in Ghana.",
    greeting:
      "Tell me if you are an individual, self-employed, or company and I will explain your likely GRA tax path.",
  },
  "gra-tax-records": {
    initialPrompt:
      "What records and receipts do I need to keep so I can calculate and file taxes correctly with GRA?",
    greeting:
      "Share your income/expense setup and I will help you prepare a practical tax record checklist.",
  },
  "gra-tax-calculate": {
    initialPrompt:
      "Help me estimate my taxes in Ghana and explain the calculation in simple steps before I file.",
    greeting:
      "I can help you estimate tax, understand assumptions, and prepare questions for official GRA confirmation.",
  },
  "gra-tax-filing": {
    initialPrompt:
      "Guide me through filing my tax return and paying taxes correctly on the GRA taxpayer portal.",
    greeting:
      "I will guide filing and payment steps in order, and show what to check before final submission.",
  },
  passport: {
    initialPrompt: "I need help applying for a Ghana passport. What are the steps?",
    greeting: "Tell me if you need a new passport, renewal, or replacement and I'll guide you.",
  },
  "national-service": {
    initialPrompt:
      "I am a final year student. Help me complete NSS registration and get posted successfully.",
    greeting:
      "I can guide your National Service process from school clearance to posting acceptance and reporting.",
  },
  "national-service-posting": {
    initialPrompt: "How do I check my NSS posting and accept it correctly?",
    greeting: "Tell me your current posting status and I will guide the exact next actions.",
  },
  "national-service-validation": {
    initialPrompt: "After posting, how do I report and complete NSS validation successfully?",
    greeting: "I can help you prepare for reporting, validation, and service record compliance.",
  },
  "national-service-mismatch": {
    initialPrompt:
      "My name or date of birth is inconsistent across NSS, school records, and Ghana Card. Should I use Gazette, Ghana Card update, or Affidavit, and in what order?",
    greeting:
      "I can guide you on mismatch resolution path: Gazette publication, Ghana Card correction, or Affidavit support based on your exact case.",
  },
  "passport-form": {
    initialPrompt: "I need help filling my Ghana passport application form. Can you guide me?",
    greeting: "Upload your passport application form and I'll walk you through each section.",
  },
  "passport-fees": {
    initialPrompt: "What are the current Ghana passport fees and how do I pay online?",
    greeting: "I can explain fee types and payment steps. Always confirm current rates on the official portal.",
  },
  "passport-appointment": {
    initialPrompt: "How do I book a passport biometric appointment at a PAC in Ghana?",
    greeting: "Tell me your nearest city and I'll help you plan your appointment booking.",
  },
  "passport-birth-cert": {
    initialPrompt: "I don't have a birth certificate. How can I get one for my passport application?",
    greeting: "I'll explain birth certificate options and what to do next for your passport.",
  },
  "passport-replacement": {
    initialPrompt: "My passport was lost/stolen/damaged. How do I apply for a replacement?",
    greeting: "Tell me what happened and I'll guide you through replacement steps.",
  },
  "passport-collection": {
    initialPrompt: "How do I track and collect my Ghana passport when it's ready?",
    greeting: "Share your application stage and I'll help you track or collect your passport.",
  },
  "ghana-card-missing-docs": {
    initialPrompt:
      "I am missing documents for Ghana Card registration. What alternatives or next steps do I have?",
    greeting: "Tell me what document is missing and I'll suggest practical next steps.",
  },
  "ghana-card-collection": {
    initialPrompt: "How do I follow up and collect my Ghana Card when processing takes long?",
    greeting: "Share your registration stage and I'll guide your follow-up steps.",
  },
};

export function getAssistantTopic(topic: string | null): AssistantTopicConfig | null {
  if (!topic) return null;
  return ASSISTANT_TOPICS[topic] ?? null;
}
