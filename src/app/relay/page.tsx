"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  RefreshCcw,
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
  Sparkles,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RelayMetricsCards } from "@/components/relay/RelayMetricsCards";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchRelayCases } from "@/lib/relay-client";
import { RELAY_FEATURE_NAME } from "@/lib/relay-config";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import type { RelayCase, RelayCaseMetrics } from "@/types/relay";
import { services } from "@/data/services";

async function resolveUserId() {
  if (!hasSupabaseConfig) return "demo-user";
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id || "demo-user";
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
};

export default function RelayCasesPage() {
  const [relayRequests, setRelayRequests] = useState<RelayCase[]>([]);
  const [metrics, setMetrics] = useState<RelayCaseMetrics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCases = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await resolveUserId();
      const response = await fetchRelayCases(userId);
      setRelayRequests(response.cases);
      setMetrics(response.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Agent requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCases();
  }, []);

  const latestRequest = relayRequests[0];

  return (
    <AppShell title={RELAY_FEATURE_NAME}>
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/60 via-white to-white p-6 shadow-sm md:p-8"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Delegated assistance</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">{RELAY_FEATURE_NAME} dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Track requests GovFlow is helping you complete. We handle office follow-ups and notify
            you only when your in-person action is required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton href="/relay/passport">Start passport request</ActionButton>
            <Button variant="outline" size="sm" onClick={() => void loadCases()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.section>

        {metrics ? <RelayMetricsCards metrics={metrics} /> : null}

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Services supported by Agent</p>
              <p className="text-sm text-muted">
                Passport is active now. Other services are listed and will be enabled next.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Briefcase;
              const isPassport = service.id === "passport";
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + index * 0.03 }}
                >
                  <Card className={isPassport ? "border-primary/20" : "border-gray-100"}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-soft-blue text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        {isPassport ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                            Active now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-900">
                            <Lock className="h-3 w-3" />
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-foreground">{service.title}</p>
                      <p className="mt-1 text-xs text-muted">{service.agency}</p>
                      {isPassport ? (
                        <Button asChild size="sm" className="mt-3 w-full">
                          <Link href="/relay/passport">
                            Start now
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <p className="mt-3 text-xs text-muted">Agent support for this service is preparing.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted">Loading your requests...</p>
        ) : relayRequests.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {relayRequests.map((relayCase, index) => (
              <motion.article
                key={relayCase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted">Request ID</p>
                    <p className="font-mono text-sm text-foreground">{relayCase.id.slice(0, 8).toUpperCase()}</p>
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
                    Open request
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.article>
            ))}
          </div>
        ) : (
          <article className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-foreground">No requests yet</p>
            <p className="mt-2 text-sm text-muted">
              Start a passport request and GovFlow will handle non-presence steps for you.
            </p>
            <ActionButton href="/relay/passport" className="mt-4">
              Start passport request
            </ActionButton>
          </article>
        )}

        {latestRequest ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
            <p className="font-semibold">Presence alert policy</p>
            <p className="mt-1 leading-relaxed">
              When your in-person step is due, we send SMS to your saved number with the exact next
              action you must take.
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Alerts include step title and instructions.
            </p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
