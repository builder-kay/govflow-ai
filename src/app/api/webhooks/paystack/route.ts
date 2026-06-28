import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";

interface PaystackChargeSuccessEvent {
  event: string;
  data?: {
    reference?: string;
    metadata?: {
      relayCaseId?: string;
    };
  };
}

function isValidSignature(body: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(body).digest("hex");
  return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as PaystackChargeSuccessEvent;
  if (payload.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const caseId = payload.data?.metadata?.relayCaseId;
  if (!caseId) {
    return NextResponse.json({ ok: true, ignored: true, reason: "missing_case_id" });
  }

  const relayCase = await getRelayCaseById(caseId);
  if (!relayCase) {
    return NextResponse.json({ ok: true, ignored: true, reason: "case_not_found" });
  }

  await updateRelayCase(caseId, {
    status: "ops_triage",
    paymentStatus: "paid",
    paystackReference: payload.data?.reference || relayCase.paystackReference,
    eventType: "payment_confirmed",
    eventMessage: "Payment confirmed via Paystack webhook.",
    actor: "system",
  });

  return NextResponse.json({ ok: true });
}
