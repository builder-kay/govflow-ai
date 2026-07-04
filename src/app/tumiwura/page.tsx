"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { RelayCaseStatusPill } from "@/components/relay/RelayCaseStatusPill";

type OpsCase = {
  id: string;
  service_type: string;
  status:
    | "intake_received"
    | "payment_pending"
    | "ops_triage"
    | "in_progress"
    | "awaiting_user"
    | "completed"
    | "cancelled";
  payment_status: string;
  intake_json?: { contact?: { fullName?: string; phone?: string } };
  assigned_coordinator: string | null;
  assigned_runner: string | null;
  created_at: string;
};

export default function TumiwuraAdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [cases, setCases] = useState<OpsCase[]>([]);
  const [error, setError] = useState("");
  const [loadingCases, setLoadingCases] = useState(false);

  const loadCases = async () => {
    setLoadingCases(true);
    setError("");
    try {
      const response = await fetch("/api/relay/ops/cases");
      const payload = (await response.json().catch(() => ({}))) as {
        cases?: OpsCase[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Could not load admin queue.");
      setCases(payload.cases || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin queue.");
    } finally {
      setLoadingCases(false);
    }
  };

  const checkSession = async () => {
    setCheckingAuth(true);
    try {
      const response = await fetch("/api/admin/auth/session");
      const payload = (await response.json().catch(() => ({}))) as { authenticated?: boolean };
      const isAuthed = Boolean(payload.authenticated);
      setAuthenticated(isAuthed);
      if (isAuthed) {
        await loadCases();
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoggingIn(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Sign-in failed.");
      setAuthenticated(true);
      setPassword("");
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => null);
    setAuthenticated(false);
    setCases([]);
    setError("");
  };

  const updateCase = async (caseId: string, payload: object) => {
    setError("");
    try {
      const response = await fetch(`/api/relay/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not update request.");
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update request.");
    }
  };

  const sendPresenceAlert = async (caseId: string) => {
    setError("");
    try {
      const response = await fetch(`/api/relay/cases/${caseId}/send-presence-alert`, {
        method: "POST",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not send user alert.");
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send user alert.");
    }
  };

  return (
    <AppShell title="Admin Portal" showNav={false} showChat={false} showFooter={false} requireAuth={false}>
      <div className="mx-auto max-w-5xl space-y-5 py-6">
        {checkingAuth ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking admin session...
            </p>
          </div>
        ) : !authenticated ? (
          <section className="mx-auto max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-4 w-4" />
              Tumiwura Admin Sign-in
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground">Restricted access</h1>
            <p className="mt-1 text-sm text-muted">
              Enter admin password to continue to the operations dashboard.
            </p>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleLogin();
              }}
              placeholder="Admin password"
              className="mt-4 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button className="mt-3 w-full" onClick={() => void handleLogin()} disabled={loggingIn || !password.trim()}>
              {loggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            {error ? (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Tumiwura operations queue</p>
                  <p className="mt-1 text-sm text-muted">
                    Review intake, approve payment, log WhatsApp agreements, and manage request actions.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => void loadCases()} disabled={loadingCases}>
                    {loadingCases ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button variant="ghost" onClick={() => void handleLogout()}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
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
                          status: "payment_pending",
                          eventType: "ops_assigned",
                          eventMessage:
                            "Admin approved intake. User instructed to confirm details on WhatsApp and pay securely.",
                        })
                      }
                    >
                      Approve intake
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void updateCase(item.id, {
                          eventType: "note",
                          eventMessage: "WhatsApp coordination completed. Awaiting secure payment from user.",
                        })
                      }
                    >
                      Log WhatsApp agreement
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void sendPresenceAlert(item.id)}>
                      Send user action alert
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void updateCase(item.id, {
                          status: "in_progress",
                          eventType: "step_updated",
                          eventMessage: "Ops moved request into active processing.",
                        })
                      }
                    >
                      Start processing
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
              {!cases.length && !loadingCases ? <p className="text-sm text-muted">No requests loaded yet.</p> : null}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
