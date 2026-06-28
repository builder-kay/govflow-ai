"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import type { LegalDocument } from "@/data/legal";
import { LEGAL_OPERATOR } from "@/data/legal";
import type { LegalDocumentMeta } from "@/lib/legal-meta";

interface LegalDocumentHeroProps {
  document: LegalDocument;
  meta: LegalDocumentMeta;
  readingMinutes: number;
}

export function LegalDocumentHero({ document, meta, readingMinutes }: LegalDocumentHeroProps) {
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br ${meta.heroGradient} p-6 shadow-sm md:p-8`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={`mb-5 h-1 w-16 rounded-full bg-gradient-to-r ${meta.accentBar}`} />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <motion.div
            whileHover={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.45 }}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${meta.iconWrap}`}
          >
            <Icon className="h-7 w-7" />
          </motion.div>
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-white/80 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted backdrop-blur-sm">
              {meta.badge}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {document.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {document.summary}
            </p>
            <p className="mt-2 text-xs text-muted">
              Operated by <span className="font-medium text-foreground">{LEGAL_OPERATOR}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            Updated {document.lastUpdated}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            {readingMinutes} min read
          </span>
        </div>
      </div>
    </motion.div>
  );
}
