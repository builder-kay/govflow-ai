import type { ServiceStepGuide } from "@/types";
import { ORC_FEES_URL, ORC_NAME_SEARCH_URL } from "@/lib/orc-links";
import { GRA_MAIN_PORTAL_URL } from "@/lib/gra-tax-links";
import { PASSPORT_FEES_URL, PASSPORT_HOW_TO_APPLY_URL, PASSPORT_PORTAL_URL } from "@/lib/passport-links";
import { NIA_OFFICES_URL, NIA_PORTAL_URL } from "@/lib/ghana-card-links";
import { NSS_PORTAL_URL } from "@/lib/nss-links";

const START_BUSINESS_GUIDES: ServiceStepGuide[] = [
  {
    id: "sb-name",
    serviceId: "start-business",
    index: 0,
    title: "Choose and check your business name",
    summary:
      "Before you register, confirm that your business name is available and suitable for ORC. Prepare two or three backup options in case your first choice is taken or too similar to an existing name.",
    agency: "Office of the Registrar of Companies (ORC)",
    assistantTopic: "business-name",
    checklistItemIds: ["br-1"],
    tasks: [
      {
        id: "sb-name-1",
        label: "Write down 2–3 possible business names",
        description: "Pick names that describe your business and are easy to remember. Avoid names that are too close to well-known brands.",
        whyItMatters: "If your first name is rejected, having backups saves time and avoids restarting the process.",
        checklistItemId: "br-1",
      },
      {
        id: "sb-name-2",
        label: "Search name availability on the ORC portal",
        description: "Use the official ORC name search tool to check whether each name is likely available before you apply.",
        whyItMatters: "Submitting a taken or similar name is one of the most common registration delays.",
        checklistItemId: "br-1",
      },
    ],
  },
  {
    id: "sb-orc",
    serviceId: "start-business",
    index: 1,
    title: "Register with ORC",
    summary:
      "This is the core registration step. You will confirm your business type, address, owner details, and Ghana Card, then complete the ORC form, pay the official fee, and collect your registration certificate.",
    agency: "Office of the Registrar of Companies (ORC)",
    assistantTopic: "registration-form",
    checklistItemIds: ["br-2", "br-3", "br-4", "br-5", "br-6", "br-7", "br-8"],
    tasks: [
      {
        id: "sb-orc-1",
        label: "Confirm your full business address",
        description: "Use a complete address with area, landmark, or digital address — not just the city name.",
        checklistItemId: "br-2",
      },
      {
        id: "sb-orc-2",
        label: "Prepare your Ghana Card",
        description: "You need a valid Ghana Card for identity verification during registration.",
        checklistItemId: "br-3",
      },
      {
        id: "sb-orc-3",
        label: "Decide your business type",
        description: "Choose sole proprietorship, partnership, or limited company based on how you will run the business.",
        checklistItemId: "br-4",
      },
      {
        id: "sb-orc-4",
        label: "Complete the ORC registration form",
        description: "Fill every section accurately. Upload the form in the AI assistant if you want guided help.",
        checklistItemId: "br-5",
      },
      {
        id: "sb-orc-5",
        label: "Pay the official ORC fee",
        description: "Confirm the current fee on the official ORC website before paying and keep your receipt safe.",
        checklistItemId: "br-6",
      },
      {
        id: "sb-orc-6",
        label: "Save your payment receipt",
        description: "Store digital and physical copies — you may need proof of payment later.",
        checklistItemId: "br-7",
      },
      {
        id: "sb-orc-7",
        label: "Collect your registration certificate",
        description: "Download or collect your certificate once ORC processing is complete.",
        checklistItemId: "br-8",
      },
    ],
  },
  {
    id: "sb-tax",
    serviceId: "start-business",
    index: 2,
    title: "Set up GRA / tax registration",
    summary:
      "After ORC registration, link your business to the Ghana Revenue Authority. Your Ghana Card PIN often serves as your individual TIN; businesses may need additional tax setup and record-keeping from day one.",
    agency: "Ghana Revenue Authority (GRA)",
    assistantTopic: "gra-business",
    checklistItemIds: ["tax-1", "tax-2", "tax-3", "tax-4"],
    tasks: [
      {
        id: "sb-tax-1",
        label: "Confirm your Ghana Card PIN / TIN",
        description: "Your Ghana Card PIN is linked to your taxpayer identity for individuals.",
        checklistItemId: "tax-1",
      },
      {
        id: "sb-tax-2",
        label: "Link business details to GRA",
        description: "Register or update your business tax profile after receiving your ORC certificate.",
        checklistItemId: "tax-2",
      },
      {
        id: "sb-tax-3",
        label: "Start keeping tax records",
        description: "Track income, expenses, and receipts from your first day of operation.",
        checklistItemId: "tax-3",
      },
      {
        id: "sb-tax-4",
        label: "Ask GRA about your tax obligations",
        description: "Confirm filing requirements, deadlines, and categories that apply to your business type.",
        checklistItemId: "tax-4",
      },
    ],
  },
  {
    id: "sb-permits",
    serviceId: "start-business",
    index: 3,
    title: "Apply for relevant permits",
    summary:
      "Some businesses need extra approvals beyond ORC registration. Food businesses may need FDA hygiene permits; other industries may need sector-specific licences from regulators like EPA or GSA.",
    agency: "Sector regulator (e.g. FDA, EPA, GSA)",
    assistantTopic: "registration-form",
    checklistItemIds: ["fda-1", "fda-2", "fda-3", "fda-4", "fda-5", "perm-1", "perm-2", "perm-3"],
    tasks: [
      {
        id: "sb-perm-1",
        label: "Confirm whether your industry needs extra permits",
        description: "Check if food, health, environment, or trade rules apply to your business category.",
        checklistItemId: "perm-1",
      },
      {
        id: "sb-perm-2",
        label: "Contact the relevant agency",
        description: "Ask what documents, fees, and inspections are required for your specific activity.",
        checklistItemId: "perm-2",
      },
      {
        id: "sb-perm-3",
        label: "Prepare and submit sector application documents",
        description: "Gather business details, location proof, and any certificates the agency requests.",
        checklistItemId: "perm-3",
      },
    ],
  },
  {
    id: "sb-assembly",
    serviceId: "start-business",
    index: 4,
    title: "Get local assembly approval and prepare to operate",
    summary:
      "Most businesses need an operating permit from their metropolitan or municipal assembly before they can legally trade. Confirm fees, documents, and inspection requirements for your area.",
    agency: "Metropolitan / Municipal Assembly",
    assistantTopic: "business-address",
    checklistItemIds: ["la-1", "la-2", "la-3", "la-4"],
    tasks: [
      {
        id: "sb-asm-1",
        label: "Contact your local assembly",
        description: "Ask which office handles business operating permits in your municipality.",
        checklistItemId: "la-1",
      },
      {
        id: "sb-asm-2",
        label: "Confirm operating permit requirements",
        description: "Get the list of documents, fees, and expected processing time.",
        checklistItemId: "la-2",
      },
      {
        id: "sb-asm-3",
        label: "Confirm your local business fee category",
        description: "Your business type determines the fee band — verify before paying.",
        checklistItemId: "la-3",
      },
      {
        id: "sb-asm-4",
        label: "Save your permit and receipt",
        description: "Keep copies ready for inspections and renewals.",
        checklistItemId: "la-4",
      },
    ],
  },
];

