"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scale, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { LegalContactCard } from "@/components/legal/LegalContactCard";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { LegalPageHeader } from "@/components/legal/LegalPageHeader";
import {
  ALL_LEGAL_DOCUMENTS,
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR,
  LEGAL_PRODUCT,
} from "@/data/legal";
import { Button } from "@/components/ui/button";

export default function LegalHubPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-primary/8 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <LegalPageHeader backHref="/" backLabel="Back home" />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-soft-blue/50 via-white to-emerald-50/30 p-6 shadow-sm md:p-8"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-primary shadow-sm">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Legal hub</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Policies that govern your use of {LEGAL_PRODUCT}, operated by {LEGAL_OPERATOR}. Review
            how we handle your data, cookies, usage rules, and important platform limits.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/80 px-3 py-1 text-xs font-medium text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Last updated {LEGAL_LAST_UPDATED}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/80 px-3 py-1 text-xs font-medium text-muted">
              {ALL_LEGAL_DOCUMENTS.length} documents
            </span>
          </div>
        </motion.div>

        <div className="mt-8">
          <LegalNavLinks variant="cards" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 md:p-6"
        >
          <p className="text-sm font-bold text-foreground">Before you continue</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            GovFlow is a preparation and guidance platform — not a government agency or legal advisor.
            Always confirm final requirements, fees, and timelines with the responsible official
            source before acting.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 bg-white">
            <Link href="/disclaimer">
              Read full disclaimer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-8 space-y-8">
          <LegalContactCard />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_LEGAL_DOCUMENTS.map((doc, index) => (
              <motion.div
                key={doc.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/${doc.slug}`}
                  className="block rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-center text-xs font-medium text-muted transition hover:border-primary/20 hover:text-primary"
                >
                  {doc.title}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} {LEGAL_OPERATOR}. All rights reserved.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
