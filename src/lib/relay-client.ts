"use client";

import type { RelayCase, RelayCaseMetrics, RelayCaseRequest } from "@/types/relay";

interface RelayCasesResponse {
  cases: RelayCase[];
  metrics: RelayCaseMetrics;
}

function headersWithUser(userId: string) {
  return {
    "Content-Type": "application/json",
    "x-govflow-user-id": userId,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

export async function fetchRelayCases(userId: string): Promise<RelayCasesResponse> {
  const response = await fetch("/api/relay/cases", {
    headers: headersWithUser(userId),
  });
  const payload = await parseJson<RelayCasesResponse & { error?: string }>(response);
  if (!response.ok) {
    throw new Error(payload.error || "Could not load Agent cases.");
  }
  return payload;
}

export async function createRelayCaseClient(userId: string, request: RelayCaseRequest): Promise<RelayCase> {
  const response = await fetch("/api/relay/cases", {
    method: "POST",
    headers: headersWithUser(userId),
    body: JSON.stringify(request),
  });
  const payload = await parseJson<{ case?: RelayCase; error?: string }>(response);
  if (!response.ok || !payload.case) {
    throw new Error(payload.error || "Could not create Agent case.");
  }
  return payload.case;
}

export async function initializeRelayPayment(caseId: string, email?: string): Promise<{
  authorizationUrl: string;
  demoMode?: boolean;
}> {
  const response = await fetch(`/api/relay/cases/${caseId}/paystack-init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/relay/${caseId}` : undefined,
    }),
  });
  const payload = await parseJson<{ authorizationUrl?: string; demoMode?: boolean; error?: string }>(
    response
  );
  if (!response.ok || !payload.authorizationUrl) {
    throw new Error(payload.error || "Could not initialize payment.");
  }
  return {
    authorizationUrl: payload.authorizationUrl,
    demoMode: payload.demoMode,
  };
}

export async function fetchRelayCase(caseId: string): Promise<RelayCase> {
  const response = await fetch(`/api/relay/cases/${caseId}`);
  const payload = await parseJson<{ case?: RelayCase; error?: string }>(response);
  if (!response.ok || !payload.case) {
    throw new Error(payload.error || "Could not load Agent case.");
  }
  return payload.case;
}

export async function completePresenceStep(caseId: string, userId: string): Promise<RelayCase> {
  const response = await fetch(`/api/relay/cases/${caseId}/presence-complete`, {
    method: "POST",
    headers: headersWithUser(userId),
  });
  const payload = await parseJson<{ case?: RelayCase; error?: string }>(response);
  if (!response.ok || !payload.case) {
    throw new Error(payload.error || "Could not update presence step.");
  }
  return payload.case;
}
