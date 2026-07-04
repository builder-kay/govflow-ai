import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import { sendSmsWithFallback } from "@/lib/sms-gateway";

type SmsPayload = {
  mode?: "single" | "selected" | "all";
  phone?: string;
  phones?: string[];
  message?: string;
};

const GH_PHONE_REGEX = /^(?:\+233|233|0)\d{9}$/;

function normalize(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  return GH_PHONE_REGEX.test(trimmed) ? trimmed : null;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as SmsPayload;
  const message = body.message?.trim() || "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const mode = body.mode || "single";
  const recipients = new Set<string>();

  if (mode === "single") {
    const one = body.phone ? normalize(body.phone) : null;
    if (!one) return NextResponse.json({ error: "Valid phone is required." }, { status: 400 });
    recipients.add(one);
  } else if (mode === "selected") {
    for (const raw of body.phones || []) {
      const value = normalize(raw);
      if (value) recipients.add(value);
    }
    if (!recipients.size) {
      return NextResponse.json({ error: "No valid selected phone numbers." }, { status: 400 });
    }
  } else if (mode === "all") {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ error: "Supabase config missing for all-users send." }, { status: 501 });
    }
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("relay_cases")
      .select("intake_json")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    for (const row of data || []) {
      const phone = (row.intake_json as { contact?: { phone?: string } })?.contact?.phone;
      if (phone) {
        const normalized = normalize(phone);
        if (normalized) recipients.add(normalized);
      }
    }
    if (!recipients.size) {
      return NextResponse.json({ error: "No recipient numbers available." }, { status: 400 });
    }
  }

  const failures: Array<{ phone: string; error: string }> = [];
  let backupSent = 0;
  let sent = 0;
  for (const recipient of recipients) {
    const result = await sendSmsWithFallback(recipient, message);
    if (result.ok) {
      sent += 1;
      if (result.provider === "arkesel") {
        backupSent += 1;
      }
    } else {
      failures.push({ phone: recipient, error: result.error || "Failed to send." });
    }
  }

  return NextResponse.json({
    sent,
    backupSent,
    attempted: recipients.size,
    failures,
  });
}
