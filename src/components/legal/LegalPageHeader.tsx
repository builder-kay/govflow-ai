"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LEGAL_PRODUCT } from "@/data/legal";

interface LegalPageHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function LegalPageHeader({ backHref = "/", backLabel = "Back" }: LegalPageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 border-b border-white/60 bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="overflow-hidden rounded-xl border border-primary/10 bg-white p-0.5 shadow-sm">
            <Image src="/govflow-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground md:text-base">{LEGAL_PRODUCT}</p>
            <p className="hidden truncate text-xs text-muted sm:block">Legal & policies</p>
          </div>
        </Link>
        <Link
          href={backHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm transition hover:border-primary/20 hover:bg-soft-blue/40"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </motion.header>
  );
}
