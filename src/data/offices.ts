import type { Office } from "@/types";
import { NIA_PORTAL_URL } from "@/lib/ghana-card-links";
import { NSS_PORTAL_URL } from "@/lib/nss-links";
import { ORC_NAME_SEARCH_URL } from "@/lib/orc-links";
import { PASSPORT_PORTAL_URL } from "@/lib/passport-links";

export const offices: Office[] = [
  {
    id: "gis-passport",
    name: "Ghana Passport Application Centre (PAC)",
    service: "Passport biometrics and vetting",
    useCase: "Book appointment after online application and payment",
    address: "Multiple PAC locations nationwide — Cape Coast PAC: Opposite Ford Station",
    osmQuery: "Passport Application Centre Cape Coast Ghana",
    phone: "Support: 0307000575 / 0307008222",
    hours: "Mon–Fri, by appointment",
    confirmNote: "Office details may change. Always confirm from the official agency before visiting.",
    portalUrl: PASSPORT_PORTAL_URL,
    portalLabel: "Open passport portal",
  },
  {
    id: "nss",
    name: "National Service Authority Support Office",
    service: "National Service registration and posting support",
    useCase: "Portal account, posting follow-up, reporting and validation support",
    address: "National Service Authority offices nationwide",
    osmQuery: "National Service Authority office Ghana",
    phone: "NSS support channels vary by region",
    hours: "Mon-Fri, official working hours",
    confirmNote:
      "Office details may change. Always confirm from the official agency before visiting.",
    portalUrl: NSS_PORTAL_URL,
    portalLabel: "Open National Service Authority page",
  },
  {
    id: "nia",
    name: "National Identification Authority (NIA)",
    service: "Ghana Card registration and updates",
    useCase: "New registration, replacement, card detail update, and collection guidance",
    address:
      "NIA service points nationwide (Confirm nearest office from the official NIA source)",
    osmQuery: "National Identification Authority office Cape Coast Ghana",
    phone: "NIA support lines vary by location",
    hours: "Mon-Fri, official working hours",
    confirmNote:
      "Office details may change. Always confirm from the official agency before visiting.",
    portalUrl: NIA_PORTAL_URL,
    portalLabel: "Open NIA website",
  },
  {
    id: "orc",
    name: "ORC / Business Registration Support",
    service: "Business registration guidance",
    useCase: "Name search, name reservation, business registration, certificates",
    address: "Office of the Registrar of Companies, Accra",
    osmQuery: "Office of the Registrar of Companies Accra Ghana",
    phone: "Online name search: rgdonline.gegov.gov.gh/orc-app",
    hours: "Online portal available 24/7",
    confirmNote: "Office details may change. Always confirm from the official agency before visiting.",
    portalUrl: ORC_NAME_SEARCH_URL,
    portalLabel: "Check business name",
  },
];
