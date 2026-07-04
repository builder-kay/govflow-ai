import { NextResponse } from "next/server";
import { parseIdentifier } from "@/lib/auth-identifiers";
import { getAuthUserByPhone } from "@/lib/auth-account";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import { verifyOtpWithFallback } from "@/lib/sms-gateway";

type PhoneResetPayload = {
  phone?: string;
  password?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PhoneResetPayload;
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

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json(
      { error: "Missing Supabase admin configuration. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const otp = await verifyOtpWithFallback(parsed.value, code);
  if (!otp.ok) {
    return NextResponse.json(
      { error: otp.error || "OTP verification failed." },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdminClient();
  let matchedUser: Awaited<ReturnType<typeof getAuthUserByPhone>> | null = null;
  try {
    matchedUser = await getAuthUserByPhone(parsed.value);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not validate account status." },
      { status: 500 }
    );
  }
  if (!matchedUser) {
    return NextResponse.json(
      { error: "No account found for this phone number. Please create a new account first." },
      { status: 404 }
    );
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(matchedUser.id, {
    password,
    email_confirm: true,
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Password reset successful. Please log in with your new password.",
  });
}
