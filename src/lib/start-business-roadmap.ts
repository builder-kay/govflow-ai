import type { ChecklistItem, RiskFactor, RiskFix, Roadmap, RoadmapStep, UserAnswers } from "@/types";
import { getBusinessTypeById } from "@/data/business-types";

export const BUSINESS_CATEGORY_LABELS: Record<string, string> = {
  retail: "Retail / shop",
  food: "Food & beverage",
  services: "Professional or personal services",
  online: "Online / home-based",
  other: "General business",
};

export const BUSINESS_LOCATION_LABELS: Record<string, string> = {
  shop: "Fixed shop or office",
  home: "Home-based",
  online: "Online only",
  "not-yet": "Location not confirmed",
};

const REGISTRATION_TYPE_LABELS: Record<string, string> = {
  sole: "Sole proprietorship",
  partnership: "Partnership",
  limited: "Limited company",
  unsure: "Business (type to be confirmed)",
};

export function isFoodBusiness(category?: string): boolean {
  return category === "food";
}

function getCategoryLabel(category?: string): string {
  if (!category) return "New business";
  return BUSINESS_CATEGORY_LABELS[category] ?? "General business";
}

function getRegistrationLabel(registrationType?: string): string {
  if (!registrationType) return "New business";
  return REGISTRATION_TYPE_LABELS[registrationType] ?? getBusinessTypeById(registrationType)?.label ?? "Business";
}

function getLocationLabel(location?: string): string {
  if (!location) return "Ghana";
  return BUSINESS_LOCATION_LABELS[location] ?? "Ghana";
}

function baseRegistrationChecklist(): ChecklistItem[] {
  return [
    {
      id: "br-1",
      section: "Business Registration",
      label: "Choose 3 possible business names",
      priority: "required",
      explanation: "Prepare backup names in case your first choice is taken.",
      whyItMatters:
        "Your application may delay if your chosen business name is already registered or too similar to another business.",
      completed: false,
    },
    {
      id: "br-2",
      section: "Business Registration",
      label: "Confirm business address",
      priority: "required",
      explanation: "Use a full address with area or landmark, not just the city name.",
      whyItMatters: "Incomplete addresses cause delays during registration and permit applications.",
      completed: false,
    },
    {
      id: "br-3",
      section: "Business Registration",
      label: "Prepare Ghana Card",
      priority: "required",
      explanation: "Your Ghana Card is needed for identity verification.",
      whyItMatters: "Registration cannot proceed without valid identification.",
      completed: false,
    },
    {
      id: "br-4",
      section: "Business Registration",
      label: "Decide business type",
      priority: "required",
      explanation: "Choose sole proprietorship, partnership, or limited company.",
      whyItMatters: "Each type has different forms, fees, and obligations.",
      completed: false,
    },
    {
      id: "br-5",
      section: "Business Registration",
      label: "Complete business registration form",
      priority: "required",
      explanation: "Fill all sections accurately on the official ORC form.",
      whyItMatters: "Incomplete forms are a top reason for application delays.",
      completed: false,
    },
    {
      id: "br-6",
      section: "Business Registration",
      label: "Pay official fee",
      priority: "required",
      explanation: "Keep your payment receipt safe. Confirm the current fee on the official ORC website.",
      whyItMatters: "Fees may vary by business type. Always confirm from ORC before paying.",
      completed: false,
    },
    {
      id: "br-7",
      section: "Business Registration",
      label: "Save receipt",
      priority: "required",
      explanation: "Store a digital and physical copy of your payment receipt.",
      whyItMatters: "You may need proof of payment during follow-up or certificate collection.",
      completed: false,
    },
    {
      id: "br-8",
      section: "Business Registration",
      label: "Receive certificate",
      priority: "required",
      explanation: "Collect or download your business registration certificate.",
      whyItMatters: "This certificate is required for tax setup and permit applications.",
      completed: false,
    },
  ];
}

