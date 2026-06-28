"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 -mx-4 border-b border-white/60 bg-background/80 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-2xl border border-primary/10 bg-white p-1 shadow-sm"
          >
            <Image src="/govflow-mark.png" alt="" width={44} height={44} className="h-11 w-11" />
          </motion.div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-foreground">GovFlow AI</p>
            <p className="truncate text-xs text-muted sm:text-sm">Government Copilot for Ghana</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="#services">Services</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/auth">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth?next=%2Fhome">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
