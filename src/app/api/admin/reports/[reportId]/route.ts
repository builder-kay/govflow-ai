import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type PatchPayload = {
  status?: "open" | "investigating" | "resolved";
  adminNote?: string;
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reportId: string }> }
) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: "Supabase admin config missing." }, { status: 501 });
  }

  const { reportId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as PatchPayload;
  const patch: Record<string, string> = {};
  if (body.status) patch.status = body.status;
  if (body.adminNote !== undefined) patch.admin_note = body.adminNote;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "No updates provided." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reported_problems")
      .update(patch)
      .eq("id", reportId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ report: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update report." },
      { status: 500 }
    );
  }
}