function baseTaxChecklist(categoryLabel: string): ChecklistItem[] {
  return [
    {
      id: "tax-1",
      section: "Tax Setup",
      label: "Confirm Ghana Card PIN",
      priority: "required",
      explanation: "Your Ghana Card PIN serves as your individual TIN.",
      whyItMatters: "Tax registration links to your Ghana Card identity.",
      completed: false,
    },
    {
      id: "tax-2",
      section: "Tax Setup",
      label: "Link business details to GRA where needed",
      priority: "depends",
      explanation: "Business tax setup may be required after registration.",
      whyItMatters: "Operating without proper tax registration may cause compliance issues.",
      completed: false,
    },
    {
      id: "tax-3",
      section: "Tax Setup",
      label: "Keep tax records",
      priority: "required",
      explanation: "Track income, expenses, and receipts from day one.",
      whyItMatters: "Good records help with GRA compliance and audits.",
      completed: false,
    },
    {
      id: "tax-4",
      section: "Tax Setup",
      label: "Ask GRA about business tax obligations",
      priority: "optional",
      explanation: `Confirm what taxes apply to your ${categoryLabel.toLowerCase()}.`,
      whyItMatters: "Tax obligations vary by business type and scale.",
      completed: false,
    },
  ];
}

function foodChecklistItems(): ChecklistItem[] {
  return [
    {
      id: "fda-1",
      section: "Food Hygiene / FDA",
      label: "Confirm whether FDA permit is required",
      priority: "depends",
      explanation: "Required based on whether you prepare, package, or store food.",
      whyItMatters: "Operating without required food hygiene approval may lead to penalties or shutdown.",
      completed: false,
    },
    {
      id: "fda-2",
      section: "Food Hygiene / FDA",
      label: "Prepare food-handler certificates if applicable",
      priority: "depends",
      explanation: "Required if you or staff handle food directly.",
      whyItMatters: "Missing certificates are a common reason for FDA application delays.",
      completed: false,
    },
    {
      id: "fda-3",
      section: "Food Hygiene / FDA",
      label: "Prepare location details",
      priority: "required",
      explanation: "Full address and description of where food is prepared or stored.",
      whyItMatters: "FDA needs accurate location info for inspection planning.",
      completed: false,
    },
    {
      id: "fda-4",
      section: "Food Hygiene / FDA",
      label: "Prepare menu or food category information",
      priority: "required",
      explanation: "List the types of food you will sell, prepare, or deliver.",
      whyItMatters: "Food category affects inspection requirements and permit type.",
      completed: false,
    },
    {
      id: "fda-5",
      section: "Food Hygiene / FDA",
      label: "Prepare for hygiene inspection",
      priority: "depends",
      explanation: "Ensure kitchen or prep area meets basic hygiene standards.",
      whyItMatters: "Failed inspections delay permit approval significantly.",
      completed: false,
    },
  ];
}

function sectorPermitChecklistItems(category?: string): ChecklistItem[] {
  const sectorHint =
    category === "retail"
      ? "retail or shop operations"
      : category === "services"
        ? "service-based businesses such as salons, repairs, or consulting"
        : category === "online"
          ? "online or home-based operations"
          : "your business category";

  return [
    {
      id: "perm-1",
      section: "Sector Permits",
      label: "Check if your industry needs extra permits",
      priority: "depends",
      explanation: `Some ${sectorHint} need approvals beyond basic business registration.`,
      whyItMatters: "Missing sector permits can block you from operating legally.",
      completed: false,
    },
    {
      id: "perm-2",
      section: "Sector Permits",
      label: "Confirm requirements with the relevant agency",
      priority: "depends",
      explanation: "Ask the responsible regulator what documents and fees apply to you.",
      whyItMatters: "Requirements differ by industry, location, and business scale.",
      completed: false,
    },
    {
      id: "perm-3",
      section: "Sector Permits",
      label: "Prepare supporting documents for sector approval",
      priority: "depends",
      explanation: "Gather business details, location proof, and any certificates requested.",
      whyItMatters: "Incomplete sector applications are a common source of delays.",
      completed: false,
    },
  ];
}

function localAssemblyChecklist(): ChecklistItem[] {
  return [
    {
      id: "la-1",
      section: "Local Assembly",
      label: "Contact your local assembly",
      priority: "required",
      explanation: "Ask about operating permit requirements for your business type.",
      whyItMatters: "Local permits are required before operating in most municipalities.",
      completed: false,
    },
    {
      id: "la-2",
      section: "Local Assembly",
      label: "Ask about operating permit",
      priority: "required",
      explanation: "Confirm fees, documents, and processing time.",
      whyItMatters: "Requirements vary by business category and location.",
      completed: false,
    },
    {
      id: "la-3",
      section: "Local Assembly",
      label: "Confirm local business fee category",
      priority: "depends",
      explanation: "Your business type determines the fee category.",
      whyItMatters: "Paying under the wrong category may require reapplication.",
      completed: false,
    },
    {
      id: "la-4",
      section: "Local Assembly",
      label: "Save permit and receipt",
      priority: "required",
      explanation: "Keep copies of your operating permit and payment receipt.",
      whyItMatters: "You may need to show these during inspections or audits.",
      completed: false,
    },
  ];
}

