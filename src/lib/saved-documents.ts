import type { SavedDocument } from "@/types";

const MAX_CONTEXT_CHARS = 14_000;
const EXCERPT_PER_DOC = 1_800;

export function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function excerpt(text: string, max = EXCERPT_PER_DOC): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

function formatDocumentForContext(document: SavedDocument): string {
  const lines = [`[${document.name}]`];

  if (document.analysis?.documentType) {
    lines.push(`Type: ${document.analysis.documentType}`);
  }

  if (document.summary) {
    lines.push(`Memory: ${document.summary}`);
  }

  if (document.analysis?.missingAreas?.length) {
    lines.push(`Issues: ${document.analysis.missingAreas.join("; ")}`);
  }

  if (document.extractedText) {
    lines.push(`Content: ${excerpt(document.extractedText)}`);
  } else if (document.analysis?.purpose) {
    lines.push(`Purpose: ${document.analysis.purpose}`);
  }

  return lines.join("\n");
}

export function buildSavedDocumentsContext(savedDocuments: SavedDocument[]): string {
  const ready = savedDocuments.filter((document) => document.status !== "processing");
  if (!ready.length) return "No saved documents yet.";

  const blocks: string[] = [];
  let totalLength = 0;

  for (const document of ready.slice(0, 6)) {
    const block = formatDocumentForContext(document);
    if (totalLength + block.length > MAX_CONTEXT_CHARS) break;
    blocks.push(block);
    totalLength += block.length;
  }

  return blocks.join("\n---\n");
}
