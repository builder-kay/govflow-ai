"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  FileText,
  ImageIcon,
  ListPlus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";
import { DocumentAnalysisCard } from "@/components/DocumentAnalysisCard";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/NoticeCard";
import { analyzeDocument } from "@/lib/ai-mock";
import { formatFileSize } from "@/lib/saved-documents";
import { useAppStore } from "@/store/useAppStore";

export default function DocumentsPage() {
  const {
    documentUploaded,
    setDocumentUploaded,
    savedDocuments,
    addSavedDocument,
    removeSavedDocument,
  } = useAppStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDocument> | null>(null);

  const previewUrl = useMemo(() => {
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) return null;
    return URL.createObjectURL(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleUpload = (file: File) => {
    const summary = file.type.startsWith("image/")
      ? "Image document uploaded for verification and guidance."
      : "Document saved for reference in chat and services.";
    const savedDocument = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      summary,
    };
    addSavedDocument(savedDocument);
    setUploadedFile(file);
    setDocumentUploaded(true);
    setAnalysis(analyzeDocument({ fileName: file.name, fileType: file.type, fileSize: file.size }));
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setDocumentUploaded(false);
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

        <NoticeCard
          variant="warning"
          title="Protect sensitive information"
          description="Before upload, hide account numbers, PINs, and unrelated personal details you do not want to share."
          className="mb-6"
        />

        <DocumentUploadCard onUpload={handleUpload} />

        {uploadedFile ? (
          <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Uploaded file</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                  {uploadedFile.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <FileText className="h-4 w-4 text-primary" />
                  )}
                  <span className="truncate">{uploadedFile.name}</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                  {documentUploaded ? " - Ready for analysis" : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemove}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>

            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
                <img
                  src={previewUrl}
                  alt="Uploaded document preview"
                  className="max-h-64 w-full object-contain bg-gray-50"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {savedDocuments.length ? (
          <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 font-semibold text-foreground">
              Saved documents ({savedDocuments.length})
            </p>
            <div className="space-y-2">
              {savedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-background/70 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{document.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <FileText className="h-3.5 w-3.5" />
                      {formatFileSize(document.size)}
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {new Date(document.uploadedAt).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSavedDocument(document.id)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
