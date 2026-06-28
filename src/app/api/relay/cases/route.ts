import { NextResponse } from "next/server";
import { computeRelayMetrics, createRelayCase, listRelayCasesForUser } from "@/lib/relay-repository";
import { parseRelayCaseRequest } from "@/lib/relay-validators";

function resolveUserId(request: Request): string | null {
  const userId = request.headers.get("x-govflow-user-id");
  if (!userId) return null;
  return userId.trim() || null;
}

export async function GET(request: Request) {
  const userId = resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Missing user id." }, { status: 401 });
  }

  try {
    const cases = await listRelayCasesForUser(userId);
    return NextResponse.json({
      cases,
      metrics: computeRelayMetrics(cases),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load relay cases." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Missing user id." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const payload = parseRelayCaseRequest(body);
  if (!payload) {
    return NextResponse.json({ error: "Invalid relay request payload." }, { status: 400 });
  }

  try {
    const relayCase = await createRelayCase(userId, payload);
    return NextResponse.json({ case: relayCase }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create relay case." },
      { status: 500 }
    );
  }
}
