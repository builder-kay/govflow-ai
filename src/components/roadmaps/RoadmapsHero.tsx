"use client";

import { motion } from "framer-motion";
import { BarChart3, Map, PauseCircle, ShieldAlert, Sparkles } from "lucide-react";
import { SERVICE_DISPLAY_NAMES } from "@/lib/roadmap-instances";
import { cn } from "@/lib/utils";

interface RoadmapsHeroProps {
  total: number;
  averageProgress: number;
  atRiskCount: number;
  pausedCount: number;
  activeServiceLabel: string;
  reduceMotion?: boolean;
}

export function RoadmapsHero({
  total,
  averageProgress,
  atRiskCount,
  pausedCount,
  activeServiceLabel,
  reduceMotion = false,
}: RoadmapsHeroProps) {
  const Wrapper = reduceMotion ? "section" : motion.section;
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      };

  const stats = [
    { label: "Saved roadmaps", value: String(total), icon: BarChart3 },
    { label: "Average progress", value: `${averageProgress}%`, icon: Sparkles },
    { label: "Need attention", value: String(atRiskCount), icon: ShieldAlert, accent: atRiskCount > 0 },
    { label: "Paused", value: String(pausedCount), icon: PauseCircle, accent: pausedCount > 0 },
  ];

  return (
    <Wrapper
      {...wrapperProps}
      className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/50 shadow-sm"
    >
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
            animate={{ x: [0, 14, 0], y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-amber-100/80 blur-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div className="relative p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Synced with your checklist progress
            </p>
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground md:text-4xl">
              <Map className="h-8 w-8 text-primary" />
              My Roadmaps
            </h1>
            <p className="max-w-2xl text-muted">
              Every roadmap here reflects your real checklist completion, risk level, and next step —
              updated as you work.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Active now</p>
            <p className="font-semibold text-foreground">{activeServiceLabel}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const Item = reduceMotion ? "div" : motion.div;
            const itemProps = reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.08 + index * 0.05 },
                };

            return (
              <Item
                key={stat.label}
                {...itemProps}
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm",
                  stat.accent && "border-amber-200 bg-amber-50/50"
                )}
              >
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <Icon className={cn("h-5 w-5", stat.accent ? "text-warning" : "text-primary")} />
                  {stat.value}
                </p>
              </Item>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}

export { SERVICE_DISPLAY_NAMES };
