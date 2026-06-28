"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowRight,
  Handshake,
  Sparkles,
} from "lucide-react";
import { services } from "@/data/services";
import { getLandingServiceSpotlight } from "@/data/landing-service-spotlights";
import type { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceLearnMoreDialog } from "@/components/landing/ServiceLearnMoreDialog";

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

export function LandingServices() {
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openLearnMore = useCallback((service: Service) => {
    setActiveService(service);
    setDialogOpen(true);
  }, []);

  const closeLearnMore = useCallback(() => {
    setDialogOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollToServices = () => {
      if (window.location.hash !== "#services") return;
      const el = document.getElementById("services");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scrollToServices();
    window.addEventListener("hashchange", scrollToServices);
    return () => window.removeEventListener("hashchange", scrollToServices);
  }, []);

  const spotlight = activeService ? getLandingServiceSpotlight(activeService.id) : null;
  const ActiveIcon = activeService ? iconMap[activeService.icon] || Briefcase : Briefcase;

  return (
    <>
      <section id="services" className="mt-16 scroll-mt-24 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services</p>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Every government service GovFlow supports
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              From passports to business registration — browse what we cover, then learn how GovFlow
              turns common setbacks into clear next steps.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <Card className="group overflow-hidden border-primary/20 bg-gradient-to-br from-soft-blue/40 via-white to-violet-50/40 transition-shadow hover:shadow-lg">
              <div className="h-1 bg-gradient-to-r from-primary to-violet-600 opacity-90" />
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <Handshake className="h-5 w-5" />
                      </div>
                      <Badge variant="success" className="text-xs">
                        Passport active now
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">GovFlow Agent</h3>
                    <p className="mt-1 text-sm text-muted">Delegated assistance service</p>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
                      Need help beyond guidance? GovFlow Agent can handle office follow-ups and admin
                      heavy steps on your behalf, then alert you only when your in-person action is
                      required.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        SMS in-person alerts
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-1.5">
                        Coordinator + field support
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-1.5">
                        More services coming soon
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 md:min-w-[220px]">
                    <Button asChild className="justify-between">
                      <Link href="/relay">
                        Open Agent dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/relay/passport">
                        Start passport Agent
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Briefcase;
            const isComingSoon = COMING_SOON_SERVICE_IDS.has(service.id);
            const hasRoadmap = ROADMAP_SERVICES.has(service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden border-gray-100 transition-shadow hover:shadow-lg">
                  <div className="h-1 bg-gradient-to-r from-primary/70 to-primary-dark/70 opacity-80" />
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <motion.div
                        whileHover={{ rotate: [0, -6, 6, 0] }}
                        transition={{ duration: 0.4 }}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-blue text-primary"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      {isComingSoon ? (
                        <Badge variant="warning" className="shrink-0 text-xs">
                          Coming soon
                        </Badge>
                      ) : hasRoadmap ? (
                        <Badge variant="success" className="shrink-0 text-xs">
                          Roadmap
                        </Badge>
                      ) : null}
                    </div>

                    <h3 className="font-bold text-foreground">{service.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {service.agency}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full justify-between group-hover:border-primary/30 group-hover:bg-soft-blue/30"
                      onClick={() => openLearnMore(service)}
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted italic md:text-sm">
          Fees may vary by service type, location, category, or agency updates. GovFlow shows
          guidance and reminders, not final official charges.
        </p>
      </section>

      <ServiceLearnMoreDialog
        open={dialogOpen}
        service={activeService}
        spotlight={spotlight ?? null}
        icon={ActiveIcon}
        onClose={closeLearnMore}
      />
    </>
  );
}
