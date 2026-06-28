"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, ListPlus, MessageCircle, ShieldAlert, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";
import { DocumentAnalysisCard } from "@/components/DocumentAnalysisCard";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/NoticeCard";
import { DocumentsHero } from "@/components/documents/DocumentsHero";
import { DocumentsHowItWorks } from "@/components/documents/DocumentsHowItWorks";
import { SavedDocumentsPanel } from "@/components/documents/SavedDocumentsPanel";
import { DocumentProcessingOverlay } from "@/components/documents/DocumentProcessingOverlay";
import type { DocumentAnalysis } from "@/types";
import type { ProcessDocumentStages } from "@/lib/process-document-upload";
import {
  createSavedDocumentStub,
  processDocumentUpload,
} from "@/lib/process-document-upload";
import { useAppStore } from "@/store/useAppStore";

export default function DocumentsPage() {
  const {
    accessibility,
    savedDocuments,
    addSavedDocument,
    updateSavedDocument,
    removeSavedDocument,
  } = useAppStore();

  const reduceMotion = accessibility.reduceAnimations;
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [memorySummary, setMemorySummary] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessDocumentStages>("reading");
  const [processingFileName, setProcessingFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const previewUrl = useMemo(() => {
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) return null;
    return URL.createObjectURL(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleUpload = async (file: File) => {
    setUploadError("");
    setProcessing(true);
    setProcessingFileName(file.name);
    setProcessingStage("reading");
    setUploadedFile(file);

    const stub = createSavedDocumentStub(file);
    addSavedDocument(stub);
    setActiveDocumentId(stub.id);

    try {
      const result = await processDocumentUpload(file, setProcessingStage);
      updateSavedDocument(stub.id, {
        summary: result.memorySummary,
        extractedText: result.extractedText,
        analysis: result.analysis,
        status: "ready",
      });
      setAnalysis(result.analysis);
      setMemorySummary(result.memorySummary);
    } catch {
      updateSavedDocument(stub.id, {
        status: "error",
        summary: "Could not read this document. Try a clearer photo or text file.",
      });
      setUploadError("We couldn't read that document. Try a clearer image or a PDF with selectable text.");
      setAnalysis(null);
      setMemorySummary("");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveActive = () => {
    if (activeDocumentId) {
      removeSavedDocument(activeDocumentId);
    }
    setUploadedFile(null);
    setAnalysis(null);
    setMemorySummary("");
    setActiveDocumentId(null);
    setUploadError("");
  };

  const handleSelectDocument = (documentId: string) => {
    const document = savedDocuments.find((item) => item.id === documentId);
    if (!document || document.status === "processing") return;

    setActiveDocumentId(documentId);
    setAnalysis(document.analysis ?? null);
    setMemorySummary(document.summary ?? "");
    setUploadedFile(null);
    setUploadError("");
  };

  const handleRemoveDocument = (documentId: string) => {
    removeSavedDocument(documentId);
    if (documentId === activeDocumentId) {
      setUploadedFile(null);
      setAnalysis(null);
      setMemorySummary("");
      setActiveDocumentId(null);
    }
  };

  return (
    <AppShell title="Documents">
      <div className="mx-auto max-w-3xl">
        <DocumentsHero savedCount={savedDocuments.length} reduceMotion={reduceMotion} />

        <DocumentsHowItWorks reduceMotion={reduceMotion} className="mb-6" />

        <NoticeCard
          variant="warning"
          title="Protect sensitive information"
          description="Before upload, hide account numbers, PINs, and unrelated personal details you do not want stored on this device or shared with the AI."
          className="mb-6"
        />

        <DocumentUploadCard
          onUpload={handleUpload}
          disabled={processing}
          processing={processing}
        />

        <AnimatePresence>
          {processing ? (
            <DocumentProcessingOverlay
              stage={processingStage}
              fileName={processingFileName}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </AnimatePresence>

        {uploadError ? (
          <NoticeCard
            variant="danger"
            title="Upload issue"
            description={uploadError}
            className="mt-6"
          />
        ) : null}

        {uploadedFile ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Latest upload</p>
                <p className="mt-1 truncate text-sm text-muted">{uploadedFile.name}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveActive} disabled={processing}>
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>

            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
                <img
                  src={previewUrl}
                  alt="Uploaded document preview"
                  className="max-h-64 w-full bg-gray-50 object-contain"
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-3 py-4 text-sm text-muted">
                <ImageIcon className="h-4 w-4 text-primary" />
                Document saved — open AI chat to discuss what GovFlow remembered.
              </div>
            )}
          </motion.div>
        ) : null}

        <SavedDocumentsPanel
          documents={savedDocuments}
          activeDocumentId={activeDocumentId}
          onRemove={handleRemoveDocument}
          onSelect={handleSelectDocument}
          reduceMotion={reduceMotion}
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-soft-blue/50 to-white p-5"
        >
          <p className="font-semibold text-primary-dark">Talk to GovFlow AI about your documents</p>
          <p className="mt-1 text-sm text-muted">
            Saved document details are passed into the assistant automatically. Ask things like
            “Why was my Form A rejected?” or “What should I fix first?”
          </p>
          <ActionButton href="/assistant" className="mt-3" size="sm">
            <MessageCircle className="h-4 w-4" />
            Open AI Assistant
          </ActionButton>
        </motion.div>

        <AnimatePresence>
          {analysis ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              className="mt-8 space-y-6"
            >
              <DocumentAnalysisCard
                analysis={analysis}
                memorySummary={memorySummary}
                reduceMotion={reduceMotion}
              />

              <div className="flex flex-wrap gap-3">
                <ActionButton href="/assistant">
                  <MessageCircle className="h-4 w-4" />
                  Discuss in AI chat
                </ActionButton>
                <ActionButton href="/checklist" variant="outline">
                  <ListPlus className="h-4 w-4" />
                  Add missing items to checklist
                </ActionButton>
                <ActionButton href="/risk" variant="outline">
                  <ShieldAlert className="h-4 w-4" />
                  Check for mistakes
                </ActionButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
