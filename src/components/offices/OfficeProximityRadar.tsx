"use client";

import { motion } from "framer-motion";
import { LocateFixed, Loader2, MapPin } from "lucide-react";
import { getOfficeMeta } from "@/lib/office-meta";
import { cn } from "@/lib/utils";

interface RadarOffice {
  id: string;
  name: string;
  distanceKm: number | null;
}

interface OfficeProximityRadarProps {
  offices: RadarOffice[];
  selectedId: string | null;
  hasUserLocation: boolean;
  locating: boolean;
  onSelect: (id: string) => void;
  onLocate: () => void;
}

export function OfficeProximityRadar({
  offices,
  selectedId,
  hasUserLocation,
  locating,
  onSelect,
  onLocate,
}: OfficeProximityRadarProps) {
  const nearestId = offices.find((o) => o.distanceKm != null)?.id ?? null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/40 p-6 text-white shadow-lg md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      </div>

      {hasUserLocation ? (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/20"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.15, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Live proximity</p>
          <p className="text-lg font-bold">
            {hasUserLocation ? "Offices ranked by distance" : "Enable location to rank nearby offices"}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={onLocate}
          disabled={locating}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            hasUserLocation
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-white text-slate-900 hover:bg-white/90"
          )}
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          {locating ? "Locating..." : hasUserLocation ? "Refresh location" : "Use my location"}
        </motion.button>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {offices.map((office, index) => {
          const meta = getOfficeMeta(office.id);
          const Icon = meta.icon;
          const isNearest = office.id === nearestId && hasUserLocation;
          const isSelected = office.id === selectedId;

          return (
            <motion.button
              key={office.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(office.id)}
              className={cn(
                "relative rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors",
                isSelected
                  ? "border-white bg-white/20 shadow-lg shadow-black/20"
                  : "border-white/15 bg-white/10 hover:bg-white/15",
                isNearest && "ring-2 ring-emerald-300/80"
              )}
            >
              {isNearest ? (
                <motion.span
                  layoutId="nearest-badge"
                  className="absolute -right-1 -top-1 rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-900"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                >
                  Nearest
                </motion.span>
              ) : null}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Icon className="h-5 w-5" />
              </div>
              <p className="line-clamp-2 text-sm font-semibold leading-snug">{meta.shortName}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-white/75">
                <MapPin className="h-3 w-3 shrink-0" />
                {typeof office.distanceKm === "number"
                  ? `${office.distanceKm.toFixed(1)} km`
                  : "Distance pending"}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
