"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RelayMetricsCards } from "@/components/relay/RelayMetricsCards";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { fetchRelayCases } from "@/lib/relay-client";
import { RELAY_FEATURE_NAME } from "@/lib/relay-config";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import type { RelayCase, RelayCaseMetrics } from "@/types/relay";

async function resolveUserId() {
  if (!hasSupabaseConfig) return "demo-user";
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id || "demo-user";
}

export default function RelayCasesPage() {
  const [relayCases, setRelayCases] = useState<RelayCase[]>([]);
  const [metrics, setMetrics] = useState<RelayCaseMetrics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCases = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await resolveUserId();
      const response = await fetchRelayCases(userId);
      setRelayCases(response.cases);
      setMetrics(response.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Relay cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCases();
  }, []);

  const latestCase = useMemo(() => relayCases[0], [relayCases]);

  return (
    <AppShell title={RELAY_FEATURE_NAME}>
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/50 to-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Delegated assistance</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">{RELAY_FEATURE_NAME} cases</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Track the passport cases GovFlow is handling for you. We notify you only when your
            in-person action is needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton href="/relay/passport">Start new passport Relay case</ActionButton>
            <Button variant="outline" size="sm" onClick={() => void loadCases()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.section>

        {metrics ? <RelayMetricsCards metrics={metrics} /> : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted">Loading Relay cases...</p>
        ) : relayCases.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {relayCases.map((relayCase) => (
              <article
                key={relayCase.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted">Case ID</p>
                    <p className="font-mono text-sm text-foreground">{relayCase.id.slice(0, 8)}</p>
                  </div>
                  <RelayCaseStatusPill status={relayCase.status} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  Passport • Fee GHS {relayCase.feeGhs} • Created{" "}
                  {new Date(relayCase.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {relayCase.events[relayCase.events.length - 1]?.message ||
                    "Waiting for first operations update."}
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href={`/relay/${relayCase.id}`}>
                    Open timeline
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <article className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-foreground">No Relay cases yet</p>
            <p className="mt-2 text-sm text-muted">
              Start a passport Relay case and GovFlow will handle non-presence steps for you.
            </p>
            <ActionButton href="/relay/passport" className="mt-4">
              Start passport Relay intake
            </ActionButton>
          </article>
        )}

        {latestCase ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
            <p className="font-semibold">Presence alert policy</p>
            <p className="mt-1">
              GovFlow only asks you to attend mandatory steps like biometric capture and collection.
              You will receive SMS alerts before those windows.
            </p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
