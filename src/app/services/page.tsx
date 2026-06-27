"use client";

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
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/data/services";
import { useAppStore } from "@/store/useAppStore";

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
const COMING_SOON_SERVICE_IDS = new Set([
  "nhis",
  "drivers-licence",
  "gra-tin",
  "fda-permit",
  "building-permit",
]);

export default function ServicesPage() {
  const { setCurrentServiceId } = useAppStore();

  return (
    <AppShell title="Services">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Browse Services</h1>
          <p className="text-muted">
            Choose a government service to get a personalized roadmap, checklist, and guidance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Briefcase;
            const isComingSoon = COMING_SOON_SERVICE_IDS.has(service.id);
            return (
              <div
                key={service.id}
                onClick={() => !isComingSoon && setCurrentServiceId(service.id)}
                onKeyDown={(e) => e.key === "Enter" && !isComingSoon && setCurrentServiceId(service.id)}
                role="presentation"
              >
                <ServiceCard
                  icon={Icon}
                  title={service.title}
                  description={service.description}
                  href={isComingSoon ? undefined : `/services/${service.id}`}
                  comingSoon={isComingSoon}
                />
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted italic">
          Fees may vary by service type, location, category, or agency updates. GovFlow shows
          guidance and reminders, not final official charges.
        </p>
      </div>
    </AppShell>
  );
}
