import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type AdminUserItem = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  createdAt: string | null;
  latestRequestStatus: string | null;
};

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

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 500,
    });
    if (authError) throw new Error(authError.message);

    for (const user of authUsers.users || []) {
      usersMap.set(user.id, {
        id: user.id,
        email: user.email || null,
        phone: user.phone || null,
        fullName: (user.user_metadata?.full_name as string) || null,
        createdAt: user.created_at || null,
        latestRequestStatus: null,
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
          latestRequestStatus: row.status as string,
        });
      } else if (!existing.latestRequestStatus) {
        existing.latestRequestStatus = row.status as string;
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.fullName && fullName) existing.fullName = fullName;
      }
    }

    return NextResponse.json({ users: [...usersMap.values()] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load users." },
      { status: 500 }
    );
  }
}
