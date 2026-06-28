"use client";

import { motion } from "framer-motion";
import { Brain, MessageCircle, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Upload,
    title: "Upload your form or notice",
    description: "PDF, photo, Word doc, or text — e.g. a rejected Form A or FDA letter.",
  },
  {
    icon: Brain,
    title: "GovFlow reads and remembers",
    description: "We extract key details, rejection reasons, and missing fields on this device.",
  },
  {
    icon: MessageCircle,
    title: "Discuss it in AI chat",
    description: "Open the assistant anytime — it already knows what you uploaded.",
  },
];

interface DocumentsHowItWorksProps {
  reduceMotion?: boolean;
  className?: string;
}

export function DocumentsHowItWorks({ reduceMotion = false, className }: DocumentsHowItWorksProps) {
  const Wrapper = reduceMotion ? "div" : motion.div;
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay: 0.08 },
      };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-soft-blue/80 via-white to-amber-50/40 p-5 shadow-sm md:p-6",
        className
      )}
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">How documents work</p>
          <p className="mt-1 text-sm text-muted">
            Upload once here — GovFlow saves what it reads so the AI can help you fix rejections,
            missing fields, and next steps without starting over.
          </p>
        </div>
      </div>

      <ol className="relative mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const Item = reduceMotion ? "li" : motion.li;
          const itemProps = reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.35, delay: 0.15 + index * 0.08 },
              };

          return (
            <Item
              key={step.title}
              {...itemProps}
              className="rounded-xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
            </Item>
          );
        })}
      </ol>
    </Wrapper>
  );
}
