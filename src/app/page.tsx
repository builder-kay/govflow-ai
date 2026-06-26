"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Smartphone,
  CheckSquare,
  Building2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">GovFlow AI</p>
            <p className="text-sm text-muted">Government Copilot for Ghana</p>
          </div>
        </motion.div>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Government services made simple.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted md:text-xl">
              Tell GovFlow what you want to do. We turn it into a clear step-by-step plan with
              documents, timelines, risk checks, and next actions.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/home">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-muted">
              GovFlow helps you prepare and understand government processes. Official applications
              are still completed through the relevant government portals and offices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-primary/10 shadow-lg">
              <CardContent className="p-8">
                <div className="relative mx-auto max-w-sm">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-soft-blue">
                        <Smartphone className="h-12 w-12 text-primary" />
                      </div>
                      <div className="absolute -right-4 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold shadow-md">
                        <MessageCircle className="h-5 w-5 text-primary-dark" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                      <CheckSquare className="mx-auto mb-2 h-8 w-8 text-success" />
                      <p className="text-sm font-semibold">Checklist</p>
                    </div>
                    <div className="rounded-2xl bg-soft-blue p-4 text-center">
                      <Building2 className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-sm font-semibold">Offices</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-primary/5 p-4">
                    <p className="text-sm font-medium text-primary-dark">
                      &ldquo;Start a food delivery business in Cape Coast&rdquo;
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      → 6-step roadmap with documents & risk checks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            "AI Roadmaps",
            "Smart Checklists",
            "Document Explainer",
            "Risk Checker",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-xl bg-white p-4 text-center text-sm font-semibold text-primary-dark shadow-sm"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
