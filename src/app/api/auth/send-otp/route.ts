import { NextResponse } from "next/server";
import { parseIdentifier } from "@/lib/auth-identifiers";
import { getAuthUserByPhone } from "@/lib/auth-account";
import { hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import { sendOtpWithFallback } from "@/lib/sms-gateway";

type SendOtpPayload = {
  phone?: string;
  purpose?: "signup" | "reset";
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SendOtpPayload;
  const parsed = parseIdentifier(body.phone ?? "");
  const purpose = body.purpose;

  if (!parsed || parsed.type !== "phone") {
    return NextResponse.json(
      { error: "Enter a valid Ghana mobile number (e.g. 0241234567)." },
      { status: 400 }
    );
  }
  if (purpose && purpose !== "signup" && purpose !== "reset") {
    return NextResponse.json({ error: "Invalid OTP purpose." }, { status: 400 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json(
      { error: "Missing Supabase admin configuration. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  try {
    const existingUser = await getAuthUserByPhone(parsed.value);
    if (purpose === "signup" && existingUser) {
      return NextResponse.json(
        {
          error:
            "This number already has an account. Please log in instead. If you forgot your password, use Reset password.",
          code: "ACCOUNT_EXISTS",
        },
        { status: 409 }
      );
    }
    if (purpose === "reset" && !existingUser) {
      return NextResponse.json(
        {
          error: "This number does not have an account yet. Please sign up first.",
          code: "ACCOUNT_NOT_FOUND",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not validate account status." },
      { status: 500 }
    );
  }

  const recipientNumber = parsed.value.replace("+", "");
  const otp = await sendOtpWithFallback(parsed.value);
  if (!otp.ok) {
    return NextResponse.json({ error: otp.error || "Failed to send OTP." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    phone: recipientNumber,
    message:
      otp.message ||
      (otp.provider === "clifze"
        ? "OTP sent successfully via Clifze."
        : "OTP sent successfully via backup provider."),
    provider: otp.provider,
    ussdCode: otp.ussdCode ?? null,
  });
}
