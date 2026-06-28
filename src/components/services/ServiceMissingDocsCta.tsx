"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";

interface ServiceMissingDocsCtaProps {
  startHref: string;
  startLabel: string;
  onStart?: () => void;
  isComingSoon?: boolean;
  hasRoadmapFlow?: boolean;
}

export function ServiceMissingDocsCta({
  startHref,
  startLabel,
  onStart,
  isComingSoon = false,
  hasRoadmapFlow = true,
}: ServiceMissingDocsCtaProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.45, ease: "easeOut" }}
      className="mb-10 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-soft-blue/50 via-white to-soft-blue/20 p-6 shadow-sm md:p-7"
    >
      <p className="mb-1 flex items-center gap-2 text-lg font-semibold text-primary-dark">
        <Sparkles className="h-5 w-5 text-primary" />
        Don&apos;t have everything yet?
      </p>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
        That is normal. You do not need every document before you begin. GovFlow will guide you
        step by step, tell you what is missing, and help you prepare before you visit any office.
      </p>
      <div className="flex flex-wrap gap-2">
        {!isComingSoon ? (
          <ActionButton href={startHref} onClick={onStart}>
            {startLabel}
          </ActionButton>
        ) : null}
        <ActionButton href="/assistant" variant="outline">
          Open AI assistant
        </ActionButton>
        {!hasRoadmapFlow && !isComingSoon ? (
          <ActionButton href="/checklist" variant="ghost">
            Back to checklist
          </ActionButton>
        ) : null}
      </div>
      {isComingSoon ? (
        <p className="mt-4 text-sm text-muted">
          This service is currently being prepared and will be available soon.
        </p>
      ) : null}
    </motion.section>
  );
}
