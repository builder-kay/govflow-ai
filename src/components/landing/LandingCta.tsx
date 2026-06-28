"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 text-center md:mt-20"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-dark px-6 py-10 text-white shadow-xl shadow-primary/25 md:px-12 md:py-14">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to simplify your next government step?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
            Join GovFlow AI and turn confusing processes into clear, trackable progress.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-6 bg-white text-primary-dark hover:bg-white/90"
          >
            <Link href="/auth?next=%2Fhome">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