function buildSteps(answers: UserAnswers): RoadmapStep[] {
  const food = isFoodBusiness(answers.businessCategory);

  const steps: RoadmapStep[] = [
    {
      id: "step-1",
      title: "Choose and check your business name",
      agency: "Office of the Registrar of Companies",
      status: "not_started",
      requiredAction: "Prepare 2–3 possible business names and check availability on ORC",
      risk: "Name may already exist or be too similar to another registered name",
      buttonLabel: "Check name availability",
      buttonHref: "/checklist",
    },
    {
      id: "step-2",
      title: "Register your business",
      agency: "Office of the Registrar of Companies",
      status: "not_started",
      documents: ["Ghana Card", "Business name", "Owner details", "Business address"],
      buttonLabel: "Open checklist",
      buttonHref: "/checklist",
    },
    {
      id: "step-3",
      title: "Set up GRA / tax registration",
      agency: "Ghana Revenue Authority",
      status: "locked",
      note: "Ghana Card PIN acts as individual TIN. Business tax setup may be needed after registration.",
      buttonLabel: "Explain this step",
      buttonHref: "/documents",
    },
  ];

  if (food) {
    steps.push({
      id: "step-4",
      title: "Apply for FDA Food Hygiene Permit",
      agency: "Food and Drugs Authority",
      status: "needs_review",
      condition: "Required if you prepare, package, store, or serve food",
      documents: ["Business details", "Location", "Food-handler certificates", "Inspection details"],
      buttonLabel: "Check inspection readiness",
      buttonHref: "/checklist",
    });
  } else {
    steps.push({
      id: "step-4",
      title: "Check sector-specific permits",
      agency: "Relevant regulatory agency",
      status: "needs_review",
      condition: "Some businesses need extra approvals beyond basic registration",
      note: "Confirm whether your industry requires permits from agencies such as EPA, GSA, or sector regulators.",
      buttonLabel: "Review permit checklist",
      buttonHref: "/checklist",
    });
  }

  steps.push(
    {
      id: "step-5",
      title: "Get local assembly operating permit",
      agency: "Local Metropolitan / Municipal Assembly",
      status: "not_started",
      note: "Local fees and requirements may vary by business type and location",
      buttonLabel: "Find relevant office",
      buttonHref: "/offices",
    },
    {
      id: "step-6",
      title: food ? "Prepare for inspection and operation" : "Prepare to start operating",
      agency: food ? "FDA / Local Assembly" : "Local Assembly",
      status: "locked",
      checklist: food
        ? ["Hygiene readiness", "Location readiness", "Food-handler requirements", "Receipts", "Certificates"]
        : ["Permit copies", "Tax records", "Business address proof", "Registration certificate"],
      buttonLabel: food ? "View inspection checklist" : "View readiness checklist",
      buttonHref: "/checklist",
    }
  );

  return steps;
}

function buildAgencies(food: boolean): string[] {
  const agencies = [
    "Office of the Registrar of Companies",
    "Ghana Revenue Authority",
    "Local Metropolitan / Municipal Assembly",
  ];
  if (food) {
    agencies.splice(2, 0, "Food and Drugs Authority");
  }
  return agencies;
}

function buildDocuments(food: boolean): string[] {
  const documents = [
    "Ghana Card",
    "Business name options",
    "Owner details",
    "Business address",
    "Permit application forms",
  ];
  if (food) {
    documents.splice(4, 0, "Food-handler certificates (if applicable)");
  }
  return documents;
}

