import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { RELAY_DEFAULT_FEE_GHS } from "@/lib/relay-config";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { RelayServiceType } from "@/types/relay";

type RelayFeeRow = {
  service_type: RelayServiceType;
  fee_ghs: number;
  updated_at: string;
};

type PatchPayload = {
  serviceType?: RelayServiceType;
  feeGhs?: number;
  applyToOpenCases?: boolean;
};

const SUPPORTED_RELAY_SERVICES: RelayServiceType[] = ["passport"];

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      fees: SUPPORTED_RELAY_SERVICES.map((serviceType) => ({
        serviceType,
        feeGhs: RELAY_DEFAULT_FEE_GHS,
        source: "default",
      })),
    });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("relay_service_fees")
    .select("service_type, fee_ghs, updated_at")
    .returns<RelayFeeRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const feeByService = new Map<string, RelayFeeRow>();
  for (const row of data || []) {
    feeByService.set(row.service_type, row);
  }

  return NextResponse.json({
    fees: SUPPORTED_RELAY_SERVICES.map((serviceType) => {
      const configured = feeByService.get(serviceType);
      return {
        serviceType,
        feeGhs: configured?.fee_ghs ?? RELAY_DEFAULT_FEE_GHS,
        source: configured ? "configured" : "default",
        updatedAt: configured?.updated_at ?? null,
      };
    }),
  });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json(
      { error: "Supabase admin config required for fee updates." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as PatchPayload;
  const serviceType = body.serviceType;
  const feeGhs = Number(body.feeGhs);
  const applyToOpenCases = Boolean(body.applyToOpenCases);

  if (!serviceType || !SUPPORTED_RELAY_SERVICES.includes(serviceType)) {
    return NextResponse.json({ error: "Valid serviceType is required." }, { status: 400 });
  }
  if (!Number.isFinite(feeGhs) || feeGhs <= 0) {
    return NextResponse.json({ error: "feeGhs must be a positive number." }, { status: 400 });
  }

  const normalizedFee = Number(feeGhs.toFixed(2));
  const supabase = getSupabaseAdminClient();

  const { data: upserted, error: upsertError } = await supabase
    .from("relay_service_fees")
    .upsert(
      {
        service_type: serviceType,
        fee_ghs: normalizedFee,
      },
      { onConflict: "service_type" }
    )
    .select("service_type, fee_ghs, updated_at")
    .single<RelayFeeRow>();

  if (upsertError || !upserted) {
    return NextResponse.json(
      { error: upsertError?.message || "Could not update service fee." },
      { status: 500 }
    );
  }

  let affectedOpenCases = 0;
  if (applyToOpenCases) {
    const { data: updatedCases, error: applyError } = await supabase
      .from("relay_cases")
      .update({ fee_ghs: normalizedFee })
      .eq("service_type", serviceType)
      .in("status", ["intake_received", "payment_pending", "ops_triage", "in_progress", "awaiting_user"])
      .in("payment_status", ["unpaid", "pending"])
      .select("id");

    if (applyError) {
      return NextResponse.json({ error: applyError.message }, { status: 500 });
    }
    affectedOpenCases = (updatedCases || []).length;
  }

  return NextResponse.json({
    fee: {
      serviceType: upserted.service_type,
      feeGhs: upserted.fee_ghs,
      updatedAt: upserted.updated_at,
    },
    affectedOpenCases,
  });
}
