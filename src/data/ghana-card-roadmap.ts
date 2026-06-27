import type { RiskFactor, RiskFix, Roadmap } from "@/types";

export const ghanaCardRoadmap: Roadmap = {
  id: "ghana-card-service",
  title: "Ghana Card",
  location: "Ghana",
  businessType: "Identity registration",
  progress: 0,
  riskLevel: "low",
  estimatedTime: "1-4 weeks depending on centre activity and verification",
  mainNextStep: "Confirm your documents and start NIA registration support",
  agencies: ["National Identification Authority (NIA)"],
  documents: [
    "Birth certificate",
    "Supporting identity documents",
    "Contact details (phone and email)",
    "Previous ID (replacement or update, if available)",
  ],
  warnings: [
    "Missing birth certificate can delay registration",
    "Wrong personal details can cause verification issues",
    "Collection may take longer at busy centres",
  ],
  steps: [
    {
      id: "gc-step-1",
      title: "Confirm your document set",
      agency: "National Identification Authority",
      status: "not_started",
      requiredAction: "Gather birth certificate and any supporting IDs",
      risk: "Incomplete documents are a common reason people are turned back",
      buttonLabel: "Open checklist",
      buttonHref: "/checklist",
    },
    {
      id: "gc-step-2",
      title: "Start Ghana Card registration support",
      agency: "National Identification Authority",
      status: "not_started",
      note: "If unsure what to do, use GovFlow AI guidance before visiting the centre",
      buttonLabel: "Get guidance",
      buttonHref: "/assistant?topic=ghana-card",
    },
    {
      id: "gc-step-3",
      title: "Visit NIA service point",
      agency: "National Identification Authority",
      status: "not_started",
      requiredAction: "Attend registration/update/replacement with originals",
      buttonLabel: "Find offices",
      buttonHref: "/offices",
    },
    {
      id: "gc-step-4",
      title: "Track processing and collect card",
      agency: "National Identification Authority",
      status: "locked",
      requiredAction: "Keep your contact details active for status updates",
      buttonLabel: "Ask the AI assistant",
      buttonHref: "/assistant?topic=ghana-card-collection",
    },
  ],
  checklist: [
    {
      id: "gc-1",
      section: "Documents",
      label: "Prepare birth certificate",
      priority: "required",
      explanation: "Birth certificate is a core identity document for Ghana Card processing.",
      whyItMatters: "Without this, your registration may be delayed or paused.",
      completed: false,
    },
    {
      id: "gc-2",
      section: "Documents",
      label: "Gather supporting ID details",
      priority: "depends",
      explanation: "Bring any additional identity documents requested for your case.",
      whyItMatters:
        "Supporting proof helps NIA verify details faster, especially for updates or replacements.",
      completed: false,
    },
    {
      id: "gc-3",
      section: "Preparation",
      label: "Confirm active phone number and email",
      priority: "required",
      explanation: "Use active contacts for OTP and follow-up notifications.",
      whyItMatters: "You may miss important updates if your contact info is inactive.",
      completed: false,
    },
    {
      id: "gc-4",
      section: "Preparation",
      label: "Choose your nearest NIA service point",
      priority: "required",
      explanation: "Pick the most practical centre to reduce travel and waiting stress.",
      whyItMatters: "Planning where to go helps you finish quickly and avoid repeat trips.",
      completed: false,
    },
    {
      id: "gc-5",
      section: "Application",
      label: "Complete registration/update/replacement request",
      priority: "required",
      explanation: "Follow NIA officer instructions and verify details before submission.",
      whyItMatters: "Small errors in names or dates can affect future services.",
      completed: false,
    },
    {
      id: "gc-6",
      section: "Collection",
      label: "Track processing and collect your Ghana Card",
      priority: "required",
      explanation: "Keep your reference details and follow collection instructions.",
      whyItMatters: "Collection delays are easier to resolve when you keep your records.",
      completed: false,
    },
  ],
};

export const ghanaCardRiskFactors: RiskFactor[] = [
  {
    id: "gc-risk-1",
    title: "Birth certificate may be missing",
    description: "You may not be ready with the key identity document required for processing.",
  },
  {
    id: "gc-risk-2",
    title: "Contact details are not ready",
    description: "Missing active phone/email can affect updates and verification.",
  },
  {
    id: "gc-risk-3",
    title: "NIA location not confirmed",
    description: "Without a clear service point plan, people often delay or miss follow-up.",
  },
];

export const ghanaCardRiskFixes: RiskFix[] = [
  { id: "gc-fix-1", label: "Review Ghana Card checklist", href: "/checklist" },
  {
    id: "gc-fix-2",
    label: "Ask how to replace missing documents",
    href: "/assistant?topic=ghana-card-missing-docs",
  },
  { id: "gc-fix-3", label: "Find NIA office support", href: "/offices" },
  { id: "gc-fix-4", label: "Get guided help in AI assistant", href: "/assistant?topic=ghana-card" },
];
