"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, CreditCard, FileCheck2, Loader2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { createRelayCaseClient, initializeRelayPayment } from "@/lib/relay-client";
import { RELAY_DEFAULT_FEE_GHS, RELAY_FEATURE_NAME } from "@/lib/relay-config";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import type { RelayCaseRequest } from "@/types/relay";

async function resolveUser() {
  if (!hasSupabaseConfig) {
    return { id: "demo-user", email: "demo@govflow.app" };
  }
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return {
    id: data.user?.id || "demo-user",
    email: data.user?.email || "customer@relay.govflow.app",
  };
}

export default function PassportRelayIntakePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredRegion, setPreferredRegion] = useState("Accra");
  const [applicationType, setApplicationType] = useState<"first_time" | "renewal" | "replacement">(
    "first_time"
  );
  const [urgentTravelDate, setUrgentTravelDate] = useState("");
  const [hasGhanaCard, setHasGhanaCard] = useState(true);
  const [hasBirthCertificate, setHasBirthCertificate] = useState(true);
  const [needsPickupSupport, setNeedsPickupSupport] = useState(false);
  const [allowOfficeFollowups, setAllowOfficeFollowups] = useState(false);
  const [allowDocumentHandling, setAllowDocumentHandling] = useState(false);
  const [acceptedFeePolicy, setAcceptedFeePolicy] = useState(false);
  const [acceptedLegalNotice, setAcceptedLegalNotice] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      Boolean(
        fullName.trim() &&
          phone.trim() &&
          preferredRegion.trim() &&
          allowOfficeFollowups &&
          acceptedFeePolicy &&
          acceptedLegalNotice
      ),
    [fullName, phone, preferredRegion, allowOfficeFollowups, acceptedFeePolicy, acceptedLegalNotice]
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const user = await resolveUser();
      const request: RelayCaseRequest = {
        serviceType: "passport",
        contact: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        passportDetails: {
          applicationType,
          preferredRegion: preferredRegion.trim(),
          urgentTravelDate: urgentTravelDate || undefined,
          hasGhanaCard,
          hasBirthCertificate,
          needsPickupSupport,
        },
        consent: {
          allowOfficeFollowups,
          allowDocumentHandling,
          acceptedFeePolicy,
          acceptedLegalNotice,
        },
        notes: notes.trim() || undefined,
      };

      const relayCase = await createRelayCaseClient(user.id, request);
      const payment = await initializeRelayPayment(relayCase.id, email.trim() || user.email || undefined);

      if (payment.demoMode) {
        router.push(`/relay/${relayCase.id}`);
        return;
      }
      window.location.href = payment.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Relay case.");
      setSubmitting(false);
    }
  };

  return (
    <AppShell title={`${RELAY_FEATURE_NAME} Intake`}>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/50 to-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Passport pilot</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Hire {RELAY_FEATURE_NAME}</h1>
          <p className="mt-2 text-sm text-muted">
            Submit your details once. GovFlow handles non-presence tasks, then alerts you when your
            physical attendance is required.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              Fee: GHS {RELAY_DEFAULT_FEE_GHS}
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <CalendarClock className="h-3.5 w-3.5 text-primary" />
              Typical SLA: 72 hours first action
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Includes presence alerts
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-foreground">Contact details</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Full name"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone (e.g. 0241234567)"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email (optional)"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-foreground">Passport case details</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-muted">
              Application type
              <select
                value={applicationType}
                onChange={(event) => setApplicationType(event.target.value as typeof applicationType)}
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="first_time">First-time passport</option>
                <option value="renewal">Renewal</option>
                <option value="replacement">Replacement</option>
              </select>
            </label>
            <label className="text-sm text-muted">
              Preferred region
              <input
                value={preferredRegion}
                onChange={(event) => setPreferredRegion(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="text-sm text-muted md:col-span-2">
              Urgent travel date (optional)
              <input
                type="date"
                value={urgentTravelDate}
                onChange={(event) => setUrgentTravelDate(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={hasGhanaCard} onChange={(event) => setHasGhanaCard(event.target.checked)} />
              I have a Ghana Card
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={hasBirthCertificate}
                onChange={(event) => setHasBirthCertificate(event.target.checked)}
              />
              I have a birth certificate or equivalent support document
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={needsPickupSupport}
                onChange={(event) => setNeedsPickupSupport(event.target.checked)}
              />
              I may need extra support for collection follow-up
            </label>
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes for coordinator (optional)"
            rows={4}
            className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm md:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileCheck2 className="h-4 w-4 text-amber-700" />
            Consent and authorization
          </p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={allowOfficeFollowups}
                onChange={(event) => setAllowOfficeFollowups(event.target.checked)}
              />
              I authorize GovFlow coordinators and vetted field runners to handle follow-up visits.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={allowDocumentHandling}
                onChange={(event) => setAllowDocumentHandling(event.target.checked)}
              />
              I allow GovFlow to review and organize my uploaded documents for this case.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedFeePolicy}
                onChange={(event) => setAcceptedFeePolicy(event.target.checked)}
              />
              I understand the Relay fee excludes official government fees and third-party charges.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedLegalNotice}
                onChange={(event) => setAcceptedLegalNotice(event.target.checked)}
              />
              I accept Relay terms, cancellation policy, and responsibility boundaries.
            </label>
          </div>
        </section>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void handleSubmit()} disabled={!canSubmit || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Create case and pay</>
            )}
          </Button>
          <ActionButton href="/relay" variant="outline">
            Back to Relay dashboard
          </ActionButton>
        </div>
      </div>
    </AppShell>
  );
}
