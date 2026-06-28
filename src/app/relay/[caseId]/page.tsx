"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { BellRing, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RelayCaseTimeline } from "@/components/relay/RelayCaseTimeline";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";
import { Button } from "@/components/ui/button";
import { completePresenceStep, fetchRelayCase } from "@/lib/relay-client";
import { RELAY_FEATURE_NAME } from "@/lib/relay-config";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import type { RelayCase } from "@/types/relay";

async function resolveUserId() {
  if (!hasSupabaseConfig) return "demo-user";
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id || "demo-user";
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

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await fetchRelayCase(caseId);
      setRelayCase(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Agent case.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [caseId]);

  const nextUserStep = useMemo(
    () => relayCase?.steps.find((step) => step.assignee === "user" && step.status !== "completed"),
    [relayCase]
  );

  const handlePresenceComplete = async () => {
    if (!relayCase) return;
    setMarkingComplete(true);
    setError("");
    try {
      const userId = await resolveUserId();
      const updated = await completePresenceStep(relayCase.id, userId);
      setRelayCase(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mark step complete.");
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <AppShell title="Agent case">
      <div className="mx-auto max-w-4xl space-y-6">
        {loading ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading case timeline...
          </p>
        ) : relayCase ? (
          <>
            <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/50 to-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">{RELAY_FEATURE_NAME}</p>
                  <h1 className="mt-1 text-2xl font-bold text-foreground">Passport case timeline</h1>
                  <p className="mt-1 text-sm text-muted">
                    Case {relayCase.id.slice(0, 8)} • Created{" "}
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
          <p className="text-sm text-muted">Case not found.</p>
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
