export type IdentifierType = "email" | "phone";

export interface ParsedIdentifier {
  type: IdentifierType;
  value: string;
}

const PHONE_ALIAS_DOMAIN = "phone.govflow.app";

function normalizePhone(raw: string): string | null {
  const digitsOnly = raw.replace(/[^\d+]/g, "").replace(/\s+/g, "");

  if (/^0\d{9}$/.test(digitsOnly)) {
    return `+233${digitsOnly.slice(1)}`;
  }

  if (/^\+233\d{9}$/.test(digitsOnly)) {
    return digitsOnly;
  }

  if (/^233\d{9}$/.test(digitsOnly)) {
    return `+${digitsOnly}`;
  }

  return null;
}

export function parseIdentifier(input: string): ParsedIdentifier | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;

  if (value.includes("@")) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return null;
    return { type: "email", value };
  }

  const normalizedPhone = normalizePhone(value);
  if (!normalizedPhone) return null;
  return { type: "phone", value: normalizedPhone };
}

export function phoneToEmailAlias(phone: string): string {
  const normalized = parseIdentifier(phone);
  if (!normalized || normalized.type !== "phone") {
    throw new Error("Invalid phone number format");
  }
  const compact = normalized.value.replace("+", "");
  return `${compact}@${PHONE_ALIAS_DOMAIN}`;
}
