"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import type { GhanaCityId } from "@/lib/ghana-cities";
import { GHANA_CITIES } from "@/lib/ghana-cities";
import { cn } from "@/lib/utils";

interface OfficeAreaPickerProps {
  selectedCityId: GhanaCityId;
  onSelectCity: (cityId: GhanaCityId) => void;
  usingGps: boolean;
  onUseMyLocation: () => void;
  locating: boolean;
}

export function OfficeAreaPicker({
  selectedCityId,
  onSelectCity,
  usingGps,
  onUseMyLocation,
  locating,
}: OfficeAreaPickerProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Browse by area
          </p>
          <p className="mt-1 text-sm text-muted">
            Pick a city to see offices there, or use your live location to find what is closest.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={onUseMyLocation}
          disabled={locating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
            usingGps
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "border border-gray-200 bg-background text-foreground hover:border-primary/30"
          )}
        >
          <Navigation className="h-4 w-4" />
          {locating ? "Locating..." : "Use my location"}
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2">
        {GHANA_CITIES.map((city) => {
          const isActive = !usingGps && selectedCityId === city.id;

          return (
            <motion.button
              key={city.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectCity(city.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-gray-200 bg-background text-muted hover:border-primary/30 hover:text-foreground"
              )}
            >
              {city.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
