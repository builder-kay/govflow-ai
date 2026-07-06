import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type UserActionPayload = {
  action?: "ban" | "unban";
  reason?: string;
  banDuration?: string;
};

type RelayCaseStatRow = {
  id: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  service_type: string;
};

function isUserBanned(bannedUntil: string | null | undefined): boolean {
  if (!bannedUntil) return false;
  return Date.parse(bannedUntil) > Date.now();
}

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: "Supabase admin config required." }, { status: 501 });
  }

  const { userId } = await context.params;
  const supabase = getSupabaseAdminClient();

  const [userRes, relayCasesRes] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase
      .from("relay_cases")
      .select("id, status, payment_status, created_at, updated_at, service_type")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<RelayCaseStatRow[]>(),
  ]);

  if (userRes.error) {
    return NextResponse.json({ error: userRes.error.message }, { status: 404 });
  }
  if (relayCasesRes.error) {
    return NextResponse.json({ error: relayCasesRes.error.message }, { status: 500 });
  }

  const user = userRes.data.user;
  const cases = relayCasesRes.data || [];
  const casesByStatus: Record<string, number> = {};
  for (const relayCase of cases) {
    casesByStatus[relayCase.status] = (casesByStatus[relayCase.status] || 0) + 1;
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email || null,
      phone: user.phone || null,
      fullName: (user.user_metadata?.full_name as string) || null,
      createdAt: user.created_at || null,
      lastSignInAt: user.last_sign_in_at || null,
      bannedUntil: user.banned_until || null,
      isBanned: isUserBanned(user.banned_until),
      appMetadata: user.app_metadata || {},
    },
    stats: {
      totalCases: cases.length,
      casesByStatus,
      openCases: cases.filter((item) =>
        ["intake_received", "payment_pending", "ops_triage", "in_progress", "awaiting_user"].includes(item.status)
      ).length,
      completedCases: cases.filter((item) => item.status === "completed").length,
      cancelledCases: cases.filter((item) => item.status === "cancelled").length,
      latestCase: cases[0] || null,
    },
  });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: "Supabase admin config required." }, { status: 501 });
  }

  const { userId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UserActionPayload;
  const action = body.action;
  if (!action || !["ban", "unban"].includes(action)) {
    return NextResponse.json({ error: "Valid action is required (ban or unban)." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 404 });
  }

  const existingMetadata = userData.user.user_metadata || {};
  const reason = body.reason?.trim();
  const banDuration = body.banDuration?.trim() || "876000h"; // 100 years

  const updatePayload =
    action === "ban"
      ? {
          ban_duration: banDuration,
          user_metadata: {
            ...existingMetadata,
            admin_ban_reason: reason || "Banned by admin.",
          },
        }
      : {
          ban_duration: "none",
          user_metadata: {
            ...existingMetadata,
            admin_ban_reason: null,
          },
        };

  const { data, error } = await supabase.auth.admin.updateUserById(userId, updatePayload);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      bannedUntil: data.user.banned_until || null,
      isBanned: isUserBanned(data.user.banned_until),
    },
  });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: "Supabase admin config required." }, { status: 501 });
  }

  const { userId } = await context.params;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId, false);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
