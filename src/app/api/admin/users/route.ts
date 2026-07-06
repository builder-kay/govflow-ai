import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type AdminUserItem = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  bannedUntil: string | null;
  isBanned: boolean;
  latestRequestStatus: string | null;
  totalCases: number;
};

function isUserBanned(bannedUntil: string | null | undefined): boolean {
  if (!bannedUntil) return false;
  return Date.parse(bannedUntil) > Date.now();
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ users: [] as AdminUserItem[] });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const usersMap = new Map<string, AdminUserItem>();

    const authUsers: Array<{
      id: string;
      email?: string | null;
      phone?: string | null;
      created_at?: string | null;
      last_sign_in_at?: string | null;
      banned_until?: string | null;
      user_metadata?: { full_name?: string };
    }> = [];
    let page = 1;
    const perPage = 500;
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw new Error(error.message);
      const batch = data.users || [];
      authUsers.push(...batch);
      if (batch.length < perPage) break;
      page += 1;
    }

    for (const user of authUsers) {
      usersMap.set(user.id, {
        id: user.id,
        email: user.email || null,
        phone: user.phone || null,
        fullName: (user.user_metadata?.full_name as string) || null,
        createdAt: user.created_at || null,
        lastSignInAt: user.last_sign_in_at || null,
        bannedUntil: user.banned_until || null,
        isBanned: isUserBanned(user.banned_until),
        latestRequestStatus: null,
        totalCases: 0,
      });
    }

    const { data: relayCases, error: relayError } = await supabase
      .from("relay_cases")
      .select("id, user_id, status, intake_json, created_at")
      .order("created_at", { ascending: false });
    if (relayError) throw new Error(relayError.message);

    for (const row of relayCases || []) {
      const existing = usersMap.get(row.user_id);
      const fullName = (row.intake_json as { contact?: { fullName?: string } })?.contact?.fullName ?? null;
      const phone = (row.intake_json as { contact?: { phone?: string } })?.contact?.phone ?? null;
      if (!existing) {
        usersMap.set(row.user_id, {
          id: row.user_id,
          email: null,
          phone,
          fullName,
          createdAt: row.created_at as string,
          lastSignInAt: null,
          bannedUntil: null,
          isBanned: false,
          latestRequestStatus: row.status as string,
          totalCases: 1,
        });
      } else {
        existing.totalCases += 1;
        if (!existing.latestRequestStatus) {
          existing.latestRequestStatus = row.status as string;
        }
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.fullName && fullName) existing.fullName = fullName;
      }
    }

    return NextResponse.json({
      users: [...usersMap.values()].sort((a, b) => {
        const aTs = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTs = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTs - aTs;
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load users." },
      { status: 500 }
    );
  }
}
