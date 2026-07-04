import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request);
    return NextResponse.json({
      authenticated: Boolean(session),
      admin: session
        ? {
            username: session.username,
            displayName: session.displayName || null,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: error instanceof Error ? error.message : "Session check failed." },
      { status: 500 }
    );
  }
}
