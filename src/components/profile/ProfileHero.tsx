"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Sparkles,
  Map,
  FileText,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHeroProps {
  username: string;
  activeServiceLabel: string;
  roadmapProgress: number;
  savedDocumentsCount: number;
  mode: "simple" | "quick";
  reduceMotion?: boolean;
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "GF";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function ProfileHero({
  username,
  activeServiceLabel,
  roadmapProgress,
  savedDocumentsCount,
  mode,
  reduceMotion = false,
}: ProfileHeroProps) {
  const displayName = username.trim() || "GovFlow user";
  const initials = getInitials(username.trim() || "GovFlow");

  const Wrapper = reduceMotion ? "section" : motion.section;
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      };

  const quickLinks = [
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/assistant", label: "Assistant", icon: MessageCircle },
  ];

  return (
    <Wrapper
      {...wrapperProps}
      className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/40 shadow-sm"
    >
      <div className="p-5 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-white shadow-lg shadow-primary/25 md:h-20 md:w-20 md:text-2xl"
            >
              {initials}
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                <User className="h-3 w-3 text-white" />
              </span>
            </motion.div>
            <div className="min-w-0">
              <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
                <Sparkles className="h-3 w-3" />
                Your GovFlow profile
              </p>
              <h1 className="truncate text-2xl font-bold text-foreground md:text-3xl">{displayName}</h1>
              <p className="text-sm text-muted">Personalize guidance, accessibility, and assistant greetings.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                mode === "simple"
                  ? "bg-soft-blue text-primary-dark"
                  : "bg-gray-100 text-foreground"
              )}
            >
              {mode === "simple" ? "Simple mode" : "Quick mode"}
            </span>
            <span className="rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-muted">
              Signed in
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Active service", value: activeServiceLabel },
            { label: "Roadmap progress", value: `${roadmapProgress}%` },
            { label: "Saved documents", value: String(savedDocumentsCount) },
            {
              label: "Assistant greets you as",
              value: username.trim() ? `Hi ${username.trim()}` : "Hi there",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.05 }}
              className="rounded-2xl border border-gray-100 bg-white/90 p-3 shadow-sm md:p-4"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted md:text-xs">
                {stat.label}
              </p>
              <p className="mt-1 truncate text-sm font-bold text-foreground md:text-base">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                {link.label}
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
              </Link>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}
