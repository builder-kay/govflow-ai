"use client";

import { BarChart3, BellRing, CheckCircle2, Hourglass } from "lucide-react";
import type { RelayCaseMetrics } from "@/types/relay";

interface RelayMetricsCardsProps {
  metrics: RelayCaseMetrics;
}

export function RelayMetricsCards({ metrics }: RelayMetricsCardsProps) {
  const cards = [
    {
      label: "Total Agent cases",
      value: String(metrics.totalCases),
      icon: BarChart3,
    },
    {
      label: "Completed",
      value: String(metrics.completedCases),
      icon: CheckCircle2,
    },
    {
      label: "Avg first action",
      value: `${metrics.averageFirstActionHours}h`,
      icon: Hourglass,
    },
    {
      label: "Presence alerts sent",
      value: String(metrics.presenceAlertsSent),
      icon: BellRing,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Icon className="h-5 w-5 text-primary" />
              {card.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}
