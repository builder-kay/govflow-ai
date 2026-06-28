export interface BusinessTypeDefinition {
  id: string;
  label: string;
  summary: string;
  bestFor: string;
}

export const BUSINESS_TYPES: BusinessTypeDefinition[] = [
  {
    id: "sole",
    label: "Sole proprietorship",
    summary:
      "One person owns and runs the business. You keep all profits and are personally responsible for debts and losses.",
    bestFor: "Small one-person businesses like a shop, freelance service, or solo operator.",
  },
  {
    id: "partnership",
    label: "Partnership",
    summary:
      "Two or more people run the business together. Partners share profits, decisions, and legal responsibilities.",
    bestFor: "Family or friends starting a business together with shared investment and roles.",
  },
  {
    id: "limited",
    label: "Limited company",
    summary:
      "A separate legal business entity owned by shareholders. Personal assets are usually protected, but setup has more rules and reporting.",
    bestFor: "Growing businesses that want stronger legal separation, investors, or a formal company structure.",
  },
  {
    id: "unsure",
    label: "I'm not sure",
    summary:
      "You can still continue. GovFlow will keep guidance general until you choose a type with ORC or an advisor.",
    bestFor: "When you need more time to compare options before registering.",
  },
];

export function getBusinessTypeById(id: string): BusinessTypeDefinition | undefined {
  return BUSINESS_TYPES.find((type) => type.id === id);
}
