export interface PainToGain {
  pain: string;
  gain: string;
}

export interface LandingServiceSpotlight {
  id: string;
  howGovFlowHelps: string[];
  painToGain: PainToGain[];
}

export const landingServiceSpotlights: Record<string, LandingServiceSpotlight> = {
  "start-business": {
    id: "start-business",
    howGovFlowHelps: [
      "Builds a personalised roadmap across ORC, GRA, FDA, and local assembly steps in one place.",
      "Checks your business name and document readiness before you pay official fees.",
      "Flags rejection risks like incomplete addresses or missing permits early.",
      "Connects uploaded forms to your checklist so nothing gets lost between agencies.",
    ],
    painToGain: [
      {
        pain: "You do not know which agency to visit first or what order to follow.",
        gain: "GovFlow sequences every step — registration, tax, permits, and assembly — in a clear roadmap.",
      },
      {
        pain: "Business names get rejected for being too similar or already taken.",
        gain: "Name-check guidance and risk alerts help you pick viable options before submission.",
      },
      {
        pain: "Missing one document sends you back to the queue.",
        gain: "Smart checklists show required documents per step with explanations of why each matters.",
      },
      {
        pain: "Fees and timelines feel unclear until you are already committed.",
        gain: "GovFlow surfaces fee notes, timelines, and official links so you plan with realistic expectations.",
      },
    ],
  },
  passport: {
    id: "passport",
    howGovFlowHelps: [
      "Personalises your passport roadmap for new applications, renewals, or replacements.",
      "Prepares you for biometric appointments with a document checklist matched to your case.",
      "Surfaces common rejection reasons before you submit at the passport centre.",
      "Keeps next actions visible — booking, biometrics, tracking, and collection.",
    ],
    painToGain: [
      {
        pain: "Appointment slots fill up and you miss the window.",
        gain: "GovFlow reminds you when to book and what to prepare so you arrive ready the first time.",
      },
      {
        pain: "Wrong documents or photos cause same-day rejection.",
        gain: "Document checks and upload review help you fix gaps before your appointment.",
      },
      {
        pain: "Application types (new, renewal, lost) have different rules that are easy to mix up.",
        gain: "Smart questions tailor your roadmap to the exact passport service you need.",
      },
      {
        pain: "You are unsure when your passport will be ready or where to collect it.",
        gain: "Step-by-step tracking guidance keeps collection and follow-up actions clear.",
      },
    ],
  },
  "national-service": {
    id: "national-service",
    howGovFlowHelps: [
      "Guides you from school clearance through NSS portal registration and posting acceptance.",
      "Catches name and date-of-birth mismatches before they block your profile.",
      "Tracks validation windows so you do not miss posting acceptance deadlines.",
      "Prepares affidavit and Gazette steps when records do not match.",
    ],
    painToGain: [
      {
        pain: "Your school has not submitted your details and you only find out late.",
        gain: "GovFlow starts with clearance checks so you know what to confirm with your institution first.",
      },
      {
        pain: "NSS records do not match your Ghana Card or birth certificate.",
        gain: "Risk checker highlights mismatches and walks you through affidavit or Gazette fixes.",
      },
      {
        pain: "Posting checks and acceptance windows are easy to miss.",
        gain: "Your roadmap surfaces posting review and acceptance as time-sensitive steps with reminders.",
      },
      {
        pain: "Reporting to your agency feels unclear after acceptance.",
        gain: "Checklist items cover reporting, validation, and what to bring on day one.",
      },
    ],
  },
  "ghana-card": {
    id: "ghana-card",
    howGovFlowHelps: [
      "Clarifies whether you need first-time registration, replacement, or a detail update.",
      "Prepares birth certificate, proof of address, and ID documents before your NIA visit.",
      "Helps you understand verification delays and collection steps.",
      "Links official NIA resources alongside plain-language guidance.",
    ],
    painToGain: [
      {
        pain: "Registration centres turn people away for incomplete forms or missing proofs.",
        gain: "GovFlow validates your document set against your application type before you travel.",
      },
      {
        pain: "Verification and processing times feel like a black box.",
        gain: "Timeline guidance and status-tracking steps tell you what to expect and when to follow up.",
      },
      {
        pain: "Replacement cases need different documents than first-time registration.",
        gain: "Personalised checklists adapt to new, replacement, or update scenarios.",
      },
      {
        pain: "Collection centre backlogs waste repeated trips.",
        gain: "Office locator and visit-prep tips reduce unnecessary journeys.",
      },
    ],
  },
  nhis: {
    id: "nhis",
    howGovFlowHelps: [
      "Explains membership categories so you register under the right NHIS plan.",
      "Lists Ghana Card, photo, and residence proof requirements before your office visit.",
      "Prepares you for premium payments and card activation steps.",
      "Connects document uploads to your saved profile for AI-assisted review.",
    ],
    painToGain: [
      {
        pain: "Wrong membership category means starting over at the NHIS office.",
        gain: "GovFlow helps you pick the correct category with plain-language explanations.",
      },
      {
        pain: "Missing Ghana Card or proof of residence blocks same-day registration.",
        gain: "Pre-visit checklists confirm you have every document before you queue.",
      },
      {
        pain: "Forms and premium amounts are confusing for first-time registrants.",
        gain: "Step guides break down visit flow, fees, and card collection in order.",
      },
      {
        pain: "Renewal deadlines slip and coverage lapses quietly.",
        gain: "Reminders and renewal prep keep your membership active without surprises.",
      },
    ],
  },
  "drivers-licence": {
    id: "drivers-licence",
    howGovFlowHelps: [
      "Maps the full DVLA path from learner's permit through road test to collection.",
      "Tracks medical certificate validity so expired forms do not block your test.",
      "Prepares you for road test requirements by licence class.",
      "Surfaces common DVLA form errors before submission.",
    ],
    painToGain: [
      {
        pain: "Failed road tests mean costly repeats with little feedback.",
        gain: "GovFlow highlights readiness checkpoints and common failure reasons before test day.",
      },
      {
        pain: "Expired medical certificates invalidate your application.",
        gain: "Timeline tracking flags when to renew medical clearance before it becomes a blocker.",
      },
      {
        pain: "Learner's permit, training, and test steps blur together.",
        gain: "A sequenced roadmap shows exactly where you are in the DVLA process.",
      },
      {
        pain: "Incomplete DVLA forms send you back to the counter.",
        gain: "Document and form checklists reduce rejections at the point of submission.",
      },
    ],
  },
  "gra-tin": {
    id: "gra-tin",
    howGovFlowHelps: [
      "Clarifies when your Ghana Card PIN is enough versus when business tax setup is needed.",
      "Guides individual, self-employed, and business taxpayer registration paths.",
      "Connects company registration steps to GRA obligations after ORC approval.",
      "Explains record-keeping and filing basics in approachable language.",
    ],
    painToGain: [
      {
        pain: "Ghana Card PIN issues block tax registration for weeks.",
        gain: "GovFlow helps you verify PIN status and fix identity mismatches before applying.",
      },
      {
        pain: "New business owners register with the wrong taxpayer category.",
        gain: "Smart guidance matches your business type to the correct GRA registration path.",
      },
      {
        pain: "Tax obligations feel overwhelming after company registration.",
        gain: "Post-registration steps link ORC completion to GRA setup in one continuous plan.",
      },
      {
        pain: "Incomplete business details cause GRA portal rejections.",
        gain: "Checklists ensure addresses, contacts, and registration numbers are consistent across agencies.",
      },
    ],
  },
  "fda-permit": {
    id: "fda-permit",
    howGovFlowHelps: [
      "Confirms whether your food business actually needs an FDA permit.",
      "Prepares food-handler certificates and location documentation for inspection.",
      "Walks you through hygiene standards inspectors commonly check.",
      "Links permit steps to your broader business registration roadmap.",
    ],
    painToGain: [
      {
        pain: "Failed hygiene inspections delay opening by weeks.",
        gain: "Inspection-readiness checklists help you fix gaps before the FDA visit.",
      },
      {
        pain: "Missing food-handler certificates invalidate your application.",
        gain: "GovFlow tracks certificate requirements per staff role and location type.",
      },
      {
        pain: "Incomplete location or kitchen details stall processing.",
        gain: "Document prep guidance ensures plans and addresses meet FDA expectations.",
      },
      {
        pain: "Food businesses juggle FDA, assembly, and business registration at once.",
        gain: "Cross-service roadmaps show how permits fit into your overall launch plan.",
      },
    ],
  },
  "building-permit": {
    id: "building-permit",
    howGovFlowHelps: [
      "Clarifies zoning, land title, and plan requirements for your local assembly.",
      "Organises architectural and structural drawing submissions in order.",
      "Flags environmental clearance needs before you pay assembly fees.",
      "Estimates realistic timelines for plan review and approval.",
    ],
    painToGain: [
      {
        pain: "Incomplete architectural plans bounce back after expensive drafting.",
        gain: "GovFlow lists plan requirements upfront so your architect submits assembly-ready drawings.",
      },
      {
        pain: "Land documentation gaps halt permits mid-process.",
        gain: "Title and lease checklists catch ownership issues before formal submission.",
      },
      {
        pain: "Zoning non-compliance means redesigns and months of delay.",
        gain: "Early zoning guidance helps you confirm land use rules before investing in plans.",
      },
      {
        pain: "Assembly fee structures and review timelines are hard to predict.",
        gain: "Fee notes and step timelines set expectations so you can plan construction starts realistically.",
      },
    ],
  },
};

export function getLandingServiceSpotlight(id: string): LandingServiceSpotlight | undefined {
  return landingServiceSpotlights[id];
}
