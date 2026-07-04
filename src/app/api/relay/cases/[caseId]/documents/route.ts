import { NextResponse } from "next/server";
import { RELAY_DOCUMENTS_BUCKET } from "@/lib/relay-config";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { RelayDocumentMeta } from "@/types/relay";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  const userId = request.headers.get("x-govflow-user-id")?.trim();
  if (!userId) {
    return NextResponse.json({ error: "Missing user id." }, { status: 401 });
  }

  const { caseId } = await context.params;
  const relayCase = await getRelayCaseById(caseId);
  if (!relayCase || relayCase.userId !== userId) {
    return NextResponse.json({ error: "Agent request not found." }, { status: 404 });
  }
  if (relayCase.status === "intake_received") {
    return NextResponse.json(
      { error: "Document upload opens after admin approval." },
      { status: 409 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const documentTypeRaw = formData?.get("documentType");
  const documentType = typeof documentTypeRaw === "string" ? documentTypeRaw.trim() : "";

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "Please choose a valid file." }, { status: 400 });
  }
  if (!documentType) {
    return NextResponse.json({ error: "Document type is required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const documentId = crypto.randomUUID();
  const safeName = sanitizeFilename(file.name || "document");
  let storagePath: string | undefined;

  if (hasSupabaseAdminConfig) {
    const supabase = getSupabaseAdminClient();
    storagePath = `${caseId}/${Date.now()}-${safeName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(RELAY_DOCUMENTS_BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) {
      return NextResponse.json(
        { error: `Could not store document securely: ${error.message}` },
        { status: 502 }
      );
    }
  }

  const documentMeta: RelayDocumentMeta = {
    id: documentId,
    caseId,
    name: file.name || "Document",
    documentType,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: now,
    uploadedBy: "user",
    storagePath,
  };

  const updatedCase = await updateRelayCase(caseId, {
    documents: [...relayCase.documents, documentMeta],
    eventType: "step_updated",
    eventMessage: `User uploaded: ${documentType}.`,
    actor: "user",
  });

  return NextResponse.json({ case: updatedCase, document: documentMeta }, { status: 201 });
}
