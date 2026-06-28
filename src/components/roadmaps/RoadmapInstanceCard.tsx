"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Clock3,
  ListChecks,
  MapPin,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { RiskBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RoadmapListItem } from "@/lib/roadmap-instances";
import { cn } from "@/lib/utils";

interface RoadmapInstanceCardProps {
  item: RoadmapListItem;
  onContinue: (serviceId: string) => void;
  onPause: (serviceId: string) => void;
  onResume: (serviceId: string) => void;
  onDelete: (serviceId: string) => void;
  onNavigate: (serviceId: string, href: string) => void;
  reduceMotion?: boolean;
  index?: number;
}

export function RoadmapInstanceCard({
  item,
  onContinue,
  onPause,
  onResume,
  onDelete,
  onNavigate,
  reduceMotion = false,
  index = 0,
}: RoadmapInstanceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPaused = item.status === "paused";
  const Wrapper = reduceMotion ? "article" : motion.article;
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: index * 0.06 },
        whileHover: { y: -4, transition: { duration: 0.2 } },
      };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        item.isCurrent ? "border-primary/30 ring-1 ring-primary/10" : "border-gray-100",
        isPaused && "opacity-90"
      )}
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: index * 0.06 }}
          style={{ transformOrigin: "left" }}
        />
      ) : null}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {item.isCurrent ? (
              <Badge variant="gold" className="text-xs">
                Active now
              </Badge>
            ) : null}
            {isPaused ? (
              <Badge variant="warning" className="gap-1 text-xs">
                <PauseCircle className="h-3 w-3" />
                Paused
              </Badge>
            ) : null}
          </div>
          <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            {item.location}
          </p>
        </div>

        <div className="relative flex items-start gap-2">
          <RiskBadge level={item.riskLevel} />
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Roadmap actions"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 min-w-[168px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {isPaused ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-soft-blue/50"
                      onClick={() => {
                        setMenuOpen(false);
                        onResume(item.serviceId);
                      }}
                    >
                      <PlayCircle className="h-4 w-4 text-primary" />
                      Resume
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-soft-blue/50"
                      onClick={() => {
                        setMenuOpen(false);
                        onPause(item.serviceId);
                      }}
                    >
                      <PauseCircle className="h-4 w-4 text-primary" />
                      Pause
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(item.serviceId);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-gray-100 bg-background/70 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted">Completion</p>
          <p className="text-xs font-semibold text-primary-dark">{item.progress}%</p>
        </div>
        <ProgressBar value={item.progress} />
      </div>

      <div className="mb-5 rounded-2xl bg-soft-blue/40 p-4">
        <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted">
          <Clock3 className="h-3.5 w-3.5 text-primary" />
          Next step
        </p>
        <p className="font-semibold text-foreground">{item.nextStep}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onContinue(item.serviceId)}>
          {isPaused ? "Resume & continue" : "Continue"}
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onNavigate(item.serviceId, "/checklist")}>
          <ListChecks className="h-4 w-4" />
          Checklist
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onNavigate(item.serviceId, "/risk")}>
          <ShieldAlert className="h-4 w-4" />
          Risk check
        </Button>
      </div>
    </Wrapper>
  );
}
