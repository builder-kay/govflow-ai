"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, ListPlus, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RiskAlertCard } from "@/components/RiskAlertCard";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { riskFactors, riskFixes } from "@/data/roadmap";

export default function RiskPage() {
  return (
    <AppShell title="Rejection Risk Checker">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Rejection Risk Checker</h1>
          <p className="text-muted">
            GovFlow checks your roadmap and documents for issues that may delay or block your
            application.
          </p>
        </div>

        <RiskAlertCard
          level="medium"
          title="Current Risk Level"
          description="Medium Risk — a few items need attention before you apply."
          className="mb-8"
        />

        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Risk factors
          </h2>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={factor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold text-foreground">
                      {index + 1}. {factor.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{factor.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Recommended fixes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {riskFixes.map((fix) => (
              <ActionButton
                key={fix.id}
                href={fix.href}
                variant="outline"
                className="h-auto justify-start py-4 text-left"
              >
                <ArrowRight className="h-4 w-4 shrink-0" />
                {fix.label}
              </ActionButton>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <ActionButton href="/checklist">Fix these issues</ActionButton>
          <ActionButton href="/assistant" variant="outline">
            <MessageCircle className="h-4 w-4" />
            Explain in simple English
          </ActionButton>
          <ActionButton href="/checklist" variant="ghost">
            <ListPlus className="h-4 w-4" />
            Add to checklist
          </ActionButton>
          <ActionButton href="/roadmap" variant="ghost">
            Continue roadmap
          </ActionButton>
        </div>
      </div>
    </AppShell>
  );
}