const PASSPORT_GUIDES: ServiceStepGuide[] = [
  {
    id: "pp-requirements",
    serviceId: "passport",
    index: 0,
    title: "Check requirements",
    summary: "Confirm whether you need a new passport, renewal, or replacement, and gather the documents your application type requires.",
    agency: "Ghana Immigration Service",
    assistantTopic: "passport-form",
    checklistItemIds: ["pp-1", "pp-2", "pp-3", "pp-4"],
    tasks: [
      { id: "pp-req-1", label: "Prepare Ghana Card", description: "Valid national ID is required for most passport applications.", checklistItemId: "pp-1" },
      { id: "pp-req-2", label: "Prepare birth certificate (if first-time)", description: "First-time applicants usually need proof of citizenship.", checklistItemId: "pp-2" },
      { id: "pp-req-3", label: "Locate previous passport (renewal/replacement)", description: "Bring your old passport or report loss/theft for replacement.", checklistItemId: "pp-3" },
    ],
  },
  {
    id: "pp-apply",
    serviceId: "passport",
    index: 1,
    title: "Apply online on the official portal",
    summary: "Create an account on the Ghana Passport Application Portal, choose your application type, and complete the online form accurately.",
    agency: "Ghana Passport Application Portal",
    assistantTopic: "passport-form",
    checklistItemIds: ["pp-5", "pp-6", "pp-7"],
    tasks: [
      { id: "pp-app-1", label: "Open the official passport portal", description: "Register or sign in and start a new application.", checklistItemId: "pp-5" },
      { id: "pp-app-2", label: "Choose the correct application type", description: "Select new, renewal, or replacement — rules differ for each.", checklistItemId: "pp-6" },
      { id: "pp-app-3", label: "Complete and review the application form", description: "Double-check names and dates match your Ghana Card exactly.", checklistItemId: "pp-7" },
    ],
  },
  {
    id: "pp-pay",
    serviceId: "passport",
    index: 2,
    title: "Pay official processing fee",
    summary: "Pay through the official portal. Standard and expedited options may be available — confirm current fees before payment.",
    agency: "Ghana Passport Application Portal",
    assistantTopic: "passport-fees",
    checklistItemIds: ["pp-8"],
    tasks: [
      { id: "pp-pay-1", label: "Check current official fees", description: "Fees vary by processing speed and application type.", checklistItemId: "pp-8" },
      { id: "pp-pay-2", label: "Pay and save your receipt", description: "Keep proof of payment for your appointment and collection.", checklistItemId: "pp-8" },
    ],
  },
  {
    id: "pp-appointment",
    serviceId: "passport",
    index: 3,
    title: "Book and attend biometrics",
    summary: "Book a slot at your nearest Passport Application Centre (PAC), then attend with originals and your appointment slip.",
    agency: "Passport Application Centre (PAC)",
    assistantTopic: "passport-appointment",
    checklistItemIds: ["pp-9", "pp-10", "pp-11"],
    tasks: [
      { id: "pp-bio-1", label: "Book a PAC appointment", description: "Popular centres fill quickly — book as soon as payment is confirmed.", checklistItemId: "pp-9" },
      { id: "pp-bio-2", label: "Prepare originals for your appointment", description: "Bring printed application, Ghana Card, birth certificate, and payment proof.", checklistItemId: "pp-10" },
      { id: "pp-bio-3", label: "Attend biometrics and vetting", description: "Arrive early with all documents and your appointment slip.", checklistItemId: "pp-11" },
    ],
  },
  {
    id: "pp-collect",
    serviceId: "passport",
    index: 4,
    title: "Collect your passport",
    summary: "Track your application status on the official portal and collect your passport when notified.",
    agency: "Ghana Passport Application Portal",
    assistantTopic: "passport-collection",
    checklistItemIds: ["pp-12"],
    tasks: [
      { id: "pp-col-1", label: "Track application status online", description: "Use the portal to monitor processing progress.", checklistItemId: "pp-12" },
      { id: "pp-col-2", label: "Collect passport when ready", description: "Follow PAC instructions for collection and bring required ID.", checklistItemId: "pp-12" },
    ],
  },
];

