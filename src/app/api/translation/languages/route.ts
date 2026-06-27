import { NextResponse } from "next/server";
import { KHAYA_TRANSLATION_BASE_URL } from "@/lib/khaya-translation";

export async function GET() {
  const serviceUrl = process.env.GHANA_NLP_SERVICE_URL?.trim();
  if (serviceUrl) {
    try {
      const serviceResponse = await fetch(`${serviceUrl}/languages`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const servicePayload = (await serviceResponse.json().catch(() => ({}))) as {
        languages?: Record<string, string>;
        detail?: string;
        error?: string;
      };

      if (serviceResponse.ok) {
        return NextResponse.json({ languages: servicePayload.languages ?? {} });
      }
      return NextResponse.json(
        {
          error:
            servicePayload.error ||
            servicePayload.detail ||
            "Translation microservice could not fetch languages.",
        },
        { status: serviceResponse.status }
      );
    } catch {
      return NextResponse.json(
        { error: "Translation microservice is unavailable." },
        { status: 503 }
      );
    }
  }

  const apiKey = process.env.KHAYA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Khaya API key missing. Set KHAYA_API_KEY, or configure GHANA_NLP_SERVICE_URL for microservice mode.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${KHAYA_TRANSLATION_BASE_URL}/languages`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": apiKey,
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as {
      languages?: Record<string, string>;
      error?: { message?: string };
    };

    if (!response.ok) {
      return NextResponse.json(
        {
          error: payload.error?.message || "Could not fetch supported languages from Khaya.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ languages: payload.languages ?? {} });
  } catch {
    return NextResponse.json(
      { error: "Khaya language service is currently unavailable." },
      { status: 503 }
    );
  }
}
