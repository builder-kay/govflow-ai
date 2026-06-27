"use client";

import { useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ProgressBar } from "@/components/ui/progress";
import { ActionButton } from "@/components/ActionButton";
import { NoticeCard } from "@/components/NoticeCard";
import { useAppStore, getChecklistProgress } from "@/store/useAppStore";
import { getServiceFlow } from "@/lib/service-registry";

export default function ChecklistPage() {
  const { checklist, toggleChecklistItem, currentServiceId } = useAppStore();
  const flow = getServiceFlow(currentServiceId);
  const progress = getChecklistProgress(checklist);
  const remainingItems = checklist.filter((item) => !item.completed).length;

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
          <h1 className="mb-2 text-3xl font-bold text-foreground">{flow.checklistTitle}</h1>
          <p className="text-muted">{flow.checklistDescription}</p>
        </div>

        <div className="mb-6">
          <ProgressBar value={progress} showLabel size="lg" />
        </div>

        {remainingItems > 0 ? (
          <NoticeCard
            variant={remainingItems >= 3 ? "warning" : "info"}
            title={`${remainingItems} checklist item${remainingItems === 1 ? "" : "s"} remaining`}
            description="Complete required items first to reduce delays and rejection risk."
            className="mb-6"
          />
        ) : (
          <NoticeCard
            variant="success"
            title="Checklist completed"
            description="Great progress. Do one final review before submitting."
            className="mb-6"
          />
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <ActionButton href="/risk" size="sm">
            <ShieldAlert className="h-4 w-4" />
            Check rejection risk
          </ActionButton>
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
