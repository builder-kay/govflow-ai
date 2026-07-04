"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Loader2,
  LogOut,
  MessageSquareText,
  Send,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
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

type AdminUser = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  createdAt: string | null;
  latestRequestStatus: string | null;
};

type InsightPayload = {
  overview: {
    totalUsers: number;
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    unresolvedReports: number;
    totalPageVisits: number;
  } | null;
  growth: {
    users: Array<[string, number]>;
    requests: Array<[string, number]>;
  };
  topPages: Array<{ pathname: string; visits: number }>;
  topFlows: Array<{ flow: string; visits: number }>;
};

type ReportItem = {
  id: string;
  category: string;
  title: string;
  details: string;
  status: "open" | "investigating" | "resolved";
  page_path: string | null;
  contact_email: string | null;
  admin_note: string | null;
  created_at: string;
};

type AdminTab = "requests" | "users" | "sms" | "insights" | "reports";

export default function TumiwuraAdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminName, setAdminName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("requests");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [cases, setCases] = useState<OpsCase[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [insights, setInsights] = useState<InsightPayload | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [smsMode, setSmsMode] = useState<"single" | "selected" | "all">("selected");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [sendingSms, setSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState("");
  const [error, setError] = useState("");
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  const glassCard =
    "rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[12px_12px_28px_rgba(15,23,42,0.12),-12px_-12px_28px_rgba(255,255,255,0.8)]";
  const neoTile =
    "rounded-2xl border border-white/70 bg-white/70 shadow-[8px_8px_18px_rgba(15,23,42,0.09),-8px_-8px_18px_rgba(255,255,255,0.8)]";
  const neoInput =
    "border border-white/70 bg-white/75 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.95)]";

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

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users");
      const payload = (await response.json().catch(() => ({}))) as {
        users?: AdminUser[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Could not load users.");
      setUsers(payload.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadInsights = async () => {
    setLoadingInsights(true);
    setError("");
    try {
      const response = await fetch("/api/admin/insights");
      const payload = (await response.json().catch(() => ({}))) as InsightPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load insights.");
      setInsights(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reports");
      const payload = (await response.json().catch(() => ({}))) as {
        reports?: ReportItem[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Could not load reports.");
      setReports(payload.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load reports.");
    } finally {
      setLoadingReports(false);
    }
  };

  const checkSession = async () => {
    setCheckingAuth(true);
    try {
      const response = await fetch("/api/admin/auth/session");
      const payload = (await response.json().catch(() => ({}))) as {
        authenticated?: boolean;
        admin?: { username?: string; displayName?: string | null } | null;
      };
      const isAuthed = Boolean(payload.authenticated);
      setAuthenticated(isAuthed);
      setAdminName(payload.admin?.displayName || payload.admin?.username || null);
      if (isAuthed) {
        await Promise.all([loadCases(), loadUsers(), loadInsights(), loadReports()]);
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoggingIn(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Sign-in failed.");
      setAuthenticated(true);
      setAdminName(username.trim());
      setUsername("");
      setPassword("");
      await Promise.all([loadCases(), loadUsers(), loadInsights(), loadReports()]);
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
    setUsers([]);
    setReports([]);
    setInsights(null);
    setSelectedPhones([]);
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

  const declineRequest = async (caseId: string) => {
    await updateCase(caseId, {
      status: "cancelled",
      eventType: "note",
      eventMessage: "Admin declined this request after review.",
    });
  };

  const updateReportStatus = async (reportId: string, status: "open" | "investigating" | "resolved") => {
    setError("");
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not update report.");
      await loadReports();
      await loadInsights();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update report.");
    }
  };

  const sendSms = async () => {
    setSendingSms(true);
    setSmsResult("");
    setError("");
    try {
      const payload =
        smsMode === "single"
          ? { mode: "single", phone: smsPhone, message: smsMessage }
          : smsMode === "all"
            ? { mode: "all", message: smsMessage }
            : { mode: "selected", phones: selectedPhones, message: smsMessage };

      const response = await fetch("/api/admin/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        sent?: number;
        attempted?: number;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "Could not send SMS.");
      setSmsResult(`SMS sent: ${data.sent ?? 0}/${data.attempted ?? 0}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send SMS.");
    } finally {
      setSendingSms(false);
    }
  };

  const togglePhoneSelection = (phone: string) => {
    setSelectedPhones((current) =>
      current.includes(phone) ? current.filter((item) => item !== phone) : [...current, phone]
    );
  };

  const maxGrowthValue = Math.max(
    1,
    ...(insights?.growth.users.map(([, val]) => val) || []),
    ...(insights?.growth.requests.map(([, val]) => val) || [])
  );

  return (
    <AppShell
      title="Admin Portal"
      showNav={false}
      showChat={false}
      showFooter={false}
      requireAuth={false}
    >
      <div className="relative mx-auto max-w-6xl space-y-5 py-6">
        <div aria-hidden className="pointer-events-none absolute -left-10 top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-6 top-56 h-52 w-52 rounded-full bg-soft-blue/75 blur-3xl" />
        {checkingAuth ? (
          <div className={`${glassCard} p-8 text-center`}>
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking admin session...
            </p>
          </div>
        ) : !authenticated ? (
          <section className={`${glassCard} mx-auto max-w-md p-6`}>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-4 w-4" />
              Tumiwura Admin Sign-in
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground">Restricted access</h1>
            <p className="mt-1 text-sm text-muted">
              Enter admin username and password to continue to the operations dashboard.
            </p>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Admin username"
              className={`mt-4 h-11 w-full rounded-2xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleLogin();
              }}
              placeholder="Admin password"
              className={`mt-3 h-11 w-full rounded-2xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
            />
            <Button
              className="mt-3 w-full"
              onClick={() => void handleLogin()}
              disabled={loggingIn || !username.trim() || !password.trim()}
            >
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
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </section>
        ) : (
          <>
            <section className={`${glassCard} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Tumiwura operations queue</p>
                  <p className="mt-1 text-sm text-muted">
                    Review intake, approve payment, log WhatsApp agreements, and manage request actions.
                  </p>
                  {adminName ? <p className="mt-1 text-xs text-muted">Signed in as {adminName}</p> : null}
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
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { id: "requests", label: "Requests", icon: CheckCircle2 },
                  { id: "users", label: "Users", icon: Users },
                  { id: "sms", label: "SMS", icon: Send },
                  { id: "insights", label: "Insights", icon: BarChart3 },
                  { id: "reports", label: "Reported problems", icon: AlertTriangle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${neoTile} ${
                        active ? "text-primary ring-2 ring-primary/30" : "text-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {activeTab === "requests" ? (
              <div className="space-y-3">
                {cases.map((item) => (
                  <article key={item.id} className={`${glassCard} p-4`}>
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
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void declineRequest(item.id)}>
                        <XCircle className="h-4 w-4" />
                        Decline
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
                        Send user alert
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
                {!cases.length && !loadingCases ? (
                  <p className="text-sm text-muted">No requests loaded yet.</p>
                ) : null}
              </div>
            ) : null}

            {activeTab === "users" ? (
              <section className={`${glassCard} p-5`}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">All users ({users.length})</p>
                  <Button variant="outline" size="sm" onClick={() => void loadUsers()} disabled={loadingUsers}>
                    {loadingUsers ? "Refreshing..." : "Refresh users"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {users.map((user) => (
                    <article key={user.id} className={`${neoTile} px-3 py-2.5`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.fullName || user.email || user.phone || user.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted">
                            {user.email || "No email"} • {user.phone || "No phone"} • Latest request:{" "}
                            {user.latestRequestStatus || "n/a"}
                          </p>
                        </div>
                        {user.phone ? (
                          <label className="inline-flex items-center gap-2 text-xs text-muted">
                            <input
                              type="checkbox"
                              checked={selectedPhones.includes(user.phone)}
                              onChange={() => togglePhoneSelection(user.phone as string)}
                            />
                            Select for SMS
                          </label>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "sms" ? (
              <section className={`${glassCard} p-5`}>
                <p className="text-sm font-semibold text-foreground">SMS broadcast (Clifze)</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="text-sm text-muted">
                    Send mode
                    <select
                      value={smsMode}
                      onChange={(event) => setSmsMode(event.target.value as "single" | "selected" | "all")}
                      className={`mt-1 h-11 w-full rounded-2xl px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                    >
                      <option value="selected">Selected users</option>
                      <option value="single">Single number</option>
                      <option value="all">All users (from requests)</option>
                    </select>
                  </label>
                  {smsMode === "single" ? (
                    <label className="text-sm text-muted md:col-span-2">
                      Recipient phone
                      <input
                        value={smsPhone}
                        onChange={(event) => setSmsPhone(event.target.value)}
                        placeholder="e.g. 0241234567"
                        className={`mt-1 h-11 w-full rounded-2xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                      />
                    </label>
                  ) : (
                    <div className={`${neoTile} md:col-span-2 px-3 py-2 text-xs text-muted`}>
                      {smsMode === "selected"
                        ? `Selected recipients: ${selectedPhones.length}`
                        : "All known user phones from submitted requests will be targeted."}
                    </div>
                  )}
                </div>
                <label className="mt-3 block text-sm text-muted">
                  Message
                  <textarea
                    value={smsMessage}
                    onChange={(event) => setSmsMessage(event.target.value)}
                    rows={4}
                    placeholder="Type the SMS you want to send..."
                    className={`mt-1 w-full rounded-2xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                  />
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button onClick={() => void sendSms()} disabled={sendingSms || !smsMessage.trim()}>
                    {sendingSms ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send SMS
                      </>
                    )}
                  </Button>
                  {smsResult ? <p className="text-sm text-emerald-700">{smsResult}</p> : null}
                </div>
              </section>
            ) : null}

            {activeTab === "insights" ? (
              <section className="space-y-3">
                <div className={`${glassCard} p-5`}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">Platform statistics & growth</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void loadInsights()}
                      disabled={loadingInsights}
                    >
                      {loadingInsights ? "Refreshing..." : "Refresh insights"}
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: "Total users", value: insights?.overview?.totalUsers ?? 0 },
                      { label: "Total requests", value: insights?.overview?.totalRequests ?? 0 },
                      { label: "Completed requests", value: insights?.overview?.completedRequests ?? 0 },
                      { label: "Pending requests", value: insights?.overview?.pendingRequests ?? 0 },
                      { label: "Unresolved reports", value: insights?.overview?.unresolvedReports ?? 0 },
                      { label: "Tracked page visits", value: insights?.overview?.totalPageVisits ?? 0 },
                    ].map((card) => (
                      <article key={card.label} className={`${neoTile} p-3`}>
                        <p className="text-xs text-muted">{card.label}</p>
                        <p className="mt-1 text-xl font-bold text-foreground">{card.value}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className={`${glassCard} p-5`}>
                  <p className="mb-3 text-sm font-semibold text-foreground">Growth trend (monthly)</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${neoTile} p-3`}>
                      <p className="mb-2 text-xs font-semibold text-muted">User growth</p>
                      <div className="space-y-2">
                        {(insights?.growth.users || []).map(([month, value]) => (
                          <div key={`u-${month}`}>
                            <p className="text-xs text-muted">{month}</p>
                            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.max(6, (value / maxGrowthValue) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`${neoTile} p-3`}>
                      <p className="mb-2 text-xs font-semibold text-muted">Request growth</p>
                      <div className="space-y-2">
                        {(insights?.growth.requests || []).map(([month, value]) => (
                          <div key={`r-${month}`}>
                            <p className="text-xs text-muted">{month}</p>
                            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${Math.max(6, (value / maxGrowthValue) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${glassCard} p-5`}>
                  <p className="mb-3 text-sm font-semibold text-foreground">Most visited pages and flows</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className={`${neoTile} p-3`}>
                      <p className="mb-2 text-xs font-semibold text-muted">Top pages</p>
                      <div className="space-y-1.5">
                        {(insights?.topPages || []).map((item) => (
                          <p key={item.pathname} className="text-xs text-muted">
                            <span className="font-medium text-foreground">{item.pathname}</span> - {item.visits}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className={`${neoTile} p-3`}>
                      <p className="mb-2 text-xs font-semibold text-muted">Top flows</p>
                      <div className="space-y-1.5">
                        {(insights?.topFlows || []).map((item) => (
                          <p key={item.flow} className="text-xs text-muted">
                            <span className="font-medium text-foreground">{item.flow}</span> - {item.visits}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === "reports" ? (
              <section className={`${glassCard} p-5`}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">Reported problems</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void loadReports()}
                    disabled={loadingReports}
                  >
                    {loadingReports ? "Refreshing..." : "Refresh reports"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {reports.map((report) => (
                    <article key={report.id} className={`${neoTile} p-3`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{report.title}</p>
                          <p className="text-xs text-muted">
                            {report.category} • {new Date(report.created_at).toLocaleString()} • {report.page_path || "n/a"}
                          </p>
                          <p className="mt-1 text-sm text-muted">{report.details}</p>
                        </div>
                        <span className="rounded-full bg-soft-blue px-2 py-1 text-[11px] font-semibold text-primary-dark">
                          {report.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void updateReportStatus(report.id, "investigating")}
                        >
                          <MessageSquareText className="h-4 w-4" />
                          Investigating
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void updateReportStatus(report.id, "resolved")}
                        >
                          Resolve
                        </Button>
                      </div>
                    </article>
                  ))}
                  {!reports.length && !loadingReports ? (
                    <p className="text-sm text-muted">No reported problems found.</p>
                  ) : null}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
