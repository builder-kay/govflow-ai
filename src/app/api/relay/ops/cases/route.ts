import { NextResponse } from "next/server";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { RelayCaseStatus } from "@/types/relay";

function hasOpsAccess(request: Request): boolean {
  const secret = process.env.RELAY_OPS_SECRET;
  if (!secret) return false;
  return request.headers.get("x-relay-ops-secret") === secret;
}

type RelayCaseRow = {
  id: string;
  service_type: string;
  status: RelayCaseStatus;
  payment_status: string;
  intake_json: {
    contact?: { fullName?: string; phone?: string };
  };
  assigned_coordinator: string | null;
  assigned_runner: string | null;
  created_at: string;
  updated_at: string;
};

export async function GET(request: Request) {
  if (!hasOpsAccess(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json(
      { error: "Ops list requires Supabase admin config in this environment." },
      { status: 501 }
    );
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_cases")
    .select(
      "id, service_type, status, payment_status, intake_json, assigned_coordinator, assigned_runner, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .returns<RelayCaseRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cases: data || [] });
}