function buildWarnings(answers: UserAnswers): string[] {
  const food = isFoodBusiness(answers.businessCategory);
  const warnings = [
    "Business name may already exist or be too similar",
    "Local assembly fees and requirements may vary",
  ];

  if (food) {
    warnings.splice(1, 0, "FDA permit may be required if you prepare or package food");
  } else {
    warnings.splice(1, 0, "Some industries require sector-specific permits beyond basic registration");
  }

  if (answers.location === "not-yet") {
    warnings.push("Operating without a confirmed business address may delay registration and permits");
  }

  if (answers.businessName === "no") {
    warnings.push("You will need a registered business name before completing ORC registration");
  }

  return warnings;
}

export function buildStartBusinessRoadmap(answers: UserAnswers): Roadmap {
  const businessCategory =
    answers.businessCategory ?? (answers.foodPreparation ? "food" : undefined);
  const normalizedAnswers = { ...answers, businessCategory };
  const food = isFoodBusiness(businessCategory);
  const categoryLabel = getCategoryLabel(businessCategory);
  const registrationLabel = getRegistrationLabel(normalizedAnswers.businessType);
  const locationLabel = getLocationLabel(normalizedAnswers.location);

  const checklist = [
    ...baseRegistrationChecklist(),
    ...baseTaxChecklist(categoryLabel),
    ...(food ? foodChecklistItems() : sectorPermitChecklistItems(businessCategory)),
    ...localAssemblyChecklist(),
  ];

  return {
    id: "start-business",
    title: categoryLabel,
    location: locationLabel,
    businessType: registrationLabel,
    progress: 0,
    riskLevel: answers.location === "not-yet" || answers.businessName === "no" ? "medium" : "low",
    estimatedTime: food
      ? "2–8 weeks depending on registration, inspection, and approvals"
      : "2–6 weeks depending on registration and local permits",
    mainNextStep:
      answers.businessName === "yes" || answers.businessName === "ideas"
        ? "Check business name availability and prepare registration details"
        : "Choose possible business names and prepare registration details",
    steps: buildSteps(normalizedAnswers),
    checklist,
    agencies: buildAgencies(food),
    documents: buildDocuments(food),
    warnings: buildWarnings(normalizedAnswers),
  };
}

export const startBusinessBaseRoadmap: Roadmap = buildStartBusinessRoadmap({});

export function buildStartBusinessRiskFactors(answers: UserAnswers): RiskFactor[] {
  const businessCategory =
    answers.businessCategory ?? (answers.foodPreparation ? "food" : undefined);
  const food = isFoodBusiness(businessCategory);
  const factors: RiskFactor[] = [
    {
      id: "rf-1",
      title: "Business name not checked",
      description: "Your application may delay if the name already exists.",
    },
    {
      id: "rf-2",
      title: "Business location is incomplete",
      description: "Use a full address, area, or landmark instead of only a city name.",
    },
    {
      id: "rf-5",
      title: "Assembly permit not confirmed",
      description: "Local operating permits may depend on the business type and location.",
    },
  ];

  if (food) {
    factors.push(
      {
        id: "rf-3",
        title: "Food-handler certificate not uploaded",
        description: "May be required if you prepare, package, or serve food.",
      },
      {
        id: "rf-4",
        title: "FDA permit requirement not confirmed",
        description: "Food businesses should confirm whether food hygiene approval applies.",
      }
    );
  } else {
    factors.push({
      id: "rf-4",
      title: "Sector permits not confirmed",
      description: "Your industry may require extra approvals beyond basic business registration.",
    });
  }

  return factors;
}

export function buildStartBusinessRiskFixes(answers: UserAnswers): RiskFix[] {
  const businessCategory =
    answers.businessCategory ?? (answers.foodPreparation ? "food" : undefined);
  const food = isFoodBusiness(businessCategory);
  const fixes: RiskFix[] = [
    { id: "fix-1", label: "Add full business address", href: "/checklist" },
    { id: "fix-3", label: "Check business name", href: "/checklist" },
    { id: "fix-5", label: "Contact assembly office", href: "/offices" },
    { id: "fix-6", label: "Add missing documents to checklist", href: "/checklist" },
  ];

  if (food) {
    fixes.splice(1, 0, { id: "fix-2", label: "Upload food-handler certificate", href: "/documents" });
    fixes.push({ id: "fix-4", label: "Confirm food preparation method", href: "/questions" });
  } else {
    fixes.push({ id: "fix-4", label: "Confirm sector permit requirements", href: "/checklist" });
  }

  return fixes;
}
