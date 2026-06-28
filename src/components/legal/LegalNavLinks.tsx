"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ALL_LEGAL_DOCUMENTS, LEGAL_LINKS } from "@/data/legal";
import { getLegalDocumentMeta } from "@/lib/legal-meta";
import { cn } from "@/lib/utils";

interface LegalNavLinksProps {
  excludeSlug?: string;
  className?: string;
  variant?: "list" | "inline" | "cards";
  activeSlug?: string;
}

export function LegalNavLinks({
  excludeSlug,
  className,
  variant = "list",
  activeSlug,
}: LegalNavLinksProps) {
  if (variant === "inline") {
    return (
      <nav className={cn("flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs", className)}>
        {LEGAL_LINKS.filter((link) => link.href !== "/legal").map((link) => {
          const slug = link.href.replace("/", "");
          const isActive = activeSlug === slug;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "underline-offset-2 transition hover:text-primary hover:underline",
                isActive ? "font-semibold text-primary" : "text-muted"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  if (variant === "cards") {
    return (
      <nav className={cn("grid gap-3 sm:grid-cols-2", className)}>
        {ALL_LEGAL_DOCUMENTS.map((doc, index) => {
          const meta = getLegalDocumentMeta(doc.slug);
          const Icon = meta.icon;
          const isActive = activeSlug === doc.slug;
          const isExcluded = doc.slug === excludeSlug;

          if (isExcluded) return null;

          return (
            <motion.div
              key={doc.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={`/${doc.slug}`}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md",
                  isActive ? "border-primary/30 ring-2 ring-primary/10" : "border-gray-100 hover:border-primary/20"
                )}
              >
                <div className={cn("h-1 bg-gradient-to-r", meta.accentBar)} />
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", meta.iconWrap)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="font-bold text-foreground">{doc.title}</p>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted">{doc.summary}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {ALL_LEGAL_DOCUMENTS.filter((doc) => doc.slug !== excludeSlug).map((doc) => {
        const meta = getLegalDocumentMeta(doc.slug);
        const Icon = meta.icon;

        return (
          <Link
            key={doc.slug}
            href={`/${doc.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:border-primary/25 hover:shadow-sm"
          >
            <div className={cn("h-0.5 bg-gradient-to-r opacity-80", meta.accentBar)} />
            <div className="flex gap-3 px-4 py-3">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.iconWrap)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{doc.summary}</p>
              </div>
            </div>
          </Link>
        );
      })}
      <Link
        href="/legal"
        className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50/50 transition hover:border-primary/25 hover:bg-soft-blue/20 sm:col-span-2"
      >
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Legal hub</p>
          <p className="mt-0.5 text-xs text-muted">Browse all policies in one place</p>
        </div>
      </Link>
    </nav>
  );
}
