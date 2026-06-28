import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Cookie, FileText, Scale, Shield } from "lucide-react";

export type LegalDocSlug = "terms" | "privacy" | "cookies" | "disclaimer";

export interface LegalDocumentMeta {
  slug: LegalDocSlug;
  icon: LucideIcon;
  badge: string;
  accentBar: string;
  heroGradient: string;
  iconWrap: string;
  tocActive: string;
}

export const LEGAL_DOCUMENT_META: Record<LegalDocSlug, LegalDocumentMeta> = {
  terms: {
    slug: "terms",
    icon: Scale,
    badge: "Usage rules",
    accentBar: "from-primary to-primary-dark",
    heroGradient: "from-soft-blue/60 via-white to-emerald-50/40",
    iconWrap: "bg-soft-blue text-primary",
    tocActive: "border-primary bg-soft-blue/50 text-primary-dark",
  },
  privacy: {
    slug: "privacy",
    icon: Shield,
    badge: "Your data",
    accentBar: "from-teal-500 to-primary-dark",
    heroGradient: "from-teal-50/80 via-white to-soft-blue/30",
    iconWrap: "bg-teal-100 text-teal-800",
    tocActive: "border-teal-600 bg-teal-50 text-teal-900",
  },
  cookies: {
    slug: "cookies",
    icon: Cookie,
    badge: "Cookies & storage",
    accentBar: "from-amber-400 to-orange-500",
    heroGradient: "from-amber-50/70 via-white to-soft-blue/20",
    iconWrap: "bg-amber-100 text-amber-800",
    tocActive: "border-amber-500 bg-amber-50 text-amber-900",
  },
  disclaimer: {
    slug: "disclaimer",
    icon: AlertTriangle,
    badge: "Important limits",
    accentBar: "from-orange-400 to-red-500",
    heroGradient: "from-orange-50/60 via-white to-amber-50/30",
    iconWrap: "bg-orange-100 text-orange-800",
    tocActive: "border-orange-500 bg-orange-50 text-orange-900",
  },
};

export function getLegalDocumentMeta(slug: string): LegalDocumentMeta {
  return LEGAL_DOCUMENT_META[slug as LegalDocSlug] ?? {
    slug: "terms" as LegalDocSlug,
    icon: FileText,
    badge: "Legal",
    accentBar: "from-primary to-primary-dark",
    heroGradient: "from-soft-blue/60 via-white to-white",
    iconWrap: "bg-soft-blue text-primary",
    tocActive: "border-primary bg-soft-blue/50 text-primary-dark",
  };
}

export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
