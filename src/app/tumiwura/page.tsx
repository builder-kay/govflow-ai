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
  ShieldBan,
  Trash2,
  UserCog,
  Users,
  Wallet,
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
  fee_ghs?: number;
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
  lastSignInAt: string | null;
  bannedUntil: string | null;
  isBanned: boolean;
  latestRequestStatus: string | null;
  totalCases: number;
};

type AdminUserStatsPayload = {
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    fullName: string | null;
    createdAt: string | null;
    lastSignInAt: string | null;
    bannedUntil: string | null;
    isBanned: boolean;
    appMetadata: Record<string, unknown>;
  };
  stats: {
    totalCases: number;
    casesByStatus: Record<string, number>;
    openCases: number;
    completedCases: number;
    cancelledCases: number;
    latestCase: {
      id: string;
      status: string;
      payment_status: string;
      created_at: string;
      updated_at: string;
      service_type: string;
    } | null;
  };
};

type RelayServiceFee = {
  serviceType: "passport";
  feeGhs: number;
  source: "configured" | "default";
  updatedAt?: string | null;
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

type AdminTab = "requests" | "users" | "fees" | "sms" | "insights" | "reports";

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
  const [relayFees, setRelayFees] = useState<RelayServiceFee[]>([]);
  const [feeInputByService, setFeeInputByService] = useState<Record<string, string>>({});
  const [feeApplyOpenByService, setFeeApplyOpenByService] = useState<Record<string, boolean>>({});
  const [savingFeeForService, setSavingFeeForService] = useState<string | null>(null);
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [selectedUserStats, setSelectedUserStats] = useState<AdminUserStatsPayload | null>(null);
  const [loadingSelectedUserStats, setLoadingSelectedUserStats] = useState(false);
  const [actingOnUserId, setActingOnUserId] = useState<string | null>(null);
  const [smsMode, setSmsMode] = useState<
    | "single_user"
    | "all_users"
    | "selected_users"
    | "processing_orders"
    | "in_person_action_needed"
    | "cancelled_cases"
    | "pending_admin_review"
    | "awaiting_payment"
    | "completed_cases"
    | "active_requests"
  >("selected_users");
  const [smsSingleUserPhone, setSmsSingleUserPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [previewingSms, setPreviewingSms] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState("");
  const [smsPreviewResult, setSmsPreviewResult] = useState("");
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

  const loadRelayFees = async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/relay-fees");
      const payload = (await response.json().catch(() => ({}))) as {
        fees?: RelayServiceFee[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Could not load agent fees.");
      const fees = payload.fees || [];
      setRelayFees(fees);
      setFeeInputByService((current) => {
        const next = { ...current };
        for (const fee of fees) {
          if (!next[fee.serviceType]) {
            next[fee.serviceType] = String(fee.feeGhs);
          }
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load agent fees.");
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
        await Promise.all([loadCases(), loadUsers(), loadInsights(), loadReports(), loadRelayFees()]);
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
      await Promise.all([loadCases(), loadUsers(), loadInsights(), loadReports(), loadRelayFees()]);
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
    setRelayFees([]);
    setSelectedPhones([]);
    setSelectedUserStats(null);
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

  const loadUserStats = async (userId: string) => {
    setLoadingSelectedUserStats(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const payload = (await response.json().catch(() => ({}))) as AdminUserStatsPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load account stats.");
      setSelectedUserStats(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load account stats.");
    } finally {
      setLoadingSelectedUserStats(false);
    }
  };

  const banUser = async (userId: string) => {
    setActingOnUserId(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ban", banDuration: "876000h", reason: "Banned by admin." }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not ban account.");
      await loadUsers();
      if (selectedUserStats?.user.id === userId) {
        await loadUserStats(userId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not ban account.");
    } finally {
      setActingOnUserId(null);
    }
  };

  const unbanUser = async (userId: string) => {
    setActingOnUserId(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unban" }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not unban account.");
      await loadUsers();
      if (selectedUserStats?.user.id === userId) {
        await loadUserStats(userId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unban account.");
    } finally {
      setActingOnUserId(null);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    if (!window.confirm("Delete this user account permanently? This cannot be undone.")) {
      return;
    }
    setActingOnUserId(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not delete account.");
      if (selectedUserStats?.user.id === userId) {
        setSelectedUserStats(null);
      }
      await Promise.all([loadUsers(), loadInsights(), loadCases()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account.");
    } finally {
      setActingOnUserId(null);
    }
  };

  const saveServiceFee = async (serviceType: RelayServiceFee["serviceType"]) => {
    const feeRaw = feeInputByService[serviceType];
    const feeGhs = Number(feeRaw);
    if (!Number.isFinite(feeGhs) || feeGhs <= 0) {
      setError("Enter a valid positive fee amount.");
      return;
    }

    setSavingFeeForService(serviceType);
    setError("");
    try {
      const response = await fetch("/api/admin/relay-fees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          feeGhs,
          applyToOpenCases: Boolean(feeApplyOpenByService[serviceType]),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; affectedOpenCases?: number };
      if (!response.ok) throw new Error(payload.error || "Could not update service fee.");
      await Promise.all([loadRelayFees(), loadCases()]);
      setFeeApplyOpenByService((current) => ({ ...current, [serviceType]: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update service fee.");
    } finally {
      setSavingFeeForService(null);
    }
  };

  const sendSms = async () => {
    setSendingSms(true);
    setSmsResult("");
    setError("");
    try {
      const payload =
        smsMode === "single_user"
          ? { mode: "single_user", phone: smsSingleUserPhone, message: smsMessage }
          : smsMode === "selected_users"
            ? { mode: "selected_users", phones: selectedPhones, message: smsMessage }
            : { mode: smsMode, message: smsMessage };

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

  const previewSmsRecipients = async () => {
    setPreviewingSms(true);
    setSmsPreviewResult("");
    setError("");
    try {
      const payload =
        smsMode === "single_user"
          ? { mode: "single_user", phone: smsSingleUserPhone, preview: true }
          : smsMode === "selected_users"
            ? { mode: "selected_users", phones: selectedPhones, preview: true }
            : { mode: smsMode, preview: true };

      const response = await fetch("/api/admin/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        previewCount?: number;
        attempted?: number;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "Could not preview recipients.");
      setSmsPreviewResult(`Recipient preview: ${data.previewCount ?? data.attempted ?? 0} users`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not preview recipients.");
    } finally {
      setPreviewingSms(false);
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
  const phoneUsers = users.filter((user): user is AdminUser & { phone: string } => Boolean(user.phone));
  const hasSmsRecipients =
    (smsMode === "single_user" && Boolean(smsSingleUserPhone)) ||
    (smsMode === "selected_users" && selectedPhones.length > 0) ||
    !["single_user", "selected_users"].includes(smsMode);

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
                  { id: "fees", label: "Agent fees", icon: Wallet },
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
                          {item.service_type} • {item.intake_json?.contact?.phone || "No phone"} • Fee GHS{" "}
                          {Number(item.fee_ghs || 0).toFixed(2)} • Payment {item.payment_status}
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
                {selectedUserStats ? (
                  <article className={`${neoTile} mb-3 p-3`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          Account stats:{" "}
                          {selectedUserStats.user.fullName ||
                            selectedUserStats.user.email ||
                            selectedUserStats.user.phone ||
                            selectedUserStats.user.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted">
                          Open: {selectedUserStats.stats.openCases} • Completed:{" "}
                          {selectedUserStats.stats.completedCases} • Cancelled:{" "}
                          {selectedUserStats.stats.cancelledCases} • Total cases:{" "}
                          {selectedUserStats.stats.totalCases}
                        </p>
                        {selectedUserStats.stats.latestCase ? (
                          <p className="mt-1 text-xs text-muted">
                            Latest case: {selectedUserStats.stats.latestCase.service_type} •{" "}
                            {selectedUserStats.stats.latestCase.status} •{" "}
                            {new Date(selectedUserStats.stats.latestCase.created_at).toLocaleString()}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-muted">No cases yet for this account.</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUserStats(null)}>
                        Close stats
                      </Button>
                    </div>
                  </article>
                ) : null}
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
                            {user.latestRequestStatus || "n/a"} • Cases: {user.totalCases}
                          </p>
                          <p className="mt-1 text-[11px] text-muted">
                            Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "n/a"} • Last sign in:{" "}
                            {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "n/a"}
                          </p>
                          <p
                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              user.isBanned
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {user.isBanned ? "Banned account" : "Active account"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingSelectedUserStats}
                            onClick={() => void loadUserStats(user.id)}
                          >
                            <UserCog className="h-4 w-4" />
                            Stats
                          </Button>
                          {user.isBanned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actingOnUserId === user.id}
                              onClick={() => void unbanUser(user.id)}
                            >
                              {actingOnUserId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                              Unban
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actingOnUserId === user.id}
                              onClick={() => void banUser(user.id)}
                            >
                              {actingOnUserId === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ShieldBan className="h-4 w-4" />
                              )}
                              Ban
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            disabled={actingOnUserId === user.id}
                            onClick={() => void deleteUserAccount(user.id)}
                          >
                            {actingOnUserId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                          {user.phone ? (
                            <label className="inline-flex items-center gap-2 rounded-lg border border-white/80 bg-white/70 px-2 py-1 text-xs text-muted">
                              <input
                                type="checkbox"
                                checked={selectedPhones.includes(user.phone)}
                                onChange={() => togglePhoneSelection(user.phone as string)}
                              />
                              Select SMS
                            </label>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "fees" ? (
              <section className={`${glassCard} p-5`}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">Agent service fees</p>
                  <Button variant="outline" size="sm" onClick={() => void loadRelayFees()}>
                    Refresh fees
                  </Button>
                </div>
                <div className="space-y-2.5">
                  {relayFees.map((fee) => (
                    <article key={fee.serviceType} className={`${neoTile} p-3`}>
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {fee.serviceType.replace("-", " ")}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Current fee: GHS {Number(fee.feeGhs).toFixed(2)} • Source: {fee.source}
                        {fee.updatedAt ? ` • Updated: ${new Date(fee.updatedAt).toLocaleString()}` : ""}
                      </p>
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <label className="text-xs text-muted md:col-span-1">
                          New fee (GHS)
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={feeInputByService[fee.serviceType] || ""}
                            onChange={(event) =>
                              setFeeInputByService((current) => ({
                                ...current,
                                [fee.serviceType]: event.target.value,
                              }))
                            }
                            className={`mt-1 h-10 w-full rounded-xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                          />
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs text-muted md:col-span-1">
                          <input
                            type="checkbox"
                            checked={Boolean(feeApplyOpenByService[fee.serviceType])}
                            onChange={(event) =>
                              setFeeApplyOpenByService((current) => ({
                                ...current,
                                [fee.serviceType]: event.target.checked,
                              }))
                            }
                          />
                          Apply to open unpaid/pending requests
                        </label>
                        <div className="md:col-span-1">
                          <Button
                            className="w-full"
                            onClick={() => void saveServiceFee(fee.serviceType)}
                            disabled={savingFeeForService === fee.serviceType}
                          >
                            {savingFeeForService === fee.serviceType ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save fee"
                            )}
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {!relayFees.length ? <p className="text-sm text-muted">No Agent services configured yet.</p> : null}
                </div>
              </section>
            ) : null}

            {activeTab === "sms" ? (
              <section className={`${glassCard} p-5`}>
                <p className="text-sm font-semibold text-foreground">
                  SMS broadcast (Clifze primary, Arkesel backup)
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="text-sm text-muted">
                    Recipient segment
                    <select
                      value={smsMode}
                      onChange={(event) =>
                        setSmsMode(
                          event.target.value as
                            | "single_user"
                            | "all_users"
                            | "selected_users"
                            | "processing_orders"
                            | "in_person_action_needed"
                            | "cancelled_cases"
                            | "pending_admin_review"
                            | "awaiting_payment"
                            | "completed_cases"
                            | "active_requests"
                        )
                      }
                      className={`mt-1 h-11 w-full rounded-2xl px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                    >
                      <option value="single_user">1) Single user</option>
                      <option value="all_users">2) All users on platform</option>
                      <option value="selected_users">3) Certain users (checkbox selection)</option>
                      <option value="processing_orders">4) Users with processing order</option>
                      <option value="in_person_action_needed">5) Users needing in-person action</option>
                      <option value="cancelled_cases">6) Cancelled cases users</option>
                      <option value="pending_admin_review">7) Intake pending admin review</option>
                      <option value="awaiting_payment">8) Awaiting payment</option>
                      <option value="completed_cases">9) Completed cases users</option>
                      <option value="active_requests">10) All active (not completed/cancelled)</option>
                    </select>
                  </label>
                  {smsMode === "single_user" ? (
                    <label className="text-sm text-muted md:col-span-2">
                      Select user
                      <select
                        value={smsSingleUserPhone}
                        onChange={(event) => setSmsSingleUserPhone(event.target.value)}
                        className={`mt-1 h-11 w-full rounded-2xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${neoInput}`}
                      >
                        <option value="">Choose a user...</option>
                        {phoneUsers.map((user) => (
                          <option key={`${user.id}-${user.phone}`} value={user.phone}>
                            {(user.fullName || user.email || user.id.slice(0, 8))} - {user.phone}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <div className={`${neoTile} md:col-span-2 px-3 py-2 text-xs text-muted`}>
                      {smsMode === "selected_users"
                        ? `Selected recipients: ${selectedPhones.length} (from checkbox list below)`
                        : smsMode === "all_users"
                          ? "Targets all known platform users with phone numbers."
                          : smsMode === "processing_orders"
                            ? "Targets users with processing orders (payment pending/ops triage/in progress/awaiting user)."
                            : smsMode === "in_person_action_needed"
                              ? "Targets users with pending in-person steps."
                              : smsMode === "cancelled_cases"
                                ? "Targets users whose requests were cancelled."
                                : smsMode === "pending_admin_review"
                                  ? "Targets users whose intake is still pending review."
                                  : smsMode === "awaiting_payment"
                                    ? "Targets users awaiting secure payment."
                                    : smsMode === "completed_cases"
                                      ? "Targets users with completed requests."
                                      : "Targets all users with active (not completed/cancelled) requests."}
                    </div>
                  )}
                </div>
                {smsMode === "selected_users" ? (
                  <div className={`${neoTile} mt-3 p-3`}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground">
                        Select users by checkbox ({selectedPhones.length} selected)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPhones(phoneUsers.map((user) => user.phone))}
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPhones([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-52 space-y-1 overflow-auto">
                      {phoneUsers.map((user) => (
                        <label
                          key={`${user.id}-${user.phone}`}
                          className="inline-flex w-full items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-2.5 py-2 text-xs text-muted"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPhones.includes(user.phone)}
                            onChange={() => togglePhoneSelection(user.phone)}
                          />
                          <span className="font-medium text-foreground">
                            {user.fullName || user.email || user.id.slice(0, 8)}
                          </span>
                          <span>({user.phone})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
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
                  <Button
                    onClick={() => void previewSmsRecipients()}
                    variant="outline"
                    disabled={previewingSms || !hasSmsRecipients}
                  >
                    {previewingSms ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Previewing...
                      </>
                    ) : (
                      "Recipient preview count"
                    )}
                  </Button>
                  <Button
                    onClick={() => void sendSms()}
                    disabled={
                      sendingSms ||
                      !smsMessage.trim() ||
                      !hasSmsRecipients
                    }
                  >
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
                  {smsPreviewResult ? <p className="text-sm text-primary">{smsPreviewResult}</p> : null}
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
