"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckSquare,
  Clock3,
  FileText,
  MapPinned,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { LEGAL_OPERATOR } from "@/data/legal";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white p-1 shadow-sm">
              <Image src="/govflow-mark.png" alt="GovFlow AI logo" width={48} height={48} className="h-12 w-12" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">GovFlow AI</p>
              <p className="text-sm text-muted">Government Copilot for Ghana</p>
            </div>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/services">Explore Services</Link>
          </Button>
        </motion.div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
              <BadgeCheck className="h-3.5 w-3.5" />
              Professional guidance for everyday government services
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Clear government steps, from confusion to completion.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted md:text-xl">
              GovFlow AI helps citizens navigate complex service processes with confidence. Get
              roadmaps, checklists, document guidance, and risk alerts in one modern platform.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth?next=%2Fhome">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <p className="font-semibold text-foreground">Guided roadmaps</p>
                <p className="mt-1 text-muted">Step-by-step actions tailored to each service.</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <p className="font-semibold text-foreground">Safer applications</p>
                <p className="mt-1 text-muted">Risk cues and reminders before submission.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/landing-hero.svg"
              alt="GovFlow dashboard preview"
              width={1200}
              height={760}
              className="h-auto w-full rounded-2xl border border-primary/10 bg-white shadow-lg"
              priority
            />
          </motion.div>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">What this platform helps you do</h2>
            <p className="text-sm text-muted">Designed for clarity, speed, and confidence.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-primary/10">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-soft-blue text-primary">
                  <MapPinned className="h-5 w-5" />
                </div>
                <p className="font-bold text-foreground">Build a roadmap</p>
                <p className="mt-1 text-sm text-muted">
                  Get a clean sequence of actions, documents, and agencies for your exact goal.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="font-bold text-foreground">Understand documents</p>
                <p className="mt-1 text-sm text-muted">
                  Upload forms and notices to see important sections, risk points, and next steps.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="font-bold text-foreground">Reduce mistakes</p>
                <p className="mt-1 text-sm text-muted">
                  See warning signs early and fix likely rejection points before submission.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden border-primary/10">
            <CardContent className="p-0">
              <Image
                src="/landing-roadmap.svg"
                alt="Roadmap and progress visualization"
                width={900}
                height={560}
                className="h-auto w-full"
              />
              <div className="p-5">
                <p className="font-bold text-foreground">Roadmaps with progress intelligence</p>
                <p className="mt-1 text-sm text-muted">
                  Track where you are, what is pending, and what to prioritize next.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/10">
            <CardContent className="p-0">
              <Image
                src="/landing-documents.svg"
                alt="Document guidance and analysis preview"
                width={900}
                height={560}
                className="h-auto w-full"
              />
              <div className="p-5">
                <p className="font-bold text-foreground">Documents connected across services</p>
                <p className="mt-1 text-sm text-muted">
                  Keep uploaded documents organized and referenced in chat and service guidance.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-lg font-bold text-foreground">How GovFlow works</p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-primary" />
                  Tell GovFlow your goal (e.g., passport, business registration, Ghana Card).
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="mt-0.5 h-4 w-4 text-primary" />
                  Receive roadmap steps, checklist items, and office guidance.
                </li>
                <li className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  Track progress and resolve risks before making official submissions.
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-lg font-bold text-foreground">Important notice</p>
              <p className="text-sm leading-relaxed text-muted">
                GovFlow AI is a preparation and guidance platform. Official applications are still
                completed through government portals and physical offices. Always confirm final fees,
                forms, and timelines from official sources.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
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
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-gray-100 pt-8 text-center">
          <LegalNavLinks variant="inline" className="mb-4" />
          <p className="text-xs text-muted">
            Built and managed by {LEGAL_OPERATOR} © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
