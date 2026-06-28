"use client";

import { motion } from "framer-motion";
import { Brain, FileSearch, Sparkles } from "lucide-react";
import type { ProcessDocumentStages } from "@/lib/process-document-upload";
import { cn } from "@/lib/utils";

const stageCopy: Record<ProcessDocumentStages, { label: string; icon: typeof FileSearch }> = {
  reading: { label: "Reading your document…", icon: FileSearch },
  analyzing: { label: "Extracting details for AI memory…", icon: Brain },
  saving: { label: "Saving to your document library…", icon: Sparkles },
};

interface DocumentProcessingOverlayProps {
  stage: ProcessDocumentStages;
  fileName: string;
  reduceMotion?: boolean;
}

export function DocumentProcessingOverlay({
  stage,
  fileName,
  reduceMotion = false,
}: DocumentProcessingOverlayProps) {
  const { label, icon: Icon } = stageCopy[stage];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-soft-blue/60 to-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {!reduceMotion ? (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-primary/20"
              animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          ) : null}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="mt-1 truncate text-sm text-muted">{fileName}</p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
            <motion.div
              className={cn("h-full rounded-full bg-primary")}
              initial={{ width: "12%" }}
              animate={{
                width: stage === "reading" ? "38%" : stage === "analyzing" ? "72%" : "100%",
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
