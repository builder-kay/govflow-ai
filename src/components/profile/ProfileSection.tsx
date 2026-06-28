"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  reduceMotion?: boolean;
}

export function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
  className,
  delay = 0,
  reduceMotion = false,
}: ProfileSectionProps) {
  const Wrapper = reduceMotion ? "section" : motion.section;

  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.4, ease: "easeOut" as const },
      };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:rounded-3xl",
        className
      )}
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-soft-blue/40 to-white px-5 py-4 md:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </Wrapper>
  );
}
