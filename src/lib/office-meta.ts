import {
  BookOpen,
  Briefcase,
  CreditCard,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { OFFICE_CITY_SUFFIXES } from "@/lib/ghana-cities";

export type OfficeCategory = "all" | "passport" | "identity" | "business" | "national-service";

export interface OfficeMeta {
  category: Exclude<OfficeCategory, "all">;
  icon: LucideIcon;
  accent: string;
  barGradient: string;
  shortName: string;
}

export const OFFICE_META: Record<string, OfficeMeta> = {
  "gis-passport": {
    category: "passport",
    icon: BookOpen,
    accent: "from-sky-500/15 to-blue-600/5",
    barGradient: "from-sky-400 to-blue-600",
    shortName: "Passport PAC",
  },
  nss: {
    category: "national-service",
    icon: GraduationCap,
    accent: "from-violet-500/15 to-purple-600/5",
    barGradient: "from-violet-400 to-purple-600",
    shortName: "NSS",
  },
  nia: {
    category: "identity",
    icon: CreditCard,
    accent: "from-emerald-500/15 to-teal-600/5",
    barGradient: "from-emerald-400 to-teal-600",
    shortName: "Ghana Card",
  },
  orc: {
    category: "business",
    icon: Briefcase,
    accent: "from-amber-500/15 to-orange-600/5",
    barGradient: "from-amber-400 to-orange-500",
    shortName: "Business / ORC",
  },
};

export const OFFICE_FILTERS: { id: OfficeCategory; label: string }[] = [
  { id: "all", label: "All offices" },
  { id: "passport", label: "Passport" },
  { id: "identity", label: "Ghana Card" },
  { id: "business", label: "Business" },
  { id: "national-service", label: "National Service" },
];

export function resolveOfficeMetaId(officeId: string): string {
  if (OFFICE_META[officeId]) return officeId;

  const parts = officeId.split("-");
  const last = parts[parts.length - 1];
  if (OFFICE_CITY_SUFFIXES.has(last)) {
    return parts.slice(0, -1).join("-");
  }

  return officeId;
}

export function getOfficeMeta(officeId: string): OfficeMeta {
  const metaKey = resolveOfficeMetaId(officeId);
  return (
    OFFICE_META[metaKey] ?? {
      category: "business",
      icon: Briefcase,
      accent: "from-primary/15 to-soft-blue/30",
      barGradient: "from-primary to-primary-dark",
      shortName: "Office",
    }
  );
}
