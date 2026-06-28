"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ChevronDown, ChevronUp, ExternalLink, LifeBuoy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getChecklistItemExtras } from "@/data/checklist-help";
import { cn } from "@/lib/utils";
import type { ServiceStepGuide, ServiceStepTask } from "@/types";

interface StepGuideTaskCardProps {
  task: ServiceStepTask;
  index: number;
  completed: boolean;
  onToggle: () => void;
}

export function StepGuideTaskCard({ task, index, completed, onToggle }: StepGuideTaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const extras = task.checklistItemId ? getChecklistItemExtras(task.checklistItemId) : {};
  const resourceLink = extras.resourceLink;
  const helpActions = extras.helpActions;

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
        completed ? "border-emerald-200 bg-emerald-50/40" : "border-gray-100"
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={completed}
          onCheckedChange={onToggle}
          className="mt-1"
          aria-label={`Mark ${task.label} as complete`}
        />
        <div className="min-w-0 flex-1">
          <p className={cn("font-semibold text-foreground", completed && "text-muted line-through")}>
            {index + 1}. {task.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{task.description}</p>

          {(resourceLink || helpActions?.length) && (
            <div className="mt-4 rounded-xl border border-primary/15 bg-soft-blue/20 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-dark">
                <LifeBuoy className="h-4 w-4" />
                Need help with this?
              </p>
              <div className="flex flex-col items-start gap-2">
                {resourceLink ? (
                  <a
                    href={resourceLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {resourceLink.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {helpActions?.map((action) =>
                  action.external ? (
                    <a
                      key={action.href}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {action.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link key={action.href} href={action.href} className="text-sm font-medium text-primary hover:underline">
                      {action.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          {task.whyItMatters ? (
            <>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Why this matters
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expanded ? (
                <p className="mt-2 rounded-lg bg-soft-blue/50 p-3 text-sm text-primary-dark">{task.whyItMatters}</p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}

interface StepGuideViewProps {
  guide: ServiceStepGuide;
  stepNumber: number;
  totalSteps: number;
  checklistCompleted: Record<string, boolean>;
  onToggleChecklistItem: (id: string) => void;
  localCompleted: Record<string, boolean>;
  onToggleLocal: (taskId: string) => void;
  officialLinks: { label: string; href: string }[];
  serviceTitle: string;
  backHref: string;
  prevHref?: string;
  nextHref?: string;
  questionsHref?: string;
  continueServiceHref?: string;
  showPersonalizeRoadmap?: boolean;
}

export function StepGuideView({
  guide,
  stepNumber,
  totalSteps,
  checklistCompleted,
  onToggleChecklistItem,
  localCompleted,
  onToggleLocal,
  officialLinks,
  serviceTitle,
  backHref,
  prevHref,
  nextHref,
  questionsHref = "/questions",
  continueServiceHref,
  showPersonalizeRoadmap = false,
}: StepGuideViewProps) {
  const taskProgress = useMemo(() => {
    const done = guide.tasks.filter((task) => {
      if (task.checklistItemId && checklistCompleted[task.checklistItemId]) return true;
      return localCompleted[task.id];
    }).length;
    return Math.round((done / Math.max(guide.tasks.length, 1)) * 100);
  }, [guide.tasks, checklistCompleted, localCompleted]);

  const handleToggle = (task: ServiceStepTask) => {
    if (task.checklistItemId && task.checklistItemId in checklistCompleted) {
      onToggleChecklistItem(task.checklistItemId);
      return;
    }
    onToggleLocal(task.id);
  };

  const isTaskDone = (task: ServiceStepTask) => {
    if (task.checklistItemId && checklistCompleted[task.checklistItemId]) return true;
    return localCompleted[task.id];
  };

  const allTasksDone = taskProgress === 100;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="mb-6 inline-flex text-sm font-medium text-primary hover:underline">
        ← Back to {serviceTitle}
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="mb-2 text-sm font-semibold text-primary">
          Step {stepNumber} of {totalSteps}
        </p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">{guide.title}</h1>
        <p className="mb-3 flex items-center gap-2 text-sm text-muted">
          <Building2 className="h-4 w-4 shrink-0 text-primary" />
          {guide.agency}
        </p>
        <p className="leading-relaxed text-muted">{guide.summary}</p>
      </motion.div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Step progress</span>
          <span className="text-muted">{taskProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${taskProgress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {officialLinks.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {officialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-soft-blue/50"
            >
              {link.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      ) : null}

      <ol className="mb-8 space-y-4">
        {guide.tasks.map((task, index) => (
          <StepGuideTaskCard
            key={task.id}
            task={task}
            index={index}
            completed={isTaskDone(task)}
            onToggle={() => handleToggle(task)}
          />
        ))}
      </ol>

      {allTasksDone ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900"
        >
          Step complete. Continue with the remaining service steps or open your checklist to track
          overall progress.
        </motion.div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-6">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Previous step
          </Link>
        ) : null}
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Next step
          </Link>
        ) : continueServiceHref ? (
          <Link
            href={continueServiceHref}
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Continue service steps
          </Link>
        ) : null}
        {showPersonalizeRoadmap ? (
          <Link
            href={questionsHref}
            className="inline-flex items-center rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary hover:bg-soft-blue/50"
          >
            Personalize full roadmap
          </Link>
        ) : null}
        {guide.assistantTopic ? (
          <Link
            href={`/assistant?topic=${guide.assistantTopic}`}
            className="inline-flex items-center rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary hover:bg-soft-blue/50"
          >
            Ask AI about this step
          </Link>
        ) : null}
        <Link
          href="/checklist"
          className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground"
        >
          Open full checklist
        </Link>
      </div>
    </div>
  );
}
