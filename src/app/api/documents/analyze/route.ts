import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { DocumentAnalysis } from "@/types";
import { analyzeDocument } from "@/lib/ai-mock";
import { truncateDocumentText } from "@/lib/document-extract";

type AnalyzeRequest = {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  text?: string;
  imageDataUrl?: string;
};

type AnalyzeResponse = {
  analysis: DocumentAnalysis;
  memorySummary: string;
  extractedText: string;
};

const ANALYSIS_SCHEMA = `Return JSON with:
- documentType (string)
- purpose (string)
- importantSections (string array)
- missingAreas (string array — rejection reasons, blank fields, or risks you notice)
- nextAction (string)
- memorySummary (string — 2-4 sentences the AI should remember about this document for future chat, e.g. "User's Form A was rejected because signature and date were missing.")
- extractedText (string — key facts and field values read from the document, concise)`;

function buildFallback(
  fileName: string,
  fileType: string,
  fileSize: number | undefined,
  text: string
): AnalyzeResponse {
  const analysis = analyzeDocument({ fileName, fileType, fileSize });
  const excerpt = text.trim().slice(0, 600);
  const memorySummary = excerpt
    ? `Saved document "${fileName}": ${excerpt}${text.length > 600 ? "…" : ""}`
    : `Saved document "${fileName}" for reference in GovFlow AI chat.`;

  return {
    analysis,
    memorySummary,
    extractedText: truncateDocumentText(text || excerpt),
  };
}

function parseAnalysisPayload(raw: string, fallback: AnalyzeResponse): AnalyzeResponse {
  try {
    const parsed = JSON.parse(raw) as Partial<AnalyzeResponse & DocumentAnalysis>;
    const analysis: DocumentAnalysis = {
      documentType: parsed.documentType ?? fallback.analysis.documentType,
      purpose: parsed.purpose ?? fallback.analysis.purpose,
      importantSections: parsed.importantSections?.length
        ? parsed.importantSections
        : fallback.analysis.importantSections,
      missingAreas: parsed.missingAreas?.length
        ? parsed.missingAreas
        : fallback.analysis.missingAreas,
      nextAction: parsed.nextAction ?? fallback.analysis.nextAction,
    };

    return {
      analysis,
      memorySummary: parsed.memorySummary?.trim() || fallback.memorySummary,
      extractedText: truncateDocumentText(parsed.extractedText?.trim() || fallback.extractedText),
    };
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AnalyzeRequest;
  const fileName = body.fileName?.trim() || "uploaded-document";
  const fileType = body.fileType?.trim() || "application/octet-stream";
  const fileSize = body.fileSize;
  const text = body.text?.trim() ?? "";
  const imageDataUrl = body.imageDataUrl?.trim();
  const fallback = buildFallback(fileName, fileType, fileSize, text);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallback);
  }

  if (!text && !imageDataUrl) {
    return NextResponse.json(fallback);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const userPrompt = imageDataUrl
      ? `You are GovFlow AI helping a Ghana citizen understand a government document (form, rejection letter, notice, or receipt). Read the image carefully. ${ANALYSIS_SCHEMA}`
      : `You are GovFlow AI helping a Ghana citizen understand a government document. Document filename: "${fileName}". Extracted text:\n\n${text}\n\n${ANALYSIS_SCHEMA}`;

    const userMessageContent = imageDataUrl
      ? [
          { type: "text" as const, text: userPrompt },
          { type: "image_url" as const, image_url: { url: imageDataUrl } },
        ]
      : userPrompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You analyze Ghana government documents for citizens. Be practical, flag missing fields or rejection reasons, and produce concise memory for follow-up chat.",
        },
        { role: "user", content: userMessageContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json(parseAnalysisPayload(raw, fallback));
  } catch (error) {
    console.error("[documents/analyze]", error);
    return NextResponse.json(fallback);
  }
}
