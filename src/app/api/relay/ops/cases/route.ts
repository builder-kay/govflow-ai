import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import { isAdminAuthorized } from "@/lib/admin-auth";
import type { RelayCaseStatus } from "@/types/relay";

type RelayCaseRow = {
  id: string;
  service_type: string;
  status: RelayCaseStatus;
  payment_status: string;
  fee_ghs: number;
  intake_json: {
    contact?: { fullName?: string; phone?: string };
  };
  assigned_coordinator: string | null;
  assigned_runner: string | null;
  created_at: string;
  updated_at: string;
};

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
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
      "id, service_type, status, payment_status, fee_ghs, intake_json, assigned_coordinator, assigned_runner, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .returns<RelayCaseRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cases: data || [] });
}
