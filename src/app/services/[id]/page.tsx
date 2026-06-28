"use client";

import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
  Clock,
  FileText,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { TaxEstimatorCard } from "@/components/TaxEstimatorCard";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceStepsPreview } from "@/components/services/ServiceStepsPreview";
import { ServiceMissingDocsCta } from "@/components/services/ServiceMissingDocsCta";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceById } from "@/data/services";
import { NIA_PORTAL_URL } from "@/lib/ghana-card-links";
import { GRA_MAIN_PORTAL_URL, GRA_TAXPAYER_PORTAL_URL } from "@/lib/gra-tax-links";
import { ORC_FEES_URL, ORC_NAME_SEARCH_URL } from "@/lib/orc-links";
import { NSS_MAIN_PORTAL_URL, NSS_PORTAL_URL } from "@/lib/nss-links";
import { PASSPORT_FEES_URL, PASSPORT_PORTAL_URL } from "@/lib/passport-links";
import { useAppStore } from "@/store/useAppStore";
import { formatFileSize } from "@/lib/saved-documents";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
};

const ROADMAP_SERVICES = new Set(["start-business", "passport", "national-service", "ghana-card"]);
const COMING_SOON_SERVICE_IDS = new Set([
  "nhis",
  "drivers-licence",
  "gra-tin",
  "fda-permit",
  "building-permit",
]);

const OFFICIAL_LINKS: Record<string, { label: string; href: string }[]> = {
  "start-business": [
    { label: "Check business name (ORC)", href: ORC_NAME_SEARCH_URL },
    { label: "Check official ORC fees", href: ORC_FEES_URL },
  ],
  passport: [
    { label: "Open passport portal", href: PASSPORT_PORTAL_URL },
    { label: "Passport guide and fees", href: PASSPORT_FEES_URL },
  ],
  "national-service": [
    { label: "National Service Authority profile", href: NSS_PORTAL_URL },
    { label: "National Service Authority website", href: NSS_MAIN_PORTAL_URL },
  ],
  "ghana-card": [{ label: "Open NIA official website", href: NIA_PORTAL_URL }],
  "gra-tin": [
    { label: "Open GRA official website", href: GRA_MAIN_PORTAL_URL },
    { label: "Open taxpayer portal", href: GRA_TAXPAYER_PORTAL_URL },
  ],
};

export default function ServiceGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = getServiceById(id);
  const { activateService, savedDocuments } = useAppStore();

  useEffect(() => {
    if (service) {
      useAppStore.getState().setCurrentServiceId(service.id);
    }
  }, [service]);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon] || Briefcase;
  const isComingSoon = COMING_SOON_SERVICE_IDS.has(service.id);
  const hasRoadmapFlow = ROADMAP_SERVICES.has(service.id);
  const startHref = hasRoadmapFlow ? "/questions" : `/assistant?topic=${service.id === "ghana-card" ? "ghana-card" : service.id}`;
  const startLabel = hasRoadmapFlow
    ? service.id === "passport"
      ? "Start passport roadmap"
      : service.id === "national-service"
        ? "Start national service roadmap"
        : service.id === "ghana-card"
          ? "Start Ghana Card roadmap"
          : service.id === "gra-tin"
            ? "Start GRA/Tax roadmap"
            : "Start business roadmap"
    : service.id === "ghana-card"
      ? "Get Ghana Card guidance"
      : "Ask the AI assistant";

  const handleStart = () => {
    if (isComingSoon) return;
    if (hasRoadmapFlow) {
      activateService(service.id);
    }
  };

  return (
    <AppShell title={service.title}>
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-soft-blue">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="mb-1 text-3xl font-bold text-foreground">{service.title}</h1>
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{service.agency}</span>
              </p>
              {isComingSoon ? (
                <p className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  Coming soon
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-muted">{service.description}</p>
        </motion.header>

        <ServiceOverview overview={service.overview} involves={service.involves} />

        <ServiceStepsPreview steps={service.steps} />

        <ServiceMissingDocsCta
          startHref={startHref}
          startLabel={startLabel}
          onStart={handleStart}
          isComingSoon={isComingSoon}
          hasRoadmapFlow={hasRoadmapFlow}
        />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="mb-4 text-lg font-bold text-foreground">Good to know before you start</h2>
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Estimated timeline:</span>
                  <span className="text-muted">{service.estimatedTimeline}</span>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" />
                    Documents you may need
                  </p>
                  <ul className="ml-6 list-disc text-sm text-muted">
                    {service.requiredDocuments.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {service.commonDelayReasons.length ? (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <p className="mb-3 font-semibold text-foreground">Common blockers to avoid</p>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted">
                  {service.commonDelayReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {OFFICIAL_LINKS[service.id]?.length ? (
            <Card>
              <CardContent className="p-6">
                <p className="mb-3 font-semibold text-foreground">Official links</p>
                <div className="flex flex-wrap gap-2">
                  {OFFICIAL_LINKS[service.id].map((link) => (
                    <ActionButton key={link.href} href={link.href} variant="outline">
                      {link.label}
                    </ActionButton>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {service.id === "gra-tin" && !isComingSoon ? <TaxEstimatorCard /> : null}

          {savedDocuments.length ? (
            <Card>
              <CardContent className="p-6">
                <p className="mb-3 font-semibold text-foreground">
                  Your saved documents ({savedDocuments.length})
                </p>
                <p className="mb-3 text-sm text-muted">
                  These documents are available as context in GovFlow AI chat for this service.
                </p>
                <ul className="space-y-2 text-sm text-muted">
                  {savedDocuments.slice(0, 4).map((document) => (
                    <li key={document.id} className="rounded-lg border border-gray-100 bg-background/70 px-3 py-2">
                      <span className="font-medium text-foreground">{document.name}</span>{" "}
                      ({formatFileSize(document.size)})
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton href="/documents" variant="outline">
                    Manage documents
                  </ActionButton>
                  <ActionButton href={`/assistant?topic=${service.id}`} variant="ghost">
                    Ask AI with saved docs
                  </ActionButton>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <p className="text-sm text-muted italic">{service.feeNote}</p>
        </motion.section>
      </div>
    </AppShell>
  );
}
