import { ORC_FEES_URL, ORC_NAME_SEARCH_URL } from "@/lib/orc-links";
import { NIA_OFFICES_URL, NIA_PORTAL_URL } from "@/lib/ghana-card-links";
import {
  PASSPORT_FEES_URL,
  PASSPORT_HOW_TO_APPLY_URL,
  PASSPORT_PORTAL_URL,
} from "@/lib/passport-links";
import type { ChecklistHelpAction, ChecklistItem } from "@/types";

export type ChecklistItemExtras = {
  resourceLink?: ChecklistItem["resourceLink"];
  helpActions?: ChecklistHelpAction[];
  showBusinessTypeHelp?: boolean;
};

const CHECKLIST_EXTRAS: Record<string, ChecklistItemExtras> = {
  "br-1": {
    resourceLink: {
      url: ORC_NAME_SEARCH_URL,
      label: "Check name availability on ORC",
    },
    helpActions: [
      {
        label: "Not sure what name to pick? Ask the AI assistant",
        href: "/assistant?topic=business-name",
      },
    ],
  },
  "br-2": {
    helpActions: [
      {
        label: "Not sure what address to use? Ask the AI assistant",
        href: "/assistant?topic=business-address",
      },
    ],
  },
  "br-3": {
    helpActions: [
      {
        label: "I don't have a Ghana Card — register for one",
        href: "/services/ghana-card",
      },
    ],
  },
  "br-4": {
    showBusinessTypeHelp: true,
    helpActions: [
      {
        label: "Still unsure? Ask the AI assistant",
        href: "/assistant?topic=business-type",
      },
    ],
  },
  "br-5": {
    helpActions: [
      {
        label: "Need help filling the form? Upload it in the AI assistant",
        href: "/assistant?topic=registration-form",
      },
    ],
  },
  "br-6": {
    resourceLink: {
      url: ORC_FEES_URL,
      label: "Check official ORC fees and rates",
    },
    helpActions: [
      {
        label: "Questions about payment? Ask the AI assistant",
        href: "/assistant?topic=registration-fees",
      },
    ],
  },
  "br-7": {
    helpActions: [
      {
        label: "Lost your receipt? Ask the AI assistant what to do",
        href: "/assistant?topic=payment-receipt",
      },
    ],
  },
  "br-8": {
    helpActions: [
      {
        label: "Certificate delayed? Ask the AI assistant",
        href: "/assistant?topic=registration-certificate",
      },
    ],
  },
  "tax-1": {
    helpActions: [
      {
        label: "I don't have a Ghana Card yet — register for one",
        href: "/services/ghana-card",
      },
      {
        label: "Need help with your PIN? Ask the AI assistant",
        href: "/assistant?topic=ghana-card-pin",
      },
    ],
  },
  "tax-2": {
    helpActions: [
      {
        label: "Need help linking your business to GRA? Ask the AI assistant",
        href: "/assistant?topic=gra-business",
      },
    ],
  },
  "pp-1": {
    helpActions: [
      {
        label: "I don't have a Ghana Card — register for one",
        href: "/services/ghana-card",
      },
    ],
  },
  "pp-2": {
    helpActions: [
      {
        label: "Don't have a birth certificate? Ask the AI assistant",
        href: "/assistant?topic=passport-birth-cert",
      },
    ],
  },
  "pp-3": {
    helpActions: [
      {
        label: "Passport lost or stolen? Ask the AI assistant",
        href: "/assistant?topic=passport-replacement",
      },
    ],
  },
  "pp-5": {
    resourceLink: {
      url: PASSPORT_PORTAL_URL,
      label: "Open official passport portal",
    },
    helpActions: [
      {
        label: "How do I apply? Read official steps",
        href: PASSPORT_HOW_TO_APPLY_URL,
        external: true,
      },
    ],
  },
  "pp-7": {
    helpActions: [
      {
        label: "Need help filling the form? Upload it in the AI assistant",
        href: "/assistant?topic=passport-form",
      },
    ],
  },
  "pp-8": {
    resourceLink: {
      url: PASSPORT_FEES_URL,
      label: "Check official passport fees and rates",
    },
    helpActions: [
      {
        label: "Questions about payment? Ask the AI assistant",
        href: "/assistant?topic=passport-fees",
      },
    ],
  },
  "pp-9": {
    resourceLink: {
      url: PASSPORT_HOW_TO_APPLY_URL,
      label: "How to book a PAC appointment",
    },
    helpActions: [
      {
        label: "Can't find an appointment slot? Ask the AI assistant",
        href: "/assistant?topic=passport-appointment",
      },
    ],
  },
  "pp-12": {
    resourceLink: {
      url: PASSPORT_PORTAL_URL,
      label: "Track application on official portal",
    },
  },
  "gc-1": {
    helpActions: [
      {
        label: "No birth certificate yet? Ask the AI assistant",
        href: "/assistant?topic=ghana-card-missing-docs",
      },
    ],
  },
  "gc-3": {
    helpActions: [
      {
        label: "No active contact details? Ask the AI assistant",
        href: "/assistant?topic=ghana-card",
      },
    ],
  },
  "gc-4": {
    resourceLink: {
      url: NIA_OFFICES_URL,
      label: "Check NIA office information",
    },
  },
  "gc-5": {
    resourceLink: {
      url: NIA_PORTAL_URL,
      label: "Open official NIA website",
    },
    helpActions: [
      {
        label: "Need form help? Ask the AI assistant",
        href: "/assistant?topic=ghana-card",
      },
    ],
  },
  "gc-6": {
    helpActions: [
      {
        label: "Card not ready yet? Ask the AI assistant",
        href: "/assistant?topic=ghana-card-collection",
      },
    ],
  },
};

export function getChecklistItemExtras(itemId: string): ChecklistItemExtras {
  return CHECKLIST_EXTRAS[itemId] ?? {};
}
