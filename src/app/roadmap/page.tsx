"use client";

import { motion } from "framer-motion";
import {
  Save,
  ListChecks,
  Upload,
  ShieldAlert,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { RiskBadge } from "@/components/StatusBadge";
import { ActionButton } from "@/components/ActionButton";
import { useAppStore } from "@/store/useAppStore";

export default function RoadmapPage() {
  const { roadmap, hasCompletedQuestions } = useAppStore();
  const displayProgress = hasCompletedQuestions ? Math.max(roadmap.progress, 20) : roadmap.progress;

  return (
    <AppShell title="Your Roadmap">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Your Food Business Roadmap
          </h1>
          <p className="text-muted">
            Based on your answers, here is a step-by-step plan for starting a small food delivery
            business in Cape Coast.
          </p>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          <ActionButton href="/roadmaps" size="sm" variant="outline">
            <Save className="h-4 w-4" />
            Save roadmap
          </ActionButton>
          <ActionButton href="/checklist" size="sm" variant="outline">
            <ListChecks className="h-4 w-4" />
            Open checklist
          </ActionButton>
          <ActionButton href="/documents" size="sm" variant="outline">
            <Upload className="h-4 w-4" />
            Upload document
          </ActionButton>
          <ActionButton href="/risk" size="sm" variant="outline">
            <ShieldAlert className="h-4 w-4" />
            Check rejection risk
          </ActionButton>
          <ActionButton href="/offices" size="sm" variant="outline">
            <MapPin className="h-4 w-4" />
            Find offices
          </ActionButton>
        </div>

        <Card className="mb-8 border-primary/10">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted">Business type</p>
                <p className="font-semibold">{roadmap.businessType}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Location</p>
                <p className="flex items-center gap-1 font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  {roadmap.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Estimated time</p>
                <p className="flex items-center gap-1 font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  {roadmap.estimatedTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Risk level</p>
                <RiskBadge level={roadmap.riskLevel} />
              </div>
            </div>

            <div className="mt-6">
              <ProgressBar value={displayProgress} showLabel />
            </div>

            <div className="mt-4 rounded-xl bg-soft-blue/50 p-4">
              <p className="text-sm font-medium text-muted">Main next step</p>
              <p className="font-semibold text-primary-dark">{roadmap.mainNextStep}</p>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <Building2 className="h-5 w-5 text-primary" />
            Your roadmap steps
          </h2>
          <RoadmapTimeline steps={roadmap.steps} />
        </section>

        <p className="mt-8 text-sm text-muted italic">
          Fees may vary by service type, location, category, or agency updates. GovFlow shows
          guidance and reminders, not final official charges.
        </p>
      </div>
    </AppShell>
  );
}