const GHANA_CARD_GUIDES: ServiceStepGuide[] = [
  {
    id: "gc-docs",
    serviceId: "ghana-card",
    index: 0,
    title: "Confirm eligibility and documents",
    summary: "Gather birth certificate, proof of address, and any supporting IDs for registration, replacement, or update.",
    agency: "National Identification Authority (NIA)",
    assistantTopic: "ghana-card",
    checklistItemIds: ["gc-1", "gc-2"],
    tasks: [
      { id: "gc-d-1", label: "Prepare birth certificate", description: "Core identity document for Ghana Card processing.", checklistItemId: "gc-1" },
      { id: "gc-d-2", label: "Gather supporting ID details", description: "Bring additional documents if updating or replacing a card.", checklistItemId: "gc-2" },
    ],
  },
  {
    id: "gc-register",
    serviceId: "ghana-card",
    index: 1,
    title: "Prepare registration details",
    summary: "Confirm your contact details and application type before visiting an NIA centre.",
    agency: "National Identification Authority (NIA)",
    assistantTopic: "ghana-card",
    checklistItemIds: ["gc-3", "gc-4", "gc-5"],
    tasks: [
      { id: "gc-r-1", label: "Confirm active phone and email", description: "NIA uses these for status updates and collection notices.", checklistItemId: "gc-3" },
      { id: "gc-r-2", label: "Find your nearest NIA service point", description: "Check official office information before you travel.", checklistItemId: "gc-4" },
      { id: "gc-r-3", label: "Complete registration preparation", description: "Review forms and requirements on the NIA website.", checklistItemId: "gc-5" },
    ],
  },
  {
    id: "gc-visit",
    serviceId: "ghana-card",
    index: 2,
    title: "Visit registration centre",
    summary: "Attend your NIA centre with original documents for verification and biometric capture.",
    agency: "National Identification Authority (NIA)",
    assistantTopic: "ghana-card",
    checklistItemIds: ["gc-5"],
    tasks: [
      { id: "gc-v-1", label: "Attend with original documents", description: "Arrive with birth certificate and supporting IDs as required.", checklistItemId: "gc-5" },
      { id: "gc-v-2", label: "Complete verification and biometrics", description: "Follow centre staff instructions for capture and confirmation.", checklistItemId: "gc-5" },
    ],
  },
  {
    id: "gc-collect",
    serviceId: "ghana-card",
    index: 3,
    title: "Track status and collect card",
    summary: "Keep your contact details active and collect your Ghana Card when processing is complete.",
    agency: "National Identification Authority (NIA)",
    assistantTopic: "ghana-card-collection",
    checklistItemIds: ["gc-6"],
    tasks: [
      { id: "gc-c-1", label: "Wait for processing notification", description: "Processing times vary by centre workload.", checklistItemId: "gc-6" },
      { id: "gc-c-2", label: "Collect your Ghana Card", description: "Bring ID and any collection slip you were given.", checklistItemId: "gc-6" },
    ],
  },
];

