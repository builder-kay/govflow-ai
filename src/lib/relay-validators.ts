import type { RelayCaseRequest, RelayContactDetails, RelayConsent, RelayPassportDetails } from "@/types/relay";

const GH_PHONE_REGEX = /^(?:\+233|233|0)\d{9}$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseContact(input: unknown): RelayContactDetails | null {
  if (!isObject(input)) return null;

  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";

  if (!fullName || fullName.length < 2) return null;
  if (!GH_PHONE_REGEX.test(phone)) return null;

  return { fullName, phone, email: email || undefined };
}

function parsePassportDetails(input: unknown): RelayPassportDetails | null {
  if (!isObject(input)) return null;

  const applicationType = input.applicationType;
  const preferredRegion = typeof input.preferredRegion === "string" ? input.preferredRegion.trim() : "";

  if (
    applicationType !== "first_time" &&
    applicationType !== "renewal" &&
    applicationType !== "replacement"
  ) {
    return null;
  }
  if (!preferredRegion) return null;

  return {
    applicationType,
    preferredRegion,
    urgentTravelDate:
      typeof input.urgentTravelDate === "string" && input.urgentTravelDate.trim()
        ? input.urgentTravelDate.trim()
        : undefined,
    hasGhanaCard: Boolean(input.hasGhanaCard),
    hasBirthCertificate: Boolean(input.hasBirthCertificate),
    needsPickupSupport: Boolean(input.needsPickupSupport),
  };
}

function parseConsent(input: unknown): RelayConsent | null {
  if (!isObject(input)) return null;

  return {
    allowOfficeFollowups: Boolean(input.allowOfficeFollowups),
    allowDocumentHandling: Boolean(input.allowDocumentHandling),
    acceptedFeePolicy: Boolean(input.acceptedFeePolicy),
    acceptedLegalNotice: Boolean(input.acceptedLegalNotice),
  };
}

export function parseRelayCaseRequest(input: unknown): RelayCaseRequest | null {
  if (!isObject(input)) return null;
  if (input.serviceType !== "passport") return null;

  const contact = parseContact(input.contact);
  const passportDetails = parsePassportDetails(input.passportDetails);
  const consent = parseConsent(input.consent);
  const notes = typeof input.notes === "string" ? input.notes.trim() : undefined;

  if (!contact || !passportDetails || !consent) return null;
  if (!consent.allowOfficeFollowups || !consent.acceptedFeePolicy || !consent.acceptedLegalNotice) {
    return null;
  }

  return {
    serviceType: "passport",
    contact,
    passportDetails,
    consent,
    notes,
  };
}
