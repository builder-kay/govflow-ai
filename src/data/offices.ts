import type { Office } from "@/types";
import { NIA_PORTAL_URL } from "@/lib/ghana-card-links";
import { NSS_PORTAL_URL } from "@/lib/nss-links";
import { ORC_NAME_SEARCH_URL } from "@/lib/orc-links";
import { PASSPORT_PORTAL_URL } from "@/lib/passport-links";

const CONFIRM_NOTE =
  "Office details may change. Always confirm from the official agency before visiting.";

type OfficeCity = "accra" | "kumasi" | "cape-coast";

const passportByCity: Record<
  OfficeCity,
  Pick<Office, "address" | "osmQuery" | "name">
> = {
  accra: {
    name: "Ghana Passport Application Centre (PAC) — Accra",
    address: "Accra PAC area — confirm your assigned centre on the official passport portal",
    osmQuery: "Passport Application Centre Accra Ghana",
  },
  kumasi: {
    name: "Ghana Passport Application Centre (PAC) — Kumasi",
    address: "Kumasi PAC area — confirm your assigned centre on the official passport portal",
    osmQuery: "Passport Application Centre Kumasi Ghana",
  },
  "cape-coast": {
    name: "Ghana Passport Application Centre (PAC) — Cape Coast",
    address: "Cape Coast PAC: Opposite Ford Station (confirm on official portal before visiting)",
    osmQuery: "Passport Application Centre Cape Coast Ghana",
  },
};

const niaByCity: Record<OfficeCity, Pick<Office, "address" | "osmQuery" | "name">> = {
  accra: {
    name: "National Identification Authority (NIA) — Accra",
    address: "NIA service points in Accra — confirm nearest office from the official NIA source",
    osmQuery: "National Identification Authority office Accra Ghana",
  },
  kumasi: {
    name: "National Identification Authority (NIA) — Kumasi",
    address: "NIA service points in Kumasi — confirm nearest office from the official NIA source",
    osmQuery: "National Identification Authority office Kumasi Ghana",
  },
  "cape-coast": {
    name: "National Identification Authority (NIA) — Cape Coast",
    address: "NIA service points in Cape Coast — confirm nearest office from the official NIA source",
    osmQuery: "National Identification Authority office Cape Coast Ghana",
  },
};

const nssByCity: Record<OfficeCity, Pick<Office, "address" | "osmQuery" | "name">> = {
  accra: {
    name: "National Service Authority — Accra",
    address: "NSS regional support offices in Accra",
    osmQuery: "National Service Authority office Accra Ghana",
  },
  kumasi: {
    name: "National Service Authority — Kumasi",
    address: "NSS regional support offices in Kumasi",
    osmQuery: "National Service Authority office Kumasi Ghana",
  },
  "cape-coast": {
    name: "National Service Authority — Cape Coast",
    address: "NSS regional support offices in Cape Coast / Central Region",
    osmQuery: "National Service Authority office Cape Coast Ghana",
  },
};

const OFFICE_CITIES: OfficeCity[] = ["accra", "kumasi", "cape-coast"];

function buildCityOffices(): Office[] {
  const entries: Office[] = [];

  for (const city of OFFICE_CITIES) {
    const passport = passportByCity[city];
    entries.push({
      id: `gis-passport-${city}`,
      city,
      name: passport.name,
      service: "Passport biometrics and vetting",
      useCase: "Book appointment after online application and payment",
      address: passport.address,
      osmQuery: passport.osmQuery,
      phone: "Support: 0307000575 / 0307008222",
      hours: "Mon–Fri, by appointment",
      confirmNote: CONFIRM_NOTE,
      portalUrl: PASSPORT_PORTAL_URL,
      portalLabel: "Open passport portal",
    });

    const nia = niaByCity[city];
    entries.push({
      id: `nia-${city}`,
      city,
      name: nia.name,
      service: "Ghana Card registration and updates",
      useCase: "New registration, replacement, card detail update, and collection guidance",
      address: nia.address,
      osmQuery: nia.osmQuery,
      phone: "NIA support lines vary by location",
      hours: "Mon–Fri, official working hours",
      confirmNote: CONFIRM_NOTE,
      portalUrl: NIA_PORTAL_URL,
      portalLabel: "Open NIA website",
    });

    const nss = nssByCity[city];
    entries.push({
      id: `nss-${city}`,
      city,
      name: nss.name,
      service: "National Service registration and posting support",
      useCase: "Portal account, posting follow-up, reporting and validation support",
      address: nss.address,
      osmQuery: nss.osmQuery,
      phone: "NSS support channels vary by region",
      hours: "Mon–Fri, official working hours",
      confirmNote: CONFIRM_NOTE,
      portalUrl: NSS_PORTAL_URL,
      portalLabel: "Open National Service Authority page",
    });
  }

  entries.push({
    id: "orc-accra",
    city: "accra",
    name: "ORC / Business Registration Support — Accra",
    service: "Business registration guidance",
    useCase: "Name search, name reservation, business registration, certificates",
    address: "Office of the Registrar of Companies, Accra",
    osmQuery: "Office of the Registrar of Companies Accra Ghana",
    phone: "Online name search: rgdonline.gegov.gov.gh/orc-app",
    hours: "Online portal available 24/7",
    confirmNote: CONFIRM_NOTE,
    portalUrl: ORC_NAME_SEARCH_URL,
    portalLabel: "Check business name",
  });

  return entries;
}

export const offices: Office[] = buildCityOffices();