const NATIONAL_SERVICE_GUIDES: ServiceStepGuide[] = [
  {
    id: "ns-clearance",
    serviceId: "national-service",
    index: 0,
    title: "Confirm institution clearance",
    summary: "Verify that your school has submitted your details to the National Service Authority before you expect a posting.",
    agency: "University / College + NSS",
    assistantTopic: "national-service",
    checklistItemIds: ["ns-1", "ns-2", "ns-3"],
    tasks: [
      { id: "ns-cl-1", label: "Confirm school submitted your details", description: "Check with your registrar or examinations office.", checklistItemId: "ns-1" },
      { id: "ns-cl-2", label: "Verify your index number and personal details", description: "Mismatches block posting validation.", checklistItemId: "ns-2" },
      { id: "ns-cl-3", label: "Resolve any name or date mismatch early", description: "Use Gazette, Ghana Card update, or Affidavit if records do not match.", checklistItemId: "ns-3" },
    ],
  },
  {
    id: "ns-portal",
    serviceId: "national-service",
    index: 1,
    title: "Register on the NSS portal",
    summary: "Create or recover your NSS portal profile and complete registration steps.",
    agency: "National Service Authority",
    assistantTopic: "national-service",
    checklistItemIds: ["ns-4"],
    tasks: [
      { id: "ns-p-1", label: "Open the NSS portal", description: "Use the official National Service Authority portal.", checklistItemId: "ns-4" },
      { id: "ns-p-2", label: "Create or recover your login", description: "Use an active phone number and email for notifications.", checklistItemId: "ns-4" },
    ],
  },
  {
    id: "ns-preferences",
    serviceId: "national-service",
    index: 2,
    title: "Verify details and region preferences",
    summary: "Review your personal information and set region preferences before posting is released.",
    agency: "National Service Authority",
    assistantTopic: "national-service-posting",
    checklistItemIds: ["ns-2", "ns-5"],
    tasks: [
      { id: "ns-pr-1", label: "Review personal details on the portal", description: "Fix any name or date-of-birth mismatches early.", checklistItemId: "ns-2" },
      { id: "ns-pr-2", label: "Prepare for posting release", description: "Know when your cohort posting window opens and what to check.", checklistItemId: "ns-5" },
    ],
  },
  {
    id: "ns-posting",
    serviceId: "national-service",
    index: 3,
    title: "Check posting and accept",
    summary: "When posting is released, check your assignment and accept within the validation window.",
    agency: "National Service Authority",
    assistantTopic: "national-service-posting",
    checklistItemIds: ["ns-5"],
    tasks: [
      { id: "ns-po-1", label: "Check your posting when released", description: "Log in promptly when the posting list opens.", checklistItemId: "ns-5" },
      { id: "ns-po-2", label: "Accept posting before deadline", description: "Missing the window may require follow-up with NSS.", checklistItemId: "ns-5" },
    ],
  },
  {
    id: "ns-report",
    serviceId: "national-service",
    index: 4,
    title: "Report and complete validation",
    summary: "Report to your assigned agency and complete NSS validation requirements.",
    agency: "Assigned agency + NSS",
    assistantTopic: "national-service-validation",
    checklistItemIds: ["ns-6", "ns-7"],
    tasks: [
      { id: "ns-re-1", label: "Report to assigned agency on time", description: "Follow the reporting instructions on your posting letter.", checklistItemId: "ns-6" },
      { id: "ns-re-2", label: "Complete service validation", description: "Finish validation steps and keep proof of completion.", checklistItemId: "ns-7" },
    ],
  },
];

