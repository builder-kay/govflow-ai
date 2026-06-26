"use client";

import { useMemo } from "react";
import { ShieldAlert, Download, Save, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ProgressBar } from "@/components/ui/progress";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { useAppStore, getChecklistProgress } from "@/store/useAppStore";

export default function ChecklistPage() {
  const { checklist, toggleChecklistItem } = useAppStore();
  const progress = getChecklistProgress(checklist);

  const sections = useMemo(() => {
    const grouped: Record<string, typeof checklist> = {};
    checklist.forEach((item) => {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push(item);
    });
    return grouped;
  }, [checklist]);

  return (
    <AppShell title="Checklist">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Food Business Startup Checklist
          </h1>
          <p className="text-muted">
            Track every task you need to complete for your food delivery business in Cape Coast.
          </p>
        </div>

        <div className="mb-6">
          <ProgressBar value={progress} showLabel size="lg" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <ActionButton href="/risk" size="sm">
            <ShieldAlert className="h-4 w-4" />
            Check rejection risk
          </ActionButton>
          <Button size="sm" variant="outline" disabled title="Demo mode">
            <Download className="h-4 w-4" />
            Download checklist
          </Button>
          <Button size="sm" variant="outline" disabled title="Auto-saved in demo">
            <Save className="h-4 w-4" />
            Save progress
          </Button>
          <Button size="sm" variant="ghost" disabled title="Demo mode">
            <Plus className="h-4 w-4" />
            Add custom task
          </Button>
        </div>

        <div className="space-y-8">
          {Object.entries(sections).map(([section, items]) => (
            <section key={section}>
              <h2 className="mb-4 text-xl font-bold text-foreground">{section}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <ChecklistItem key={item.id} item={item} onToggle={toggleChecklistItem} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
