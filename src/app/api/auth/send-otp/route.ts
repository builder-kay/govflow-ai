import { NextResponse } from "next/server";
import { parseIdentifier } from "@/lib/auth-identifiers";
import { getAuthUserByPhone } from "@/lib/auth-account";
import { hasSupabaseAdminConfig } from "@/lib/supabase-admin";

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

  if (!apiKey) {
    return NextResponse.json({ error: "Missing ARKESEL_API_KEY in environment." }, { status: 500 });
  }

  if (!messageTemplate.includes("%otp_code%")) {
    return NextResponse.json(
      { error: "ARKESEL_OTP_MESSAGE must include %otp_code% placeholder." },
      { status: 500 }
    );
  }

  const recipientNumber = parsed.value.replace("+", "");
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
    [key: string]: unknown;
  };

  if (!response.ok || payload.code !== "1000") {
    return NextResponse.json(
      {
        error: payload.message || "Failed to send OTP SMS via Arkesel.",
        details: payload,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    phone: recipientNumber,
    message: payload.message || "OTP sent successfully.",
    providerCode: payload.code ?? null,
    ussdCode: typeof payload.ussd_code === "string" ? payload.ussd_code : null,
  });
}
