import { NextResponse } from "next/server";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

type VisitPayload = {
  pathname?: string;
  flow?: string;
  referrer?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const body = (await request.json().catch(() => ({}))) as VisitPayload;
  const pathname = (body.pathname || "").trim();
  if (!pathname) {
    return NextResponse.json({ error: "Missing pathname." }, { status: 400 });
  }

  const flow = (body.flow || "").trim() || "unknown";
  const referrer = (body.referrer || "").trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  try {
    const supabase = getSupabaseAdminClient();
    await supabase.from("app_page_visits").insert({
      pathname,
      flow,
      referrer,
      user_agent: userAgent,
      visited_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not track visit." },
      { status: 500 }
    );
  }
}
