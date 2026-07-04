"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { BellRing, CheckCircle2, Clock3, Loader2, UploadCloud, WalletCards } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RelayCaseTimeline } from "@/components/relay/RelayCaseTimeline";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";
import { Button } from "@/components/ui/button";
import {
  completePresenceStep,
  fetchRelayCase,
  initializeRelayPayment,
  uploadRelayDocument,
} from "@/lib/relay-client";
import { RELAY_FEATURE_NAME, RELAY_REQUIRED_PASSPORT_DOCUMENTS } from "@/lib/relay-config";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import type { RelayCase } from "@/types/relay";

async function resolveUser() {
  if (!hasSupabaseConfig) return { id: "demo-user", email: "customer@relay.govflow.app" };
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return {
    id: data.user?.id || "demo-user",
    email: data.user?.email || "customer@relay.govflow.app",
  };
}

export default function RelayCaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const [relayCase, setRelayCase] = useState<RelayCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingComplete, setMarkingComplete] = useState(false);
  const [paying, setPaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("Birth certificate");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await fetchRelayCase(caseId);
      setRelayCase(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Agent request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [caseId]);

  const nextUserStep = useMemo(
    () =>
      relayCase?.steps.find(
        (step) => step.assignee === "user" && step.requiresUserPresence && step.status !== "completed"
      ),
    [relayCase]
  );
  const canPay = relayCase?.status === "payment_pending";
  const canUploadDocs = Boolean(
    relayCase &&
      relayCase.status !== "intake_received" &&
      relayCase.status !== "cancelled" &&
      relayCase.paymentStatus !== "failed"
  );

  const handlePresenceComplete = async () => {
    if (!relayCase) return;
    setMarkingComplete(true);
    setError("");
    try {
      const user = await resolveUser();
      const updated = await completePresenceStep(relayCase.id, user.id);
      setRelayCase(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mark step complete.");
    } finally {
      setMarkingComplete(false);
    }
  };

  const handlePayNow = async () => {
    if (!relayCase) return;
    setPaying(true);
    setError("");
    try {
      const user = await resolveUser();
      const payment = await initializeRelayPayment(relayCase.id, relayCase.intake.contact.email || user.email);
      if (payment.demoMode) {
        await load();
        return;
      }
      window.location.href = payment.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment.");
    } finally {
      setPaying(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!relayCase || !documentFile) return;
    setUploading(true);
    setError("");
    try {
      const user = await resolveUser();
      const updated = await uploadRelayDocument(relayCase.id, user.id, documentFile, documentType);
      setRelayCase(updated);
      setDocumentFile(null);
      setDocumentType("Birth certificate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell title="Agent request">
      <div className="mx-auto max-w-4xl space-y-6">
        {loading ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading request timeline...
          </p>
        ) : relayCase ? (
          <>
            <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/50 to-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">{RELAY_FEATURE_NAME}</p>
                  <h1 className="mt-1 text-2xl font-bold text-foreground">Passport request timeline</h1>
                  <p className="mt-1 text-sm text-muted">
                    Request {relayCase.id.slice(0, 8).toUpperCase()} • Created{" "}
                    {new Date(relayCase.createdAt).toLocaleString()}
                  </p>
                </div>
                <RelayCaseStatusPill status={relayCase.status} />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <p className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
                  <span className="font-semibold text-foreground">Fee:</span> GHS {relayCase.feeGhs}
                </p>
                <p className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
                  <span className="font-semibold text-foreground">Payment:</span> {relayCase.paymentStatus}
                </p>
                <p className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
                  <span className="font-semibold text-foreground">SLA:</span> {relayCase.slaHours}h first
                  action
                </p>
              </div>
            </section>

            {relayCase.status === "intake_received" ? (
              <section className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 text-sm text-blue-900 shadow-sm">
                <p className="font-semibold">Admin review in progress</p>
                <p className="mt-1">
                  We are reviewing your intake. Once approved, admin will contact you on WhatsApp to
                  agree scope and final fee before payment.
                </p>
              </section>
            ) : null}

            {canPay ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-amber-900">Approved - complete secure payment</p>
                <p className="mt-1 text-sm text-amber-900">
                  Admin has approved your request and completed WhatsApp alignment. Return here to pay
                  securely and start active case handling.
                </p>
                <Button className="mt-3" onClick={() => void handlePayNow()} disabled={paying}>
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <WalletCards className="h-4 w-4" />
                      Pay securely now
                    </>
                  )}
                </Button>
              </section>
            ) : null}

            {nextUserStep ? (
              <section className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 shadow-sm">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-900">
                  <BellRing className="h-4 w-4" />
                  Action needed from you
                </p>
                <p className="mt-2 text-sm text-orange-900">
                  <span className="font-semibold">{nextUserStep.title}:</span> {nextUserStep.description}
                </p>
                <Button onClick={() => void handlePresenceComplete()} disabled={markingComplete} className="mt-3">
                  {markingComplete ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark this presence step as done
                    </>
                  )}
                </Button>
              </section>
            ) : (
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                All user-presence steps are complete. GovFlow handles the remaining operations and
                will notify you if anything changes.
              </section>
            )}

            {canUploadDocs ? (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Supporting documents for Agent actions</p>
                <p className="mt-1 text-sm text-muted">
                  Upload birth certificate and other required documents. Updates are shared in-app, by
                  SMS, and through WhatsApp follow-up.
                </p>
                <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
                  {RELAY_REQUIRED_PASSPORT_DOCUMENTS.map((item) => (
                    <p key={item} className="rounded-lg border border-gray-100 bg-background/60 px-2.5 py-2">
                      {item}
                    </p>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={documentType}
                    onChange={(event) => setDocumentType(event.target.value)}
                    placeholder="Document type (e.g. Birth certificate)"
                    className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="file"
                    onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
                    className="h-11 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    onClick={() => void handleUploadDocument()}
                    disabled={uploading || !documentFile || !documentType.trim()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                {relayCase.documents.length ? (
                  <div className="mt-3 space-y-2">
                    {relayCase.documents.map((doc) => (
                      <article
                        key={doc.id}
                        className="rounded-xl border border-gray-100 bg-background/60 px-3 py-2"
                      >
                        <p className="text-sm font-medium text-foreground">{doc.documentType}</p>
                        <p className="text-xs text-muted">
                          {doc.name} • {(doc.size / 1024).toFixed(0)} KB •{" "}
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            <RelayCaseTimeline relayCase={relayCase} />

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Recent updates
              </p>
              <div className="space-y-2">
                {[...relayCase.events]
                  .slice()
                  .reverse()
                  .slice(0, 6)
                  .map((event) => (
                    <article key={event.id} className="rounded-xl border border-gray-100 bg-background/50 px-3 py-2.5">
                      <p className="text-sm text-foreground">{event.message}</p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(event.createdAt).toLocaleString()} • {event.actor}
                      </p>
                    </article>
                  ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                  <Link href="/relay">Back to Agent dashboard</Link>
              </Button>
              <Button onClick={() => void load()} variant="ghost">
                Refresh updates
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Request not found.</p>
        )}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}
