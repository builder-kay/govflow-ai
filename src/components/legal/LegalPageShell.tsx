"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { LegalContactCard } from "@/components/legal/LegalContactCard";
import { LegalDocumentHero } from "@/components/legal/LegalDocumentHero";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { LegalPageHeader } from "@/components/legal/LegalPageHeader";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import type { LegalDocument } from "@/data/legal";
import { LEGAL_OPERATOR } from "@/data/legal";
import { estimateReadingMinutes, getLegalDocumentMeta } from "@/lib/legal-meta";

interface LegalPageShellProps {
  document: LegalDocument;
  showNav?: boolean;
}

function collectDocumentText(document: LegalDocument): string {
  return document.sections
    .flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])])
    .join(" ");
}

export function LegalPageShell({ document, showNav = true }: LegalPageShellProps) {
  const meta = getLegalDocumentMeta(document.slug);
  const readingMinutes = estimateReadingMinutes(collectDocumentText(document));

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-40 right-0 h-48 w-48 rounded-full bg-soft-blue blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <LegalPageHeader backHref="/" backLabel="Back home" />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-10">
        <LegalDocumentHero document={document} meta={meta} readingMinutes={readingMinutes} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-10">
          <div className="hidden lg:block">
            <LegalTableOfContents sections={document.sections} meta={meta} />
          </div>

          <div className="min-w-0">
            <div className="mb-6 lg:hidden">
              <details className="group rounded-2xl border border-gray-100 bg-white shadow-sm">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground marker:content-none">
                  <span className="flex items-center justify-between">
                    Jump to section
                    <span className="text-xs font-normal text-muted group-open:hidden">Tap to expand</span>
                    <span className="hidden text-xs font-normal text-muted group-open:inline">Tap to collapse</span>
                  </span>
                </summary>
                <div className="border-t border-gray-100 px-2 pb-3 pt-1">
                  <LegalTableOfContents sections={document.sections} meta={meta} embedded />
                </div>
              </details>
            </div>

            <LegalDocumentView document={document} meta={meta} />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <LegalContactCard />

          {showNav ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
            >
              <p className="mb-4 text-sm font-semibold text-foreground">Related policies</p>
              <LegalNavLinks excludeSlug={document.slug} />
            </motion.div>
          ) : null}

          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} {LEGAL_OPERATOR}. All rights reserved.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
