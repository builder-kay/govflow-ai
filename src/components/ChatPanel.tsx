"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageCircle, X, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { getFoodBusinessResponse } from "@/lib/ai-mock";
import { getWorkflowId } from "@/lib/openai-config";

const ChatKitWidget = dynamic(
  () => import("@/components/chat/ChatKitWidget").then((m) => m.ChatKitWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center text-sm text-muted">
        Loading GovFlow AI agent...
      </div>
    ),
  }
);

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const { userQuery, roadmap, accessibility } = useAppStore();
  const agentConfigured = Boolean(getWorkflowId());
  const fallback = getFoodBusinessResponse();

  const stateVariables = {
    user_location: roadmap.location,
    active_service: roadmap.title,
    language: accessibility.language,
    explanation_style: accessibility.explanationStyle,
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:bottom-8 md:right-8"
        size="icon"
        aria-label="Open GovFlow AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-4 z-50 w-[calc(100vw-2rem)] max-w-md md:bottom-24 md:right-8"
          >
            <Card className="overflow-hidden shadow-2xl border-primary/20">
              <div className="flex items-center justify-between border-b border-gray-100 p-4 bg-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">GovFlow AI</p>
                    <p className="text-xs text-muted">
                      {agentConfigured ? "Powered by OpenAI Agent Builder" : "Demo mode"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label="Open full assistant">
                    <Link href="/assistant">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {agentConfigured ? (
                <ChatKitWidget
                  compact
                  className="bg-white"
                  initialPrompt={userQuery || undefined}
                  stateVariables={stateVariables}
                />
              ) : (
                <div className="space-y-4 p-4">
                  <div className="rounded-xl bg-soft-blue/50 p-4 text-sm leading-relaxed">
                    {fallback.content}
                  </div>
                  <p className="text-xs text-muted italic">
                    Connect your Agent Builder workflow to enable live AI responses.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fallback.quickActions?.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                      >
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
