import { NextResponse } from "next/server";
import { getRelayCaseById, updateRelayCase } from "@/lib/relay-repository";

type InitPayload = {
  email?: string;
  callbackUrl?: string;
};

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as InitPayload;

  try {
    const relayCase = await getRelayCaseById(caseId);
    if (!relayCase) {
      return NextResponse.json({ error: "Relay case not found." }, { status: 404 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const callbackUrl = body.callbackUrl || process.env.PAYSTACK_CALLBACK_URL || "";
    const email = body.email || relayCase.intake.contact.email || "customer@relay.govflow.app";

    if (!paystackSecret) {
      const updated = await updateRelayCase(caseId, {
        paymentStatus: "pending",
        eventType: "payment_initialized",
        eventMessage: "Payment initialized in demo mode (PAYSTACK_SECRET_KEY not configured).",
        actor: "system",
      });
      return NextResponse.json({
        demoMode: true,
        authorizationUrl: `/relay/${caseId}?demo_payment=1`,
        case: updated,
      });
    }

    const reference = `relay_${caseId}_${Date.now()}`;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(relayCase.feeGhs * 100),
        reference,
        callback_url: callbackUrl,
        metadata: {
          relayCaseId: caseId,
          service: relayCase.serviceType,
          userId: relayCase.userId,
        },
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };

    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      return NextResponse.json(
        { error: payload.message || "Could not initialize Paystack payment." },
        { status: 502 }
      );
    }

    const updated = await updateRelayCase(caseId, {
      paymentStatus: "pending",
      paystackReference: reference,
      paystackAuthorizationUrl: payload.data.authorization_url,
      eventType: "payment_initialized",
      eventMessage: "Payment link created. Waiting for confirmation.",
      actor: "system",
    });

    return NextResponse.json({
      authorizationUrl: payload.data.authorization_url,
      reference,
      case: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not initialize payment." },
      { status: 500 }
    );
  }
}
