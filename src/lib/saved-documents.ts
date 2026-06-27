import type { SavedDocument } from "@/types";

export function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildSavedDocumentsContext(savedDocuments: SavedDocument[]): string {
  if (!savedDocuments.length) return "No saved documents yet.";
  return savedDocuments
    .slice(0, 8)
    .map((document) => {
      const summary = document.summary ? ` - ${document.summary}` : "";
      return `${document.name} (${formatFileSize(document.size)})${summary}`;
    })
    .join(" | ");
}
