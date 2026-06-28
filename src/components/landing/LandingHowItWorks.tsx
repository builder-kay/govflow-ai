"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckSquare,
  Clock3,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: MessageCircle,
    title: "Tell GovFlow your goal",
    description: "Passport, business registration, Ghana Card, National Service, and more.",
  },
  {
    icon: CheckSquare,
    title: "Follow your roadmap",
    description: "Checklist items, office guidance, and step-by-step actions tailored to you.",
  },
  {
    icon: Clock3,
    title: "Track and fix risks",
    description: "Resolve likely rejection points before official submissions.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="mt-16 md:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/40 p-6 shadow-sm md:p-8"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
              <Sparkles className="h-3.5 w-3.5" />
              How it works
            </p>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Three steps to clarity</h2>
            <ol className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 rounded-2xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft-blue text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-bold text-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {index + 1}
                        </span>
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">{step.description}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col justify-center rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 md:p-6"
          >
            <p className="text-lg font-bold text-foreground">Important notice</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              GovFlow AI is a preparation and guidance platform. Official applications are still
              completed through government portals and physical offices. Always confirm final fees,
              forms, and timelines from official sources.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/auth?next=%2Fhome">
                  Start with GovFlow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services">
                  <Building2 className="h-4 w-4" />
                  View Service Catalog
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
