type ClifzeResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

function getClifzeConfig() {
  const apiKey = process.env.CLIFZE_SMS_API_KEY;
  const sender = process.env.CLIFZE_SMS_SENDER_ID ?? "GovFlow";
  const baseUrl = process.env.CLIFZE_SMS_BASE_URL ?? "https://clifze.shop";
  return { apiKey, sender, baseUrl };
}

function toRecipient(phone: string) {
  return phone.replace(/\s+/g, "").replace("+", "");
}

export async function sendClifzeSms(toPhone: string, message: string): Promise<ClifzeResult> {
  const { apiKey, sender, baseUrl } = getClifzeConfig();
  if (!apiKey) {
    return { ok: false, error: "Missing CLIFZE_SMS_API_KEY." };
  }

  const smsUrl = new URL("/api/v1/send", baseUrl);
  const body = new URLSearchParams({
    api_key: apiKey,
    sender_id: sender,
    recipient: toRecipient(toPhone),
    message,
  });

  const response = await fetch(smsUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!response.ok || payload.status !== "success") {
    return {
      ok: false,
      error: payload.message || "Clifze SMS request failed.",
    };
  }

  return { ok: true, message: payload.message };
}

export async function sendClifzeOtp(toPhone: string): Promise<ClifzeResult> {
  const { apiKey, sender, baseUrl } = getClifzeConfig();
  if (!apiKey) {
    return { ok: false, error: "Missing CLIFZE_SMS_API_KEY." };
  }

  const otpUrl = new URL("/api/v1/otp/send", baseUrl);
  const body = new URLSearchParams({
    api_key: apiKey,
    sender_id: sender,
    recipient: toRecipient(toPhone),
    message:
      process.env.CLIFZE_OTP_MESSAGE || "GovFlow verification code: [otp]. Expires in 5 minutes.",
    expiry: process.env.CLIFZE_OTP_EXPIRY_MINUTES || "5",
  });

  const response = await fetch(otpUrl.toString(), {
    method: "POST",
    body: body.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!response.ok || payload.status !== "success") {
    return {
      ok: false,
      error: payload.message || "Clifze OTP send failed.",
    };
  }

  return { ok: true, message: payload.message };
}

export async function verifyClifzeOtp(toPhone: string, code: string): Promise<ClifzeResult> {
  const { apiKey, baseUrl } = getClifzeConfig();
  if (!apiKey) {
    return { ok: false, error: "Missing CLIFZE_SMS_API_KEY." };
  }

  const verifyUrl = new URL("/api/v1/otp/verify", baseUrl);
  const body = new URLSearchParams({
    api_key: apiKey,
    recipient: toRecipient(toPhone),
    otp_code: code,
  });

  const response = await fetch(verifyUrl.toString(), {
    method: "POST",
    body: body.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!response.ok || payload.status !== "success") {
    return {
      ok: false,
      error: payload.message || "Clifze OTP verification failed.",
    };
  }

  return { ok: true, message: payload.message };
}
