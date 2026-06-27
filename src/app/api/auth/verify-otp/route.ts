import { NextResponse } from "next/server";
import { parseIdentifier } from "@/lib/auth-identifiers";

type VerifyOtpPayload = {
  phone?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as VerifyOtpPayload;
  const parsed = parseIdentifier(body.phone ?? "");
  const code = String(body.code ?? "").trim();

  if (!parsed || parsed.type !== "phone") {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "OTP must be a 6-digit code." }, { status: 400 });
  }

  const apiKey = process.env.ARKESEL_API_KEY;
  const baseUrl = process.env.ARKESEL_BASE_URL ?? "https://sms.arkesel.com";
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ARKESEL_API_KEY in environment." }, { status: 500 });
  }

  const recipientNumber = parsed.value.replace("+", "");
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
    [key: string]: unknown;
  };

  if (!response.ok || payload.code !== "1100") {
    return NextResponse.json(
      {
        error: payload.message || "OTP verification failed.",
        details: payload,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    phone: recipientNumber,
    message: payload.message || "Phone verification successful.",
    providerCode: payload.code ?? null,
  });
}
