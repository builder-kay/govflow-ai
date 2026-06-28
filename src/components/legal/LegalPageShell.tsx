"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import type { LegalDocument } from "@/data/legal";
import { LEGAL_OPERATOR, LEGAL_PRODUCT } from "@/data/legal";

interface LegalPageShellProps {
  document: LegalDocument;
  showNav?: boolean;
}

export function LegalPageShell({ document, showNav = true }: LegalPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image src="/govflow-mark.png" alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
            <span className="truncate font-bold text-foreground">{LEGAL_PRODUCT}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-10">
        <LegalDocumentView document={document} />
        {showNav ? (
          <div className="mt-10 border-t border-gray-100 pt-8">
            <p className="mb-3 text-sm font-semibold text-foreground">Related policies</p>
            <LegalNavLinks excludeSlug={document.slug} />
          </div>
        ) : null}
        <p className="mt-8 text-xs text-muted">
          © {new Date().getFullYear()} {LEGAL_OPERATOR}. All rights reserved.
        </p>
      </main>

      <Footer />
    </div>
  );
}