const ALL_GUIDES: ServiceStepGuide[] = [
  ...START_BUSINESS_GUIDES,
  ...PASSPORT_GUIDES,
  ...GHANA_CARD_GUIDES,
  ...NATIONAL_SERVICE_GUIDES,
];

const GUIDES_BY_SERVICE: Record<string, ServiceStepGuide[]> = ALL_GUIDES.reduce(
  (acc, guide) => {
    if (!acc[guide.serviceId]) acc[guide.serviceId] = [];
    acc[guide.serviceId].push(guide);
    return acc;
  },
  {} as Record<string, ServiceStepGuide[]>
);

Object.values(GUIDES_BY_SERVICE).forEach((guides) => {
  guides.sort((a, b) => a.index - b.index);
});

export function getServiceStepGuide(
  serviceId: string,
  stepIndex: number
): ServiceStepGuide | undefined {
  return GUIDES_BY_SERVICE[serviceId]?.find((guide) => guide.index === stepIndex);
}

export function getServiceStepGuides(serviceId: string): ServiceStepGuide[] {
  return GUIDES_BY_SERVICE[serviceId] ?? [];
}

export function getServiceStepGuideHref(serviceId: string, stepIndex: number): string {
  return `/services/${serviceId}/steps/${stepIndex}`;
}

export const STEP_GUIDE_OFFICIAL_LINKS: Record<string, { label: string; href: string }[]> = {
  "sb-name": [{ label: "Check name on ORC", href: ORC_NAME_SEARCH_URL }],
  "sb-orc": [
    { label: "ORC name search", href: ORC_NAME_SEARCH_URL },
    { label: "ORC fees and forms", href: ORC_FEES_URL },
  ],
  "sb-tax": [{ label: "GRA official website", href: GRA_MAIN_PORTAL_URL }],
  "pp-apply": [{ label: "Passport portal", href: PASSPORT_PORTAL_URL }],
  "pp-pay": [{ label: "Official passport fees", href: PASSPORT_FEES_URL }],
  "pp-appointment": [{ label: "How to apply / book", href: PASSPORT_HOW_TO_APPLY_URL }],
  "gc-register": [{ label: "NIA website", href: NIA_PORTAL_URL }],
  "gc-visit": [{ label: "NIA offices", href: NIA_OFFICES_URL }],
  "ns-portal": [{ label: "NSS portal", href: NSS_PORTAL_URL }],
};

export function getStepGuideOfficialLinks(guideId: string) {
  return STEP_GUIDE_OFFICIAL_LINKS[guideId] ?? [];
}

const ROADMAP_STEP_INDEX: Record<string, Record<string, number>> = {
  "start-business": {
    "step-1": 0,
    "step-2": 1,
    "step-3": 2,
    "step-4": 3,
    "step-5": 4,
    "step-6": 4,
  },
  passport: {
    "pp-step-1": 0,
    "pp-step-2": 1,
    "pp-step-3": 2,
    "pp-step-4": 3,
    "pp-step-5": 3,
    "pp-step-6": 4,
  },
  "ghana-card": {
    "gc-step-1": 0,
    "gc-step-2": 1,
    "gc-step-3": 2,
    "gc-step-4": 3,
  },
  "national-service": {
    "ns-step-1": 0,
    "ns-step-2": 0,
    "ns-step-3": 1,
    "ns-step-4": 2,
    "ns-step-5": 3,
    "ns-step-6": 4,
    "ns-step-7": 4,
  },
};

export function getStepGuideHrefFromRoadmapStep(serviceId: string, roadmapStepId: string): string | null {
  const index = ROADMAP_STEP_INDEX[serviceId]?.[roadmapStepId];
  if (index === undefined) return null;
  return getServiceStepGuideHref(serviceId, index);
}
