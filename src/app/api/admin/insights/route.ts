import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

function monthKey(dateIso: string): string {
  const date = new Date(dateIso);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      overview: null,
      growth: { users: [], requests: [] },
      topPages: [],
      topFlows: [],
      reports: [],
    });
  }

  try {
    const supabase = getSupabaseAdminClient();

    const [relayCasesRes, visitsRes, reportsRes, usersRes] = await Promise.all([
      supabase
        .from("relay_cases")
        .select("id, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("app_page_visits")
        .select("pathname, flow, visited_at")
        .order("visited_at", { ascending: false })
        .limit(5000),
      supabase
        .from("reported_problems")
        .select("id, status, created_at")
        .order("created_at", { ascending: false }),
      supabase.auth.admin.listUsers({ page: 1, perPage: 500 }),
    ]);

    if (relayCasesRes.error) throw new Error(relayCasesRes.error.message);
    if (visitsRes.error) throw new Error(visitsRes.error.message);
    if (reportsRes.error) throw new Error(reportsRes.error.message);
    if (usersRes.error) throw new Error(usersRes.error.message);

    const relayCases = relayCasesRes.data || [];
    const visits = visitsRes.data || [];
    const reports = reportsRes.data || [];
    const authUsers = usersRes.data.users || [];

    const usersByMonth = new Map<string, number>();
    for (const user of authUsers) {
      if (!user.created_at) continue;
      const key = monthKey(user.created_at);
      usersByMonth.set(key, (usersByMonth.get(key) || 0) + 1);
    }
    const requestsByMonth = new Map<string, number>();
    for (const item of relayCases) {
      const key = monthKey(item.created_at as string);
      requestsByMonth.set(key, (requestsByMonth.get(key) || 0) + 1);
    }

    const topPagesMap = new Map<string, number>();
    const topFlowsMap = new Map<string, number>();
    for (const visit of visits) {
      topPagesMap.set(visit.pathname as string, (topPagesMap.get(visit.pathname as string) || 0) + 1);
      topFlowsMap.set(visit.flow as string, (topFlowsMap.get(visit.flow as string) || 0) + 1);
    }

    const topPages = [...topPagesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pathname, visitsCount]) => ({ pathname, visits: visitsCount }));

    const topFlows = [...topFlowsMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([flow, visitsCount]) => ({ flow, visits: visitsCount }));

    const unresolvedReports = reports.filter((item) => item.status !== "resolved").length;

    return NextResponse.json({
      overview: {
        totalUsers: authUsers.length,
        totalRequests: relayCases.length,
        completedRequests: relayCases.filter((item) => item.status === "completed").length,
        pendingRequests: relayCases.filter((item) =>
          ["intake_received", "payment_pending", "ops_triage", "in_progress", "awaiting_user"].includes(
            item.status as string
          )
        ).length,
        unresolvedReports,
        totalPageVisits: visits.length,
      },
      growth: {
        users: [...usersByMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])),
        requests: [...requestsByMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      },
      topPages,
      topFlows,
      reports: reports.slice(0, 20),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load insights." },
      { status: 500 }
    );
  }
}
