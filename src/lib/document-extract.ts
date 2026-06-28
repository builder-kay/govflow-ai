const MAX_EXTRACT_CHARS = 12_000;

export function truncateDocumentText(text: string, max = MAX_EXTRACT_CHARS): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}\n\n[Content truncated for storage.]`;
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const parts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) parts.push(pageText);
  }

  return parts.join("\n\n");
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export type DocumentExtractionResult = {
  text: string;
  imageDataUrl?: string;
  method: "text" | "pdf" | "docx" | "image" | "none";
};

export async function extractDocumentContent(file: File): Promise<DocumentExtractionResult> {
  const lowerName = file.name.toLowerCase();
  const mime = file.type || "";

  if (mime.startsWith("text/") || lowerName.endsWith(".txt")) {
    const text = await readFileAsText(file);
    return { text: truncateDocumentText(text), method: "text" };
  }

  if (mime.startsWith("image/")) {
    const imageDataUrl = await readFileAsDataUrl(file);
    return { text: "", imageDataUrl, method: "image" };
  }

  if (mime === "application/pdf" || lowerName.endsWith(".pdf")) {
    try {
      const text = await extractPdfText(file);
      if (text.trim()) {
        return { text: truncateDocumentText(text), method: "pdf" };
      }
    } catch {
      // Scanned PDFs may have no extractable text layer.
    }
    return { text: "", method: "pdf" };
  }

  if (
    mime.includes("wordprocessingml") ||
    mime === "application/msword" ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc")
  ) {
    try {
      const text = await extractDocxText(file);
      return { text: truncateDocumentText(text), method: "docx" };
    } catch {
      return { text: "", method: "none" };
    }
  }

  return { text: "", method: "none" };
}
