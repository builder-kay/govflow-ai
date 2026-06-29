"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
  X,
  ArrowRightLeft,
} from "lucide-react";
import type { Service } from "@/types";
import type { LandingServiceSpotlight } from "@/data/landing-service-spotlights";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ROADMAP_SERVICES = new Set(["start-business", "passport", "national-service", "ghana-card"]);
const COMING_SOON_SERVICE_IDS = new Set([
  "nhis",
  "drivers-licence",
  "gra-tin",
  "fda-permit",
  "building-permit",
]);

interface ServiceLearnMoreDialogProps {
  open: boolean;
  service: Service | null;
  spotlight: LandingServiceSpotlight | null;
  icon: React.ComponentType<{ className?: string }>;
  onClose: () => void;
}

export function ServiceLearnMoreDialog({
  open,
  service,
  spotlight,
  icon: Icon,
  onClose,
}: ServiceLearnMoreDialogProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!service || !spotlight) return null;

  const isComingSoon = COMING_SOON_SERVICE_IDS.has(service.id);
  const hasRoadmap = ROADMAP_SERVICES.has(service.id);
  const startHref = hasRoadmap
    ? `/auth?next=${encodeURIComponent(`/services/${service.id}`)}`
    : `/auth?next=${encodeURIComponent("/home")}`;

  const dialog = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-learn-more-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed left-1/2 top-1/2 z-[201] flex max-h-[min(90vh,720px)] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl"
          >
            <div className="relative shrink-0 border-b border-gray-100 bg-gradient-to-br from-soft-blue/50 to-white px-5 py-5 md:px-6">
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-gray-100 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-start gap-4 pr-10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {isComingSoon ? (
                      <Badge variant="warning" className="text-xs">
                        Coming soon
                      </Badge>
                    ) : hasRoadmap ? (
                      <Badge variant="success" className="text-xs">
                        Roadmap available
                      </Badge>
                    ) : null}
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Building2 className="h-3.5 w-3.5" />
                      {service.agency}
                    </span>
                  </div>
                  <h2 id="service-learn-more-title" className="text-xl font-bold text-foreground md:text-2xl">
                    {service.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{service.description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
              <p className="text-sm leading-relaxed text-foreground md:text-base">{service.overview}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {service.estimatedTimeline}
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-primary/10 bg-soft-blue/30 p-4 md:p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-dark">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  How GovFlow helps
                </p>
                <ul className="space-y-2.5">
                  {spotlight.howGovFlowHelps.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ArrowRightLeft className="h-4 w-4 text-amber-600" />
                  From frustration to confidence
                </p>
                <div className="space-y-3">
                  {spotlight.painToGain.map((pair) => (
                    <div
                      key={pair.pain}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="border-b border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-red-800">
                          The problem
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-red-900">{pair.pain}</p>
                      </div>
                      <div className="bg-emerald-50 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                          How GovFlow turns it around
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-emerald-900">{pair.gain}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-5 py-4 md:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={startHref}>
                    {hasRoadmap ? "Start with this service" : "Get started with GovFlow"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted sm:text-right">
                {service.feeNote}
              </p>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(dialog, document.body) : null;
}
