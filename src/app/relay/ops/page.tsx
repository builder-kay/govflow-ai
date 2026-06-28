"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";

type OpsCase = {
  id: string;
  service_type: string;
  status: "intake_received" | "payment_pending" | "ops_triage" | "in_progress" | "awaiting_user" | "completed" | "cancelled";
  payment_status: string;
  intake_json?: { contact?: { fullName?: string; phone?: string } };
  assigned_coordinator: string | null;
  assigned_runner: string | null;
  created_at: string;
};

export default function RelayOpsPage() {
  const [secret, setSecret] = useState("");
  const [cases, setCases] = useState<OpsCase[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCases = async () => {
    if (!secret.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/relay/ops/cases", {
        headers: { "x-relay-ops-secret": secret.trim() },
      });
      const payload = (await response.json().catch(() => ({}))) as { cases?: OpsCase[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load ops queue.");
      setCases(payload.cases || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load ops queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!secret) return;
    void loadCases();
  }, []);

  const updateCase = async (caseId: string, payload: object) => {
    try {
      const response = await fetch(`/api/relay/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-relay-ops-secret": secret.trim(),
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not update case.");
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update case.");
    }
  };

  const sendPresenceAlert = async (caseId: string) => {
    try {
      const response = await fetch(`/api/relay/cases/${caseId}/send-presence-alert`, {
        method: "POST",
        headers: { "x-relay-ops-secret": secret.trim() },
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not send presence alert.");
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send presence alert.");
    }
  };

  return (
    <AppShell title="Relay Ops">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Operations queue</p>
          <p className="mt-1 text-sm text-muted">
            Internal tool for coordinators and runners. Requires `RELAY_OPS_SECRET`.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Enter ops secret"
              className="h-10 min-w-[240px] rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button onClick={() => void loadCases()} disabled={!secret.trim() || loading}>
              {loading ? "Loading..." : "Load queue"}
            </Button>
          </div>
          {error ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </section>

        <div className="space-y-3">
          {cases.map((item) => (
            <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {item.intake_json?.contact?.fullName || "Unknown user"} ({item.id.slice(0, 8)})
                  </p>
                  <p className="text-sm text-muted">
                    {item.service_type} • {item.intake_json?.contact?.phone || "No phone"} • Payment{" "}
                    {item.payment_status}
                  </p>
                </div>
                <RelayCaseStatusPill status={item.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void updateCase(item.id, {
                      status: "in_progress",
                      eventType: "ops_assigned",
                      eventMessage: "Coordinator started processing this case.",
                    })
                  }
                >
                  Start case
                </Button>
                <Button size="sm" variant="outline" onClick={() => void sendPresenceAlert(item.id)}>
                  Alert user (presence required)
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    void updateCase(item.id, {
                      status: "completed",
                      eventType: "case_completed",
                      eventMessage: "Ops marked case as completed.",
                    })
                  }
                >
                  Mark completed
                </Button>
              </div>
            </article>
          ))}
          {!cases.length ? (
            <p className="text-sm text-muted">No cases loaded yet.</p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
