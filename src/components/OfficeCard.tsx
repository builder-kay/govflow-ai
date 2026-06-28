"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfficialSourceBadge } from "@/components/StatusBadge";
import { getOfficeMeta } from "@/lib/office-meta";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Navigation,
} from "lucide-react";
import type { Office } from "@/types";
import { cn } from "@/lib/utils";

interface OfficeCardProps {
  office: Office;
  distanceKm?: number | null;
  coordinates?: { lat: number; lon: number } | null;
  isNearest?: boolean;
  isSelected?: boolean;
  index?: number;
  onSelect?: () => void;
}

export function OfficeCard({
  office,
  distanceKm,
  coordinates,
  isNearest = false,
  isSelected = false,
  index = 0,
  onSelect,
}: OfficeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = getOfficeMeta(office.id);
  const Icon = meta.icon;

  const phoneDigits = office.phone.replace(/[^\d+]/g, "");
  const phoneHref = phoneDigits.length >= 6 ? `tel:${phoneDigits}` : undefined;
  const directionsHref = coordinates
    ? `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lon}#map=18/${coordinates.lat}/${coordinates.lon}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(office.osmQuery || office.address)}`;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(office.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      id={`office-${office.id}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 24 }}
      whileHover={{ y: -3 }}
      onClick={onSelect}
      className={cn("scroll-mt-28", onSelect && "cursor-pointer")}
    >
      <Card
        className={cn(
          "overflow-hidden border transition-shadow duration-300",
          isSelected
            ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
            : isNearest
              ? "border-emerald-300/60 shadow-md shadow-emerald-500/10"
              : "border-gray-100 hover:shadow-lg"
        )}
      >
        <div className={cn("h-1.5 bg-gradient-to-r", meta.barGradient)} />
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap items-start gap-4">
            <motion.div
              whileHover={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.45 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft-blue"
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground">{office.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {isNearest ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800"
                    >
                      Nearest to you
                    </motion.span>
                  ) : null}
                  {typeof distanceKm === "number" ? (
                    <span className="rounded-full bg-soft-blue px-2.5 py-1 text-xs font-semibold text-primary-dark">
                      {distanceKm.toFixed(1)} km away
                    </span>
                  ) : null}
                  <OfficialSourceBadge />
                </div>
              </div>
              <p className="text-sm font-semibold text-primary">{office.service}</p>
              <p className="mt-1 text-sm text-muted">{office.useCase}</p>
            </div>
          </div>

          <div className="mb-5 space-y-3 rounded-2xl bg-background/80 p-4 text-sm text-muted">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p>{office.address}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void copyAddress();
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
              </div>
            </div>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              {office.phone}
            </p>
            {office.hours ? (
              <p className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                {office.hours}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            {phoneHref ? (
              <Button size="sm" variant="outline" asChild>
                <a href={phoneHref}>
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </Button>
            ) : null}
            <Button size="sm" variant="outline" asChild>
              <a href={directionsHref} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" />
                Directions
              </a>
            </Button>
            {office.portalUrl ? (
              <Button size="sm" asChild>
                <a href={office.portalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {office.portalLabel ?? "Official portal"}
                </a>
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="ml-auto"
            >
              Before you visit
              <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
            </Button>
          </div>

          <AnimatePresence>
            {expanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-950">
                  {office.confirmNote}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
