"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const heroStats = [
  { label: "Guided roadmaps", icon: MapPinned },
  { label: "Safer applications", icon: ShieldCheck },
  { label: "AI document help", icon: Sparkles },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-6 md:pt-10">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-soft-blue blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-100/80 blur-3xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-primary-dark shadow-sm backdrop-blur-sm"
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            Professional guidance for everyday government services
          </motion.p>

          <motion.h1
            variants={item}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]"
          >
            Clear government steps,{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              from confusion to completion.
            </span>
          </motion.h1>

          <motion.p variants={item} className="mb-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            GovFlow AI helps citizens navigate complex service processes with confidence. Get
            roadmaps, checklists, document guidance, and risk alerts in one modern platform.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="/auth?next=%2Fhome">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#services">Explore Services</Link>
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-2">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.span
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {stat.label}
                </motion.span>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white p-1 shadow-2xl shadow-primary/10">
              <Image
                src="/landing-hero.svg"
                alt="GovFlow dashboard preview"
                width={1200}
                height={760}
                className="h-auto w-full rounded-[1.25rem]"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="absolute -left-2 top-8 z-20 hidden rounded-2xl border border-emerald-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:block"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Checklist sync</p>
            <p className="text-sm font-bold text-emerald-700">68% complete</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="absolute -right-2 bottom-12 z-20 hidden rounded-2xl border border-primary/15 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:block"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Next step</p>
            <p className="text-sm font-bold text-primary-dark">Book PAC appointment</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
