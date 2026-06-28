import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Scale, Shield, Cookie } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import {
  ALL_LEGAL_DOCUMENTS,
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR,
  LEGAL_PRODUCT,
} from "@/data/legal";

const ICONS = {
  terms: Scale,
  privacy: Shield,
  cookies: Cookie,
  disclaimer: FileText,
} as const;

export default function LegalHubPage() {
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
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Legal</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Policies that govern your use of {LEGAL_PRODUCT}, operated by {LEGAL_OPERATOR}. Last
          updated {LEGAL_LAST_UPDATED}.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ALL_LEGAL_DOCUMENTS.map((doc) => {
            const Icon = ICONS[doc.slug as keyof typeof ICONS] ?? FileText;
            return (
              <Link
                key={doc.slug}
                href={`/${doc.slug}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-primary/25 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-soft-blue">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-bold text-foreground">{doc.title}</p>
                <p className="mt-1 text-sm text-muted">{doc.summary}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <LegalNavLinks />
        </div>
      </main>

      <Footer />
    </div>
  );
}
