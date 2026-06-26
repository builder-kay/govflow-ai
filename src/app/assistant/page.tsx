"use client";

import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles } from "lucide-react";
import { getWorkflowId } from "@/lib/openai-config";

const ChatKitWidget = dynamic(
  () => import("@/components/chat/ChatKitWidget").then((m) => m.ChatKitWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-2xl border border-gray-100 bg-white text-muted">
        Loading GovFlow AI agent...
      </div>
    ),
  }
);

export default function AssistantPage() {
  const { userQuery, roadmap, accessibility } = useAppStore();
  const agentConfigured = Boolean(getWorkflowId());

  const stateVariables = {
    user_location: roadmap.location,
    active_service: roadmap.title,
    roadmap_progress: roadmap.progress,
    language: accessibility.language,
    explanation_style: accessibility.explanationStyle,
  };

  return (
    <AppShell title="AI Assistant" showChat={false}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">GovFlow AI Assistant</h1>
          </div>
          <p className="text-muted">
            {agentConfigured
              ? "Chat with your OpenAI Agent Builder workflow for personalized government service guidance."
              : "Configure your Agent Builder workflow to enable the live AI assistant."}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <ChatKitWidget
            className="min-h-[600px]"
            enableFileUpload
            initialPrompt={userQuery || undefined}
            stateVariables={stateVariables}
            greeting="Hi! I'm GovFlow AI — your government services copilot for Ghana. What would you like help with today?"
          />
        </div>
      </div>
    </AppShell>
  );
}
