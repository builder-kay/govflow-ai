"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { getWorkflowId, GOVFLOW_AGENT_DISCLAIMER } from "@/lib/openai-config";
import { cn } from "@/lib/utils";

type SessionResponse = {
  client_secret: string;
  expires_at?: string;
};

export interface ChatKitWidgetProps {
  className?: string;
  compact?: boolean;
  enableFileUpload?: boolean;
  initialPrompt?: string;
  stateVariables?: Record<string, string | boolean | number>;
  greeting?: string;
  showSetupError?: boolean;
}

const DEFAULT_PROMPTS = [
  {
    label: "Start food business",
    prompt: "I want to start a small food delivery business in Cape Coast. What do I need?",
  },
  {
    label: "Check my documents",
    prompt: "What documents do I need for business registration in Ghana?",
  },
  {
    label: "Explain in simple English",
    prompt: "Explain the FDA food hygiene permit in simple English.",
  },
  {
    label: "Avoid delays",
    prompt: "What mistakes should I avoid when registering a food business?",
  },
];

export function ChatKitWidget({
  className,
  compact = false,
  enableFileUpload = false,
  initialPrompt,
  stateVariables,
  greeting = "Hi! I'm GovFlow AI. Tell me what government process you need help with.",
  showSetupError = true,
}: ChatKitWidgetProps) {
  const [error, setError] = useState<string | null>(null);
  const workflowId = getWorkflowId();

  const getClientSecret = useCallback(
    async (existing: string | null): Promise<string> => {
      setError(null);

      const response = await fetch("/api/chatkit/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existing,
          stateVariables,
          enableFileUpload,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        try {
          const parsed = JSON.parse(text) as { error?: unknown };
          const message =
            typeof parsed.error === "string"
              ? parsed.error
              : "Failed to connect to GovFlow AI agent.";
          throw new Error(message);
        } catch (err) {
          if (err instanceof Error && err.message !== "Failed to connect to GovFlow AI agent.") {
            throw err;
          }
          throw new Error(text || `Failed to fetch client secret (${response.status})`);
        }
      }

      const data = JSON.parse(text) as SessionResponse;
      if (!data?.client_secret) {
        throw new Error("Response did not include a client secret");
      }

      return data.client_secret;
    },
    [enableFileUpload, stateVariables]
  );

  const options = useMemo(
    () => ({
      api: {
        async getClientSecret(existing: string | null) {
          return getClientSecret(existing);
        },
      },
      theme: {
        colorScheme: "light" as const,
        color: {
          accent: { primary: "#0F6B4F", level: 2 as const },
          surface: { background: "#F8FAF9", foreground: "#1F2937" },
        },
        radius: "round" as const,
        density: compact ? ("compact" as const) : ("normal" as const),
        typography: { fontFamily: "Inter, system-ui, sans-serif" },
      },
      header: {
        enabled: !compact,
        title: { enabled: true, text: "GovFlow AI" },
      },
      startScreen: {
        greeting,
        prompts: DEFAULT_PROMPTS,
      },
      composer: {
        placeholder: "Ask about passports, business registration, permits...",
        ...(enableFileUpload
          ? {
              attachments: {
                enabled: true,
                maxSize: 10 * 1024 * 1024,
              },
            }
          : {}),
      },
      disclaimer: {
        text: GOVFLOW_AGENT_DISCLAIMER,
      },
      history: { enabled: !compact },
    }),
    [compact, enableFileUpload, getClientSecret, greeting]
  );

  const { control, setComposerValue } = useChatKit(options);

  useEffect(() => {
    if (initialPrompt) {
      setComposerValue({ text: initialPrompt });
    }
  }, [initialPrompt, setComposerValue]);

  if (!workflowId && showSetupError) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">OpenAI Agent Builder not configured</p>
        <p className="mt-1">
          Add <code className="rounded bg-white px-1">OPENAI_API_KEY</code> and{" "}
          <code className="rounded bg-white px-1">NEXT_PUBLIC_CHATKIT_AGENT_ID</code> to your{" "}
          <code className="rounded bg-white px-1">.env.local</code> file, then restart the dev
          server.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {error ? (
        <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}
      <ChatKit control={control} className={cn("govflow-chatkit", compact && "h-[420px]")} />
    </div>
  );
}
