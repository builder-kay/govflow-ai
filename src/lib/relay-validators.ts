import type { RelayCaseRequest, RelayContactDetails, RelayConsent, RelayPassportDetails } from "@/types/relay";

const GH_PHONE_REGEX = /^(?:\+233|233|0)\d{9}$/;
const PASSPORT_TYPES = new Set(["first_time", "renewal", "replacement"]);
const APPOINTMENT_WINDOWS = new Set(["morning", "afternoon", "anytime"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseContact(input: unknown): RelayContactDetails | null {
  if (!isObject(input)) return null;

  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const whatsappNumber =
    typeof input.whatsappNumber === "string" ? input.whatsappNumber.trim() : "";
  const preferredContactChannel =
    input.preferredContactChannel === "phone" ||
    input.preferredContactChannel === "whatsapp" ||
    input.preferredContactChannel === "either"
      ? input.preferredContactChannel
      : "either";

  if (!fullName || fullName.length < 2) return null;
  if (!GH_PHONE_REGEX.test(phone)) return null;
  if (whatsappNumber && !GH_PHONE_REGEX.test(whatsappNumber)) return null;

  return {
    fullName,
    phone,
    email: email || undefined,
    whatsappNumber: whatsappNumber || undefined,
    preferredContactChannel,
  };
}

function parsePassportDetails(input: unknown): RelayPassportDetails | null {
  if (!isObject(input)) return null;

  const applicationType = input.applicationType;
  const preferredRegion = typeof input.preferredRegion === "string" ? input.preferredRegion.trim() : "";
  const reasonForTravel = typeof input.reasonForTravel === "string" ? input.reasonForTravel.trim() : "";
  const dateOfBirth = typeof input.dateOfBirth === "string" ? input.dateOfBirth.trim() : "";
  const placeOfBirth = typeof input.placeOfBirth === "string" ? input.placeOfBirth.trim() : "";
  const nationality = typeof input.nationality === "string" ? input.nationality.trim() : "";
  const residentialAddress =
    typeof input.residentialAddress === "string" ? input.residentialAddress.trim() : "";
  const occupation = typeof input.occupation === "string" ? input.occupation.trim() : "";
  const emergencyContactName =
    typeof input.emergencyContactName === "string" ? input.emergencyContactName.trim() : "";
  const emergencyContactPhone =
    typeof input.emergencyContactPhone === "string" ? input.emergencyContactPhone.trim() : "";
  const preferredAppointmentWindow =
    typeof input.preferredAppointmentWindow === "string" &&
    APPOINTMENT_WINDOWS.has(input.preferredAppointmentWindow)
      ? (input.preferredAppointmentWindow as RelayPassportDetails["preferredAppointmentWindow"])
      : undefined;
  const previousPassportNumber =
    typeof input.previousPassportNumber === "string" ? input.previousPassportNumber.trim() : "";

  if (!PASSPORT_TYPES.has(String(applicationType))) {
    return null;
  }
  if (
    !preferredRegion ||
    !reasonForTravel ||
    !dateOfBirth ||
    !placeOfBirth ||
    !nationality ||
    !residentialAddress ||
    !occupation ||
    !emergencyContactName ||
    !GH_PHONE_REGEX.test(emergencyContactPhone)
  ) {
    return null;
  }

  return {
    applicationType: applicationType as RelayPassportDetails["applicationType"],
    preferredRegion,
    preferredAppointmentWindow,
    urgentTravelDate:
      typeof input.urgentTravelDate === "string" && input.urgentTravelDate.trim()
        ? input.urgentTravelDate.trim()
        : undefined,
    reasonForTravel,
    dateOfBirth,
    placeOfBirth,
    nationality,
    residentialAddress,
    occupation,
    emergencyContactName,
    emergencyContactPhone,
    previousPassportNumber: previousPassportNumber || undefined,
    hasGhanaCard: Boolean(input.hasGhanaCard),
    hasBirthCertificate: Boolean(input.hasBirthCertificate),
    hasPassportPhotos: Boolean(input.hasPassportPhotos),
    hasProofOfAddress: Boolean(input.hasProofOfAddress),
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
    acceptedWhatsappContact: Boolean(input.acceptedWhatsappContact),
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
  if (
    !consent.allowOfficeFollowups ||
    !consent.acceptedFeePolicy ||
    !consent.acceptedLegalNotice ||
    !consent.acceptedWhatsappContact
  ) {
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
