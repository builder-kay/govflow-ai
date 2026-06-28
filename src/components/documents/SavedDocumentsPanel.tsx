"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react";
import type { SavedDocument } from "@/types";
import { formatFileSize } from "@/lib/saved-documents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/ActionButton";
import { cn } from "@/lib/utils";

interface SavedDocumentsPanelProps {
  documents: SavedDocument[];
  activeDocumentId?: string | null;
  onRemove: (documentId: string) => void;
  onSelect?: (documentId: string) => void;
  reduceMotion?: boolean;
}

export function SavedDocumentsPanel({
  documents,
  activeDocumentId,
  onRemove,
  onSelect,
  reduceMotion = false,
}: SavedDocumentsPanelProps) {
  if (!documents.length) return null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">Your document memory</p>
          <p className="text-sm text-muted">
            {documents.length} saved — the AI can reference these in chat.
          </p>
        </div>
        <ActionButton href="/assistant" size="sm" variant="outline">
          <MessageCircle className="h-4 w-4" />
          Ask about a document
        </ActionButton>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {documents.map((document, index) => {
            const isActive = document.id === activeDocumentId;
            const isProcessing = document.status === "processing";
            const isReady = document.status === "ready" || !document.status;

            return (
              <motion.div
                key={document.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={cn(
                  "rounded-xl border px-4 py-3 transition-colors",
                  isActive
                    ? "border-primary/30 bg-soft-blue/40"
                    : "border-gray-100 bg-background/70 hover:border-primary/15"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect?.(document.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-foreground">{document.name}</p>
                      {isProcessing ? (
                        <Badge variant="warning" className="gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Reading…
                        </Badge>
                      ) : isReady ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          In AI memory
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {formatFileSize(document.size)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {new Date(document.uploadedAt).toLocaleString()}
                      </span>
                    </p>

                    {document.summary && !isProcessing ? (
                      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
                        <Brain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{document.summary}</span>
                      </p>
                    ) : null}
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(document.id)}
                    className="shrink-0"
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
