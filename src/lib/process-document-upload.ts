import type { DocumentAnalysis, SavedDocument } from "@/types";
import { extractDocumentContent } from "@/lib/document-extract";

export type ProcessDocumentStages = "reading" | "analyzing" | "saving";

export type ProcessDocumentResult = {
  memorySummary: string;
  extractedText: string;
  analysis: DocumentAnalysis;
};

export async function processDocumentUpload(
  file: File,
  onStage?: (stage: ProcessDocumentStages) => void
): Promise<ProcessDocumentResult> {
  onStage?.("reading");
  const extraction = await extractDocumentContent(file);

  onStage?.("analyzing");
  const response = await fetch("/api/documents/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      text: extraction.text,
      imageDataUrl: extraction.imageDataUrl,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Partial<ProcessDocumentResult>;
  onStage?.("saving");

  if (!payload.analysis) {
    throw new Error("Could not analyze this document.");
  }

  return {
    analysis: payload.analysis,
    memorySummary: payload.memorySummary ?? `Saved "${file.name}" for GovFlow AI chat.`,
    extractedText: payload.extractedText ?? extraction.text,
  };
}

export function createSavedDocumentStub(file: File): SavedDocument {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${file.name}`,
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toISOString(),
    summary: "Reading and saving document details…",
    status: "processing",
  };
}
