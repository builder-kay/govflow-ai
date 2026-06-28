"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentsHeroProps {
  savedCount: number;
  reduceMotion?: boolean;
}

export function DocumentsHero({ savedCount, reduceMotion = false }: DocumentsHeroProps) {
  const Wrapper = reduceMotion ? "section" : motion.section;
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      };

  return (
    <Wrapper
      {...wrapperProps}
      className="relative mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
    >
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-soft-blue/70 blur-3xl"
            animate={{ x: [0, 12, 0], y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-amber-100/80 blur-2xl"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-soft-blue/50 px-3 py-1 text-xs font-semibold text-primary-dark">
            <Sparkles className="h-3.5 w-3.5" />
            Document memory for AI chat
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Explain My Document
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Upload a rejected form, government letter, or receipt. GovFlow reads it, saves the
            details, and brings that memory into your AI conversations.
          </p>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-3 rounded-xl border border-gray-100 bg-background/80 px-4 py-3",
            savedCount > 0 && "border-primary/20 bg-soft-blue/30"
          )}
        >
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Saved for AI</p>
            <p className="text-xl font-bold text-foreground">{savedCount}</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
