export async function sendArkeselSms(toPhone: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.ARKESEL_API_KEY;
  const sender = process.env.ARKESEL_SENDER_ID ?? "GovFlow";
  const baseUrl = process.env.ARKESEL_BASE_URL ?? "https://sms.arkesel.com";

  if (!apiKey) {
    return { ok: false, error: "Missing ARKESEL_API_KEY." };
  }

  const smsUrl = new URL("/api/v2/sms/send", baseUrl);
  const response = await fetch(smsUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      message,
      recipients: [toPhone.replace("+", "")],
    }),
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    return { ok: false, error: payload || "SMS request failed." };
  }

  return { ok: true };
}
