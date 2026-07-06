import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import { sendSmsWithFallback } from "@/lib/sms-gateway";

type SmsPayload = {
  mode?:
    | "single_user"
    | "all_users"
    | "selected_users"
    | "processing_orders"
    | "in_person_action_needed"
    | "cancelled_cases"
    | "pending_admin_review"
    | "awaiting_payment"
    | "completed_cases"
    | "active_requests";
  phone?: string;
  phones?: string[];
  message?: string;
  preview?: boolean;
};

const GH_PHONE_REGEX = /^(?:\+233|233|0)\d{9}$/;

function normalize(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  return GH_PHONE_REGEX.test(trimmed) ? trimmed : null;
}

function addPhone(recipientSet: Set<string>, phone: unknown) {
  if (typeof phone !== "string") return;
  const normalized = normalize(phone);
  if (normalized) recipientSet.add(normalized);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as SmsPayload;
  const preview = Boolean(body.preview);
  const message = body.message?.trim() || "";

  const mode = body.mode || "single_user";
  const recipients = new Set<string>();

  if (mode === "single_user") {
    const one = body.phone ? normalize(body.phone) : null;
    if (!one) return NextResponse.json({ error: "Valid phone is required." }, { status: 400 });
    recipients.add(one);
  } else if (mode === "selected_users") {
    for (const raw of body.phones || []) {
      const value = normalize(raw);
      if (value) recipients.add(value);
    }
    if (!recipients.size) {
      return NextResponse.json({ error: "No valid selected phone numbers." }, { status: 400 });
    }
  } else {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ error: "Supabase config missing for this SMS mode." }, { status: 501 });
    }
    const supabase = getSupabaseAdminClient();
    const { data: relayCases, error } = await supabase
      .from("relay_cases")
      .select("status, payment_status, intake_json, steps_json")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (mode === "all_users") {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 500,
      });
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }
      for (const user of authUsers.users || []) {
        addPhone(recipients, user.phone);
      }
      for (const row of relayCases || []) {
        addPhone(recipients, (row.intake_json as { contact?: { phone?: string } })?.contact?.phone);
      }
    } else {
      const shouldIncludeCase = (row: {
        status: string;
        payment_status: string;
        steps_json: unknown;
      }) => {
        if (mode === "processing_orders") {
          return ["payment_pending", "ops_triage", "in_progress", "awaiting_user"].includes(row.status);
        }
        if (mode === "in_person_action_needed") {
          const steps = Array.isArray(row.steps_json) ? row.steps_json : [];
          return steps.some(
            (step) =>
              typeof step === "object" &&
              step !== null &&
              (step as { assignee?: string }).assignee === "user" &&
              Boolean((step as { requiresUserPresence?: boolean }).requiresUserPresence) &&
              (step as { status?: string }).status !== "completed"
          );
        }
        if (mode === "cancelled_cases") {
          return row.status === "cancelled";
        }
        if (mode === "pending_admin_review") {
          return row.status === "intake_received";
        }
        if (mode === "awaiting_payment") {
          return row.status === "payment_pending" || row.payment_status === "unpaid";
        }
        if (mode === "completed_cases") {
          return row.status === "completed";
        }
        if (mode === "active_requests") {
          return !["completed", "cancelled"].includes(row.status);
        }
        return false;
      };

      for (const row of relayCases || []) {
        if (!shouldIncludeCase(row as { status: string; payment_status: string; steps_json: unknown })) {
          continue;
        }
        addPhone(recipients, (row.intake_json as { contact?: { phone?: string } })?.contact?.phone);
      }
    }

    if (!recipients.size) {
      return NextResponse.json({ error: "No recipient numbers available." }, { status: 400 });
    }
  }

  if (preview) {
    return NextResponse.json({
      mode,
      previewCount: recipients.size,
      attempted: recipients.size,
    });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
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
