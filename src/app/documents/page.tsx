"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListPlus,
  ShieldAlert,
  MessageCircle,
  Languages,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";
import { DocumentAnalysisCard } from "@/components/DocumentAnalysisCard";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { analyzeDocument } from "@/lib/ai-mock";
import { useAppStore } from "@/store/useAppStore";

export default function DocumentsPage() {
  const { documentUploaded, setDocumentUploaded } = useAppStore();
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDocument> | null>(
    documentUploaded ? analyzeDocument() : null
  );

  const handleUpload = (fileName: string) => {
    setDocumentUploaded(true);
    setAnalysis(analyzeDocument(fileName));
  };

  return (
    <AppShell title="Documents">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Explain My Document</h1>
          <p className="text-muted">
            Upload a form, receipt, letter, or government notice. GovFlow will explain what it
            means and what to do next.
          </p>
        </div>

        <DocumentUploadCard onUpload={handleUpload} />

        <div className="mt-6 rounded-xl border border-primary/20 bg-soft-blue/30 p-4">
          <p className="font-semibold text-primary-dark">Use the AI agent for live document help</p>
          <p className="mt-1 text-sm text-muted">
            Upload PDFs or images directly in the AI Assistant — powered by your OpenAI Agent
            Builder workflow.
          </p>
          <ActionButton href="/assistant" className="mt-3" size="sm">
            Open AI Assistant
          </ActionButton>
        </div>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <DocumentAnalysisCard analysis={analysis} />

              <div className="flex flex-wrap gap-3">
                <ActionButton href="/checklist">
                  <ListPlus className="h-4 w-4" />
                  Add missing items to checklist
                </ActionButton>
                <ActionButton href="/risk" variant="outline">
                  <ShieldAlert className="h-4 w-4" />
                  Check for mistakes
                </ActionButton>
                <Button variant="outline" disabled title="Demo mode">
                  <MessageCircle className="h-4 w-4" />
                  Explain in simple English
                </Button>
                <Button variant="ghost" disabled title="Demo mode">
                  <Languages className="h-4 w-4" />
                  Translate
                </Button>
                <Button variant="ghost" disabled title="Auto-saved in demo">
                  <Save className="h-4 w-4" />
                  Save document
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
