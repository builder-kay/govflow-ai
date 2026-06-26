"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getFoodBusinessResponse } from "@/lib/ai-mock";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const response = getFoodBusinessResponse();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:bottom-8 md:right-8"
        size="icon"
        aria-label="Open AI assistant"
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
            <Card className="shadow-2xl border-primary/20">
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">GovFlow Assistant</p>
                    <p className="text-xs text-muted">Here to help you prepare</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <CardContent className="max-h-80 overflow-y-auto p-4 space-y-4">
                <div className="rounded-xl bg-soft-blue/50 p-4 text-sm leading-relaxed">
                  {response.content}
                </div>
                <p className="text-xs text-muted italic">
                  GovFlow helps you prepare — official applications are completed through government portals.
                </p>
                <div className="flex flex-wrap gap-2">
                  {response.quickActions?.map((action) => (
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
              </CardContent>

              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask GovFlow anything..."
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button size="icon" aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
