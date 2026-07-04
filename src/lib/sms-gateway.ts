import { sendArkeselSms } from "@/lib/arkesel";
import { sendClifzeOtp, sendClifzeSms, verifyClifzeOtp } from "@/lib/clifze-sms";

type SmsResult = {
  ok: boolean;
  provider?: "clifze" | "arkesel";
  error?: string;
  message?: string;
};

type OtpResult = {
  ok: boolean;
  provider?: "clifze" | "arkesel";
  error?: string;
  message?: string;
  ussdCode?: string | null;
};

function getArkeselConfig() {
  const apiKey = process.env.ARKESEL_API_KEY;
  const sender = process.env.ARKESEL_SENDER_ID ?? "GovFlow";
  const baseUrl = process.env.ARKESEL_BASE_URL ?? "https://sms.arkesel.com";
  const expiry = Number(process.env.ARKESEL_OTP_EXPIRY_MINUTES ?? "5");
  const length = Number(process.env.ARKESEL_OTP_LENGTH ?? "6");
  const otpType = process.env.ARKESEL_OTP_TYPE ?? "numeric";
  const medium = process.env.ARKESEL_OTP_MEDIUM ?? "sms";
  const messageTemplate =
    process.env.ARKESEL_OTP_MESSAGE ??
    "GovFlow verification code: %otp_code%. Expires in %expiry% minutes.";
  return { apiKey, sender, baseUrl, expiry, length, otpType, medium, messageTemplate };
}

async function sendArkeselOtp(toPhone: string): Promise<OtpResult> {
  const { apiKey, sender, baseUrl, expiry, length, otpType, medium, messageTemplate } =
    getArkeselConfig();
  if (!apiKey) {
    return { ok: false, error: "Missing ARKESEL_API_KEY." };
  }
  const recipientNumber = toPhone.replace("+", "");
  const otpUrl = new URL("/api/otp/generate", baseUrl);
  const response = await fetch(otpUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      number: recipientNumber,
      sender_id: sender,
      message: messageTemplate,
      expiry,
      length,
      medium,
      type: otpType,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
    ussd_code?: string;
  };
  if (!response.ok || payload.code !== "1000") {
    return {
      ok: false,
      error: payload.message || "Arkesel OTP send failed.",
    };
  }
  return {
    ok: true,
    provider: "arkesel",
    message: payload.message || "OTP sent successfully.",
    ussdCode: payload.ussd_code ?? null,
  };
}

async function verifyArkeselOtp(toPhone: string, code: string): Promise<OtpResult> {
  const { apiKey, baseUrl } = getArkeselConfig();
  if (!apiKey) {
    return { ok: false, error: "Missing ARKESEL_API_KEY." };
  }
  const recipientNumber = toPhone.replace("+", "");
  const verifyUrl = new URL("/api/otp/verify", baseUrl);
  const response = await fetch(verifyUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      number: recipientNumber,
      code,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  };
  if (!response.ok || payload.code !== "1100") {
    return { ok: false, error: payload.message || "Arkesel OTP verification failed." };
  }
  return {
    ok: true,
    provider: "arkesel",
    message: payload.message || "OTP verified successfully.",
  };
}

export async function sendSmsWithFallback(toPhone: string, message: string): Promise<SmsResult> {
  const clifze = await sendClifzeSms(toPhone, message);
  if (clifze.ok) {
    return { ok: true, provider: "clifze", message: clifze.message };
  }

  const arkesel = await sendArkeselSms(toPhone, message);
  if (arkesel.ok) {
    return { ok: true, provider: "arkesel", message: "Sent via backup provider." };
  }
  return {
    ok: false,
    error: `Clifze failed: ${clifze.error || "Unknown"}. Arkesel failed: ${arkesel.error || "Unknown"}`,
  };
}

export async function sendOtpWithFallback(toPhone: string): Promise<OtpResult> {
  const clifze = await sendClifzeOtp(toPhone);
  if (clifze.ok) {
    return { ok: true, provider: "clifze", message: clifze.message, ussdCode: null };
  }
  const arkesel = await sendArkeselOtp(toPhone);
  if (arkesel.ok) {
    return arkesel;
  }
  return {
    ok: false,
    error: `Clifze failed: ${clifze.error || "Unknown"}. Arkesel failed: ${arkesel.error || "Unknown"}`,
  };
}

export async function verifyOtpWithFallback(toPhone: string, code: string): Promise<OtpResult> {
  const clifze = await verifyClifzeOtp(toPhone, code);
  if (clifze.ok) {
    return { ok: true, provider: "clifze", message: clifze.message };
  }
  const arkesel = await verifyArkeselOtp(toPhone, code);
  if (arkesel.ok) {
    return arkesel;
  }
  return {
    ok: false,
    error: `Clifze verify failed: ${clifze.error || "Unknown"}. Arkesel verify failed: ${arkesel.error || "Unknown"}`,
  };
}
