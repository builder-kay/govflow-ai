import { NextRequest, NextResponse } from "next/server";
import { KHAYA_TRANSLATION_BASE_URL, buildLanguagePair } from "@/lib/khaya-translation";

type KhayaTranslateResponse = {
  translated_text?: string;
  translation?: string;
  translatedText?: string;
  output?: string;
  result?: string;
  text?: string;
  error?: {
    message?: string;
    details?: Array<{ code?: string; message?: string; target?: string }>;
  };
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    text?: string;
    source?: string;
    target?: string;
  };

  const text = body.text?.trim() ?? "";
  const source = body.source?.trim() ?? "";
  const target = body.target?.trim() ?? "";

  if (!text) {
    return NextResponse.json({ error: "Text is required for translation." }, { status: 400 });
  }

  if (!source || !target) {
    return NextResponse.json(
      { error: "Both source and target language codes are required." },
      { status: 400 }
    );
  }

  if (source === target) {
    return NextResponse.json({ translatedText: text });
  }

  const serviceUrl = process.env.GHANA_NLP_SERVICE_URL?.trim();
  if (serviceUrl) {
    try {
      const serviceResponse = await fetch(`${serviceUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ text, source, target }),
        cache: "no-store",
      });

      const servicePayload = (await serviceResponse.json().catch(() => ({}))) as {
        translatedText?: string;
        detail?: string;
        error?: string;
      };

      if (!serviceResponse.ok) {
        return NextResponse.json(
          {
            error:
              servicePayload.error ||
              servicePayload.detail ||
              "Translation microservice request failed.",
          },
          { status: serviceResponse.status }
        );
      }

      if (!servicePayload.translatedText) {
        return NextResponse.json(
          { error: "Translation microservice returned empty text." },
          { status: 502 }
        );
      }

      return NextResponse.json({ translatedText: servicePayload.translatedText });
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
    const khayaResponse = await fetch(`${KHAYA_TRANSLATION_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": apiKey,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        in: text,
        lang: buildLanguagePair(source, target),
      }),
      cache: "no-store",
    });

    const payload = (await khayaResponse.json().catch(() => ({}))) as
      | KhayaTranslateResponse
      | string;

    if (!khayaResponse.ok) {
      const detailMessage =
        typeof payload === "object" && payload !== null
          ? payload.error?.details?.[0]?.message
          : undefined;
      return NextResponse.json(
        {
          error:
            detailMessage ||
            (typeof payload === "object" && payload !== null ? payload.error?.message : undefined) ||
            "Khaya translation failed.",
        },
        { status: khayaResponse.status }
      );
    }

    const translatedText =
      typeof payload === "string"
        ? payload
        : payload.translated_text ??
          payload.translation ??
          payload.translatedText ??
          payload.output ??
          payload.result ??
          payload.text;

    if (!translatedText || typeof translatedText !== "string") {
      return NextResponse.json(
        { error: "Khaya translation response did not include translated text." },
        { status: 502 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json({ error: "Khaya service is currently unavailable." }, { status: 503 });
  }
}
