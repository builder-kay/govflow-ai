"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/useAppStore";
import { Mic, MicOff, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { getWorkflowId } from "@/lib/openai-config";
import { getAssistantTopic } from "@/lib/assistant-topics";
import { buildSavedDocumentsContext } from "@/lib/saved-documents";
import { Button } from "@/components/ui/button";

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

const CHATKIT_HISTORY_STORAGE_KEY = "govflow-chatkit-client-secret";

function personalizeGreeting(baseGreeting: string, username: string): string {
  const trimmed = username.trim();
  if (!trimmed) return baseGreeting;
  if (/^hi[!,. ]*/i.test(baseGreeting)) {
    return baseGreeting.replace(/^hi[!,. ]*/i, `Hi ${trimmed}! `);
  }
  return `Hi ${trimmed}! ${baseGreeting}`;
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const topicConfig = getAssistantTopic(topic);
  const { userQuery, roadmap, accessibility, username, savedDocuments } = useAppStore();
  const agentConfigured = Boolean(getWorkflowId());
  const documentsContext = buildSavedDocumentsContext(savedDocuments);
  const [voiceDraft, setVoiceDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [sessionNonce, setSessionNonce] = useState(0);
  const dragBoundsRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stateVariables = {
    user_location: roadmap.location,
    active_service: roadmap.title,
    roadmap_progress: roadmap.progress,
    language: accessibility.language,
    explanation_style: accessibility.explanationStyle,
    user_name: username || "citizen",
    saved_documents_count: savedDocuments.length,
    saved_documents: documentsContext,
    help_topic: topic ?? "general",
  };

  const baseGreeting =
    topicConfig?.greeting ??
    "Hi! I'm GovFlow AI — your government services copilot for Ghana. What would you like help with today?";
  const greeting = personalizeGreeting(baseGreeting, username);

  const clearChatHistory = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CHATKIT_HISTORY_STORAGE_KEY);
    setSessionNonce((value) => value + 1);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleVoiceRecognition = () => {
    setVoiceError("");
    const speechApi =
      typeof window !== "undefined"
        ? ((window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor })
            .SpeechRecognition ||
          (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor })
            .webkitSpeechRecognition)
        : undefined;

    if (!speechApi) {
      setVoiceError("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new speechApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GH";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceDraft(transcript.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceError(`Voice recognition error: ${event.error}.`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <AppShell title="AI Assistant" showChat={false}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">GovFlow AI Assistant</h1>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearChatHistory}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              Delete chat history
            </Button>
          </div>
          <p className="text-muted">
            {agentConfigured
              ? topicConfig
                ? "Upload documents or ask questions — we'll guide you through this step."
                : "Chat with your OpenAI Agent Builder workflow for personalized government service guidance."
              : "Configure your Agent Builder workflow to enable the live AI assistant."}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <ChatKitWidget
            key={sessionNonce}
            className="h-[68vh] min-h-[500px]"
            enableFileUpload
            showStartScreen={false}
            initialPrompt={topicConfig?.initialPrompt ?? (userQuery || undefined)}
            draftText={voiceDraft || undefined}
            stateVariables={stateVariables}
            greeting={greeting}
            historyStorageKey={CHATKIT_HISTORY_STORAGE_KEY}
          />
        </div>
        {voiceError ? <p className="mt-3 text-sm text-red-600">{voiceError}</p> : null}
        {isListening ? (
          <p className="mt-2 text-sm text-primary">
            Listening... speak clearly. Your words are being added to the chat input.
          </p>
        ) : null}
      </div>

      <div ref={dragBoundsRef} className="pointer-events-none fixed inset-0 z-40">
        <motion.button
          type="button"
          drag
          dragMomentum={false}
          dragConstraints={dragBoundsRef}
          whileDrag={{ scale: 1.06 }}
          onClick={toggleVoiceRecognition}
          className={`pointer-events-auto absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition ${
            isListening
              ? "border-red-300 bg-red-500 text-white"
              : "border-primary/20 bg-white text-primary"
          }`}
          aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
          title={isListening ? "Stop voice recognition" : "Start voice recognition"}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>
      </div>
    </AppShell>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="AI Assistant" showChat={false}>
          <div className="mx-auto flex max-w-4xl items-center justify-center py-24 text-muted">
            Loading assistant...
          </div>
        </AppShell>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
