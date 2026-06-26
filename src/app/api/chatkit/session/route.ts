import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "govflow-chatkit-user-id";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type IncomingPayload = {
  existing?: string | null;
  stateVariables?: Record<string, string | boolean | number>;
  enableFileUpload?: boolean;
};

type UpstreamPayload = {
  workflow: {
    id: string;
    state_variables?: Record<string, string | boolean | number>;
  };
  user: string;
  session?: { client_secret: string };
  chatkit_configuration?: {
    file_upload?: { enabled?: boolean };
  };
};

export async function POST(request: Request) {
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_AGENT_ID;
  const projectId = process.env.OPENAI_PROJECT_ID;

  if (!openAiApiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  if (!workflowId) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_CHATKIT_AGENT_ID (Agent Builder workflow ID)" },
      { status: 500 }
    );
  }

  const body = await parseIncomingBody(request);
  const cookieStore = await cookies();
  let userId = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  let shouldSetCookie = false;

  if (!userId) {
    userId = crypto.randomUUID();
    shouldSetCookie = true;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAiApiKey}`,
    "OpenAI-Beta": "chatkit_beta=v1",
  };

  if (projectId) {
    headers["OpenAI-Project"] = projectId;
  }

  const payload: UpstreamPayload = {
    workflow: {
      id: workflowId,
      ...(body?.stateVariables ? { state_variables: body.stateVariables } : {}),
    },
    user: userId,
    chatkit_configuration: {
      file_upload: {
        enabled: body?.enableFileUpload ?? false,
      },
    },
  };

  if (body?.existing) {
    payload.session = { client_secret: body.existing };
  }

  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const errorMessage = extractError(result);

  if (!response.ok) {
    console.error("[chatkit] session creation failed", {
      status: response.status,
      error: errorMessage,
      body: result,
    });

    return NextResponse.json(
      {
        error: errorMessage ?? "Failed to create ChatKit session.",
        details: result,
      },
      { status: response.status }
    );
  }

  const nextResponse = NextResponse.json({
    client_secret: result.client_secret ?? null,
    expires_at: result.expires_at ?? null,
  });

  if (shouldSetCookie && userId) {
    nextResponse.cookies.set({
      name: SESSION_COOKIE,
      value: userId,
      httpOnly: true,
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return nextResponse;
}

async function parseIncomingBody(request: Request): Promise<IncomingPayload | null> {
  try {
    const text = await request.text();
    if (!text) return null;
    return JSON.parse(text) as IncomingPayload;
  } catch {
    return null;
  }
}

function extractError(payload: Record<string, unknown> | undefined): string | null {
  if (!payload) return null;

  if (typeof payload.message === "string") return payload.message;

  const error = payload.error;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return null;
}
