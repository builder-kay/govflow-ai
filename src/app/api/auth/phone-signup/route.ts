import { NextResponse } from "next/server";
import { parseIdentifier, phoneToEmailAlias } from "@/lib/auth-identifiers";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type PhoneSignupPayload = {
  phone?: string;
  password?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PhoneSignupPayload;
  const parsed = parseIdentifier(body.phone ?? "");
  const code = String(body.code ?? "").trim();
  const password = String(body.password ?? "");

  if (!parsed || parsed.type !== "phone") {
    return NextResponse.json({ error: "Invalid Ghana mobile number." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "OTP must be a 6-digit code." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const apiKey = process.env.ARKESEL_API_KEY;
  const baseUrl = process.env.ARKESEL_BASE_URL ?? "https://sms.arkesel.com";
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ARKESEL_API_KEY in environment." }, { status: 500 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json(
      { error: "Missing Supabase admin configuration. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const recipientNumber = parsed.value.replace("+", "");
  const verifyUrl = new URL("/api/otp/verify", baseUrl);
  const verifyResponse = await fetch(verifyUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({ number: recipientNumber, code }),
  });
  const verifyPayload = (await verifyResponse.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  };
  if (!verifyResponse.ok || verifyPayload.code !== "1100") {
    return NextResponse.json(
      { error: verifyPayload.message || "OTP verification failed." },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdminClient();
  const aliasEmail = phoneToEmailAlias(parsed.value);

  const { error: createError } = await admin.auth.admin.createUser({
    email: aliasEmail,
    password,
    email_confirm: true,
    user_metadata: {
      phone: parsed.value,
      phone_verified_with_otp: true,
    },
  });

  if (createError) {
    const message = createError.message.toLowerCase();
    if (message.includes("already registered") || message.includes("already exists")) {
      return NextResponse.json(
        { error: "Account already exists. Please log in instead.", code: "ACCOUNT_EXISTS" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Account created successfully.",
  });
}
