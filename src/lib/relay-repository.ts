import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import {
  RELAY_DEFAULT_FEE_GHS,
  RELAY_DEFAULT_SLA_HOURS,
  buildRelayPassportSteps,
  getEmptyRelayMetrics,
} from "@/lib/relay-config";
import type {
  RelayCase,
  RelayCaseEvent,
  RelayCaseMetrics,
  RelayCaseRequest,
  RelayCaseStatus,
} from "@/types/relay";

type RelayCaseRow = {
  id: string;
  user_id: string;
  service_type: string;
  status: RelayCaseStatus;
  fee_ghs: number;
  payment_status: "unpaid" | "pending" | "paid" | "failed";
  paystack_reference: string | null;
  paystack_authorization_url: string | null;
  assigned_coordinator: string | null;
  assigned_runner: string | null;
  sla_hours: number;
  intake_json: RelayCaseRequest;
  steps_json: RelayCase["steps"];
  events_json: RelayCaseEvent[];
  documents_json: RelayCase["documents"];
  created_at: string;
  updated_at: string;
};

type RelayServiceFeeRow = {
  service_type: string;
  fee_ghs: number;
};

const inMemoryCases = new Map<string, RelayCase>();

function fromRow(row: RelayCaseRow): RelayCase {
  return {
    id: row.id,
    userId: row.user_id,
    serviceType: row.service_type as RelayCase["serviceType"],
    status: row.status,
    feeGhs: row.fee_ghs,
    paymentStatus: row.payment_status,
    paystackReference: row.paystack_reference ?? undefined,
    paystackAuthorizationUrl: row.paystack_authorization_url ?? undefined,
    assignedCoordinator: row.assigned_coordinator ?? undefined,
    assignedRunner: row.assigned_runner ?? undefined,
    slaHours: row.sla_hours,
    intake: row.intake_json,
    steps: row.steps_json,
    events: row.events_json,
    documents: row.documents_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toInsert(caseData: RelayCase) {
  return {
    id: caseData.id,
    user_id: caseData.userId,
    service_type: caseData.serviceType,
    status: caseData.status,
    fee_ghs: caseData.feeGhs,
    payment_status: caseData.paymentStatus,
    paystack_reference: caseData.paystackReference ?? null,
    paystack_authorization_url: caseData.paystackAuthorizationUrl ?? null,
    assigned_coordinator: caseData.assignedCoordinator ?? null,
    assigned_runner: caseData.assignedRunner ?? null,
    sla_hours: caseData.slaHours,
    intake_json: caseData.intake,
    steps_json: caseData.steps,
    events_json: caseData.events,
    documents_json: caseData.documents,
  };
}

function pushEvent(events: RelayCaseEvent[], message: string, type: RelayCaseEvent["type"], actor: string) {
  return [
    ...events,
    {
      id: crypto.randomUUID(),
      type,
      message,
      actor,
      createdAt: new Date().toISOString(),
    },
  ];
}

function mergeDefined<T extends object>(base: T, patch: Partial<T>): T {
  const next = { ...base };
  (Object.keys(patch) as Array<keyof T>).forEach((key) => {
    const value = patch[key];
    if (value !== undefined) {
      next[key] = value as T[keyof T];
    }
  });
  return next;
}

export async function createRelayCase(userId: string, request: RelayCaseRequest): Promise<RelayCase> {
  const now = new Date().toISOString();
  let feeGhs = RELAY_DEFAULT_FEE_GHS;
  if (hasSupabaseAdminConfig) {
    const supabase = getSupabaseAdminClient();
    const { data: feeData } = await supabase
      .from("relay_service_fees")
      .select("service_type, fee_ghs")
      .eq("service_type", request.serviceType)
      .maybeSingle<RelayServiceFeeRow>();
    if (feeData?.fee_ghs && Number.isFinite(Number(feeData.fee_ghs))) {
      feeGhs = Number(feeData.fee_ghs);
    }
  }

  const relayCase: RelayCase = {
    id: crypto.randomUUID(),
    userId,
    serviceType: request.serviceType,
    status: "intake_received",
    feeGhs,
    paymentStatus: "unpaid",
    slaHours: RELAY_DEFAULT_SLA_HOURS,
    intake: request,
    steps: buildRelayPassportSteps(request),
    events: [
      {
        id: crypto.randomUUID(),
        type: "case_created",
        message: "Agent request submitted and queued for admin review.",
        actor: "system",
        createdAt: now,
      },
    ],
    documents: [],
    createdAt: now,
    updatedAt: now,
  };

  if (!hasSupabaseAdminConfig) {
    inMemoryCases.set(relayCase.id, relayCase);
    return relayCase;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_cases")
    .insert(toInsert(relayCase))
    .select("*")
    .single<RelayCaseRow>();

  if (error || !data) {
    throw new Error(error?.message || "Could not create relay case.");
  }

  return fromRow(data);
}

export async function listRelayCasesForUser(userId: string): Promise<RelayCase[]> {
  if (!hasSupabaseAdminConfig) {
    return [...inMemoryCases.values()]
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_cases")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<RelayCaseRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(fromRow);
}

export async function getRelayCaseById(caseId: string): Promise<RelayCase | null> {
  if (!hasSupabaseAdminConfig) {
    return inMemoryCases.get(caseId) ?? null;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_cases")
    .select("*")
    .eq("id", caseId)
    .maybeSingle<RelayCaseRow>();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;
  return fromRow(data);
}

export async function updateRelayCase(
  caseId: string,
  patch: Partial<
    Pick<
      RelayCase,
      | "status"
      | "paymentStatus"
      | "paystackReference"
      | "paystackAuthorizationUrl"
      | "assignedCoordinator"
      | "assignedRunner"
      | "steps"
      | "documents"
      | "feeGhs"
    >
  > & { eventMessage?: string; eventType?: RelayCaseEvent["type"]; actor?: string }
): Promise<RelayCase> {
  const existing = await getRelayCaseById(caseId);
  if (!existing) throw new Error("Agent request not found.");

  const next = mergeDefined(existing, patch);
  next.events = patch.eventMessage
    ? pushEvent(
        existing.events,
        patch.eventMessage,
        patch.eventType ?? "note",
        patch.actor ?? "system"
      )
    : existing.events;
  next.updatedAt = new Date().toISOString();

  if (!hasSupabaseAdminConfig) {
    inMemoryCases.set(caseId, next);
    return next;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_cases")
    .update({
      status: next.status,
      payment_status: next.paymentStatus,
      paystack_reference: next.paystackReference ?? null,
      paystack_authorization_url: next.paystackAuthorizationUrl ?? null,
      assigned_coordinator: next.assignedCoordinator ?? null,
      assigned_runner: next.assignedRunner ?? null,
      fee_ghs: next.feeGhs,
      steps_json: next.steps,
      events_json: next.events,
      documents_json: next.documents,
      updated_at: next.updatedAt,
    })
    .eq("id", caseId)
    .select("*")
    .single<RelayCaseRow>();

  if (error || !data) {
    throw new Error(error?.message || "Could not update relay case.");
  }

  return fromRow(data);
}

export function computeRelayMetrics(cases: RelayCase[]): RelayCaseMetrics {
  if (!cases.length) return getEmptyRelayMetrics();

  const completed = cases.filter((item) => item.status === "completed");
  const awaitingUser = cases.filter((item) => item.status === "awaiting_user").length;
  const completionHours = completed
    .map((item) => {
      const completedEvent = item.events.find((event) => event.type === "case_completed");
      if (!completedEvent) return 0;
      return (Date.parse(completedEvent.createdAt) - Date.parse(item.createdAt)) / 3_600_000;
    })
    .filter((value) => value > 0);
  const firstActionHours = cases
    .map((item) => {
      const firstAction = item.events.find(
        (event) => event.type === "ops_assigned" || event.type === "step_updated"
      );
      if (!firstAction) return 0;
      return (Date.parse(firstAction.createdAt) - Date.parse(item.createdAt)) / 3_600_000;
    })
    .filter((value) => value > 0);

  const presenceAlertsSent = cases.reduce(
    (acc, item) =>
      acc + item.events.filter((event) => event.type === "presence_required").length,
    0
  );

  const avg = (values: number[]) =>
    values.length ? Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)) : 0;

  return {
    totalCases: cases.length,
    completedCases: completed.length,
    awaitingUserCases: awaitingUser,
    averageCompletionHours: avg(completionHours),
    averageFirstActionHours: avg(firstActionHours),
    presenceAlertsSent,
  };
}
