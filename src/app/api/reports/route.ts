import { NextResponse } from "next/server";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type ReportPayload = {
  category?: string;
  title?: string;
  details?: string;
  pagePath?: string;
  contactEmail?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: "Reporting unavailable." }, { status: 503 });
  }
  const body = (await request.json().catch(() => ({}))) as ReportPayload;
  const title = body.title?.trim() || "";
  const details = body.details?.trim() || "";
  const category = body.category?.trim() || "general";
  if (!title || !details) {
    return NextResponse.json({ error: "Title and details are required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reported_problems")
      .insert({
        category,
        title,
        details,
        page_path: body.pagePath?.trim() || null,
        contact_email: body.contactEmail?.trim() || null,
        status: "open",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not submit report." },
      { status: 500 }
    );
  }
}
