import { NextResponse } from "next/server";
import { parseIdentifier } from "@/lib/auth-identifiers";
import { verifyOtpWithFallback } from "@/lib/sms-gateway";

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

  const recipientNumber = parsed.value.replace("+", "");
  const otp = await verifyOtpWithFallback(parsed.value, code);
  if (!otp.ok) {
    return NextResponse.json(
      {
        error: otp.error || "OTP verification failed.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    phone: recipientNumber,
    message: otp.message || "Phone verification successful.",
    provider: otp.provider,
  });
}
