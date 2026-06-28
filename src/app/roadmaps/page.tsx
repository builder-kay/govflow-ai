"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RoadmapsHero } from "@/components/roadmaps/RoadmapsHero";
import { RoadmapInstanceCard } from "@/components/roadmaps/RoadmapInstanceCard";
import { ActionButton } from "@/components/ActionButton";
import { useAppStore } from "@/store/useAppStore";
import {
  getRoadmapStats,
  SERVICE_DISPLAY_NAMES,
  sortRoadmapInstances,
} from "@/lib/roadmap-instances";
import { Plus, Sparkles } from "lucide-react";

type PendingAction =
  | { type: "pause"; serviceId: string; title: string }
  | { type: "delete"; serviceId: string; title: string }
  | null;

export default function RoadmapsPage() {
  const router = useRouter();
  const {
    accessibility,
    currentServiceId,
    roadmapInstances,
    loadRoadmapInstance,
    pauseRoadmap,
    deleteRoadmap,
  } = useAppStore();

  const reduceMotion = accessibility.reduceAnimations;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const items = useMemo(
    () => sortRoadmapInstances(roadmapInstances, currentServiceId),
    [roadmapInstances, currentServiceId]
  );

  const stats = useMemo(() => getRoadmapStats(items), [items]);
  const activeServiceLabel =
    (currentServiceId && SERVICE_DISPLAY_NAMES[currentServiceId]) || "None selected";

  const handleContinue = (serviceId: string) => {
    loadRoadmapInstance(serviceId);
    router.push("/roadmap");
  };

  const handleOpenWithService = (serviceId: string, href: string) => {
    loadRoadmapInstance(serviceId);
    router.push(href);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "pause") {
      pauseRoadmap(pendingAction.serviceId);
    } else {
      deleteRoadmap(pendingAction.serviceId);
    }

    setPendingAction(null);
  };

  return (
    <AppShell title="My Roadmaps">
      <div className="mx-auto max-w-5xl space-y-6">
        <RoadmapsHero
          total={stats.total}
          averageProgress={stats.averageProgress}
          atRiskCount={stats.atRiskCount}
          pausedCount={stats.pausedCount}
          activeServiceLabel={activeServiceLabel}
          reduceMotion={reduceMotion}
        />

        {items.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
              <RoadmapInstanceCard
                key={item.serviceId}
                item={item}
                index={index}
                reduceMotion={reduceMotion}
                onContinue={handleContinue}
                onPause={(serviceId) =>
                  setPendingAction({
                    type: "pause",
                    serviceId,
                    title: item.title,
                  })
                }
                onResume={handleContinue}
                onDelete={(serviceId) =>
                  setPendingAction({
                    type: "delete",
                    serviceId,
                    title: item.title,
                  })
                }
                onNavigate={(serviceId, href) => handleOpenWithService(serviceId, href)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center"
          >
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="text-lg font-semibold text-foreground">No roadmaps yet</p>
            <p className="mt-2 text-sm text-muted">
              Start a service to create your first synced roadmap.
            </p>
            <ActionButton href="/services" className="mt-4">
              <Plus className="h-4 w-4" />
              Browse services
            </ActionButton>
          </motion.div>
        )}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/15 bg-soft-blue/30 p-5"
        >
          <p className="font-semibold text-primary-dark">Start another roadmap</p>
          <p className="mt-1 text-sm text-muted">
            Each service keeps its own checklist progress. Switch between roadmaps anytime without
            losing your place.
          </p>
          <ActionButton href="/services" className="mt-3" size="sm" variant="outline">
            Browse all services
          </ActionButton>
        </motion.div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? `Delete "${pendingAction.title}"?`
            : `Pause "${pendingAction?.title}"?`
        }
        description={
          pendingAction?.type === "delete"
            ? "This removes the saved roadmap and all checklist progress for this service on this device. This cannot be undone."
            : "Your progress stays saved, but this roadmap will be marked paused until you resume it."
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete roadmap" : "Pause roadmap"}
        cancelLabel="Keep roadmap"
        variant={pendingAction?.type === "delete" ? "danger" : "warning"}
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />
    </AppShell>
  );
}
