"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Loader2,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { createRelayCaseClient } from "@/lib/relay-client";
import {
  RELAY_DEFAULT_FEE_GHS,
  RELAY_FEATURE_NAME,
  RELAY_REQUIRED_PASSPORT_DOCUMENTS,
} from "@/lib/relay-config";
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
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [preferredContactChannel, setPreferredContactChannel] = useState<"phone" | "whatsapp" | "either">(
    "either"
  );

  const [preferredRegion, setPreferredRegion] = useState("Accra");
  const [applicationType, setApplicationType] = useState<"first_time" | "renewal" | "replacement">(
    "first_time"
  );
  const [preferredAppointmentWindow, setPreferredAppointmentWindow] = useState<
    "morning" | "afternoon" | "anytime"
  >("anytime");
  const [urgentTravelDate, setUrgentTravelDate] = useState("");
  const [reasonForTravel, setReasonForTravel] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [nationality, setNationality] = useState("Ghanaian");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [birthCertificateNumber, setBirthCertificateNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [previousPassportNumber, setPreviousPassportNumber] = useState("");
  const [hasGhanaCard, setHasGhanaCard] = useState(true);
  const [hasBirthCertificate, setHasBirthCertificate] = useState(true);
  const [hasPassportPhotos, setHasPassportPhotos] = useState(false);
  const [hasProofOfAddress, setHasProofOfAddress] = useState(false);
  const [needsPickupSupport, setNeedsPickupSupport] = useState(false);

  const [allowOfficeFollowups, setAllowOfficeFollowups] = useState(false);
  const [allowDocumentHandling, setAllowDocumentHandling] = useState(false);
  const [acceptedFeePolicy, setAcceptedFeePolicy] = useState(false);
  const [acceptedLegalNotice, setAcceptedLegalNotice] = useState(false);
  const [acceptedWhatsappContact, setAcceptedWhatsappContact] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      Boolean(
        fullName.trim() &&
          phone.trim() &&
          preferredRegion.trim() &&
          reasonForTravel.trim() &&
          dateOfBirth &&
          placeOfBirth.trim() &&
          nationality.trim() &&
          residentialAddress.trim() &&
          occupation.trim() &&
          ghanaCardNumber.trim() &&
          birthCertificateNumber.trim() &&
          emergencyContactName.trim() &&
          emergencyContactPhone.trim() &&
          allowOfficeFollowups &&
          acceptedFeePolicy &&
          acceptedLegalNotice &&
          acceptedWhatsappContact
      ),
    [
      fullName,
      phone,
      preferredRegion,
      reasonForTravel,
      dateOfBirth,
      placeOfBirth,
      nationality,
      residentialAddress,
      occupation,
      ghanaCardNumber,
      birthCertificateNumber,
      emergencyContactName,
      emergencyContactPhone,
      allowOfficeFollowups,
      acceptedFeePolicy,
      acceptedLegalNotice,
      acceptedWhatsappContact,
    ]
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
          whatsappNumber: whatsappNumber.trim() || undefined,
          preferredContactChannel,
        },
        passportDetails: {
          applicationType,
          preferredRegion: preferredRegion.trim(),
          preferredAppointmentWindow,
          urgentTravelDate: urgentTravelDate || undefined,
          reasonForTravel: reasonForTravel.trim(),
          dateOfBirth,
          placeOfBirth: placeOfBirth.trim(),
          nationality: nationality.trim(),
          residentialAddress: residentialAddress.trim(),
          occupation: occupation.trim(),
          ghanaCardNumber: ghanaCardNumber.trim(),
          birthCertificateNumber: birthCertificateNumber.trim(),
          emergencyContactName: emergencyContactName.trim(),
          emergencyContactPhone: emergencyContactPhone.trim(),
          previousPassportNumber: previousPassportNumber.trim() || undefined,
          hasGhanaCard,
          hasBirthCertificate,
          hasPassportPhotos,
          hasProofOfAddress,
          needsPickupSupport,
        },
        consent: {
          allowOfficeFollowups,
          allowDocumentHandling,
          acceptedFeePolicy,
          acceptedLegalNotice,
          acceptedWhatsappContact,
        },
        notes: notes.trim() || undefined,
      };

      const relayCase = await createRelayCaseClient(user.id, request);
      router.push(`/relay/${relayCase.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit Agent request.");
      setSubmitting(false);
    }
  };

  return (
    <AppShell title={`${RELAY_FEATURE_NAME} Intake`}>
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-primary/15 bg-gradient-to-br from-soft-blue/50 via-white to-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Passport pilot</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Start passport support with {RELAY_FEATURE_NAME}</h1>
          <p className="mt-2 text-sm text-muted">
            You submit detailed intake first. Admin reviews, confirms scope on WhatsApp, then invites
            you back for secure payment.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
              1) Admin review
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <MessageCircleMore className="h-3.5 w-3.5 text-primary" />
              2) WhatsApp agreement
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              3) Secure payment
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-muted">
              <CalendarClock className="h-3.5 w-3.5 text-primary" />
              4) Upload docs + processing
            </p>
          </div>
          <p className="mt-3 text-xs text-muted">
            Expected service fee starts from <span className="font-semibold text-foreground">GHS {RELAY_DEFAULT_FEE_GHS}</span>{" "}
            after approval (government charges excluded).
          </p>
        </motion.section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-foreground">1) Contact and communication</h2>
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
            <input
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="WhatsApp number (recommended)"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <label className="text-sm text-muted">
              Preferred contact channel
              <select
                value={preferredContactChannel}
                onChange={(event) =>
                  setPreferredContactChannel(event.target.value as "phone" | "whatsapp" | "either")
                }
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="either">Phone or WhatsApp</option>
                <option value="whatsapp">WhatsApp first</option>
                <option value="phone">Phone first</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-foreground">2) Passport applicant details</h2>
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
            <label className="text-sm text-muted">
              Preferred appointment window
              <select
                value={preferredAppointmentWindow}
                onChange={(event) =>
                  setPreferredAppointmentWindow(event.target.value as "morning" | "afternoon" | "anytime")
                }
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="anytime">Anytime</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
            </label>
            <input
              value={occupation}
              onChange={(event) => setOccupation(event.target.value)}
              placeholder="Occupation"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={placeOfBirth}
              onChange={(event) => setPlaceOfBirth(event.target.value)}
              placeholder="Place of birth"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
              placeholder="Nationality"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={ghanaCardNumber}
              onChange={(event) => setGhanaCardNumber(event.target.value)}
              placeholder="Ghana Card number"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={birthCertificateNumber}
              onChange={(event) => setBirthCertificateNumber(event.target.value)}
              placeholder="Birth certificate number"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {applicationType !== "first_time" ? (
              <input
                value={previousPassportNumber}
                onChange={(event) => setPreviousPassportNumber(event.target.value)}
                placeholder="Previous passport number"
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
              />
            ) : null}
            <input
              value={emergencyContactName}
              onChange={(event) => setEmergencyContactName(event.target.value)}
              placeholder="Emergency contact name"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={emergencyContactPhone}
              onChange={(event) => setEmergencyContactPhone(event.target.value)}
              placeholder="Emergency contact phone"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              value={residentialAddress}
              onChange={(event) => setResidentialAddress(event.target.value)}
              placeholder="Residential address"
              rows={2}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
            />
            <textarea
              value={reasonForTravel}
              onChange={(event) => setReasonForTravel(event.target.value)}
              placeholder="Reason for travel / passport request"
              rows={2}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
            />
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
                checked={hasPassportPhotos}
                onChange={(event) => setHasPassportPhotos(event.target.checked)}
              />
              I already have passport photos that meet requirements
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={hasProofOfAddress}
                onChange={(event) => setHasProofOfAddress(event.target.checked)}
              />
              I have proof of address ready
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
            3) Consent and authorization
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
              I allow GovFlow to review and organize my uploaded documents for this request.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedFeePolicy}
                onChange={(event) => setAcceptedFeePolicy(event.target.checked)}
              />
              I understand the Agent fee excludes official government fees and third-party charges.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedLegalNotice}
                onChange={(event) => setAcceptedLegalNotice(event.target.checked)}
              />
              I accept Agent terms, cancellation policy, and responsibility boundaries.
            </label>
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedWhatsappContact}
                onChange={(event) => setAcceptedWhatsappContact(event.target.checked)}
              />
              I consent to WhatsApp follow-up for approval, agreement, and action reminders.
            </label>
          </div>
          <div className="mt-4 rounded-xl border border-gray-200 bg-white px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">After admin approval, upload these documents in-app</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              {RELAY_REQUIRED_PASSPORT_DOCUMENTS.map((item) => (
                <li key={item} className="inline-flex w-full items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
                Submitting...
              </>
            ) : (
              <>Submit for admin review</>
            )}
          </Button>
          <ActionButton href="/relay" variant="outline">
            Back to Agent dashboard
          </ActionButton>
        </div>
      </div>
    </AppShell>
  );
}
