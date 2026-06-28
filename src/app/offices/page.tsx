"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { OfficeCard } from "@/components/OfficeCard";
import { OfficeProximityRadar } from "@/components/offices/OfficeProximityRadar";
import { OfficeAreaPicker } from "@/components/offices/OfficeAreaPicker";
import { offices } from "@/data/offices";
import { Coordinates, haversineDistanceKm } from "@/lib/geo";
import { getOfficeMeta, OFFICE_FILTERS, type OfficeCategory } from "@/lib/office-meta";
import {
  CITIES_WITH_LISTED_OFFICES,
  getGhanaCity,
  type GhanaCityId,
} from "@/lib/ghana-cities";
import { NoticeCard } from "@/components/NoticeCard";
import { Loader2, MapPin, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type OfficeLocation = {
  lat: number;
  lon: number;
};

type GeocodeResult = {
  query: string;
  lat: number | null;
  lon: number | null;
};

type LocatedOffice = (typeof offices)[number] & {
  coordinates: OfficeLocation | null;
  distanceKm: number | null;
};

export default function OfficesPage() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [usingGps, setUsingGps] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<GhanaCityId>("all");
  const [locationsByOfficeId, setLocationsByOfficeId] = useState<Record<string, OfficeLocation>>({});
  const [locating, setLocating] = useState(false);
  const [loadingPins, setLoadingPins] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OfficeCategory>("all");
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);

  const loadOfficeCoordinates = useCallback(async () => {
    const queries = offices.map((office) => office.osmQuery || office.address);
    const response = await fetch("/api/osm/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      results?: GeocodeResult[];
      error?: string;
    };
    if (!response.ok) {
      throw new Error(payload.error || "Could not get office locations from OpenStreetMap.");
    }

    const lookup = new Map(
      (payload.results || []).map((item) => [item.query, { lat: item.lat, lon: item.lon }])
    );
    const resolvedLocations: Record<string, OfficeLocation> = {};
    offices.forEach((office) => {
      const query = office.osmQuery || office.address;
      const point = lookup.get(query);
      if (point?.lat != null && point.lon != null) {
        resolvedLocations[office.id] = { lat: point.lat, lon: point.lon };
      }
    });
    setLocationsByOfficeId(resolvedLocations);
  }, []);

  useEffect(() => {
    let active = true;
    const preloadCoordinates = async () => {
      try {
        await loadOfficeCoordinates();
      } catch (error) {
        if (!active) return;
        setLocationError(
          error instanceof Error ? error.message : "Unable to load office map pins right now."
        );
      } finally {
        if (active) {
          setLoadingPins(false);
        }
      }
    };

    preloadCoordinates();
    return () => {
      active = false;
    };
  }, [loadOfficeCoordinates]);

  const referenceLocation = useMemo<Coordinates | null>(() => {
    if (usingGps && userLocation) return userLocation;
    if (selectedCityId !== "all") {
      return getGhanaCity(selectedCityId).coordinates;
    }
    return null;
  }, [usingGps, userLocation, selectedCityId]);

  const referenceLabel = useMemo(() => {
    if (usingGps && userLocation) return "From your location";
    if (selectedCityId !== "all") return `From ${getGhanaCity(selectedCityId).label}`;
    return null;
  }, [usingGps, userLocation, selectedCityId]);

  const locatedOffices = useMemo<LocatedOffice[]>(() => {
    return offices
      .map((office) => {
        const coordinates = locationsByOfficeId[office.id] || null;
        const distanceKm = referenceLocation && coordinates
          ? haversineDistanceKm(referenceLocation, coordinates)
          : null;
        return { ...office, coordinates, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return 0;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [locationsByOfficeId, referenceLocation]);

  const filteredOffices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filterByListedCity =
      !usingGps &&
      selectedCityId !== "all" &&
      CITIES_WITH_LISTED_OFFICES.has(selectedCityId);

    return locatedOffices.filter((office) => {
      if (filterByListedCity && office.city !== selectedCityId) {
        return false;
      }

      const meta = getOfficeMeta(office.id);
      const matchesFilter = activeFilter === "all" || meta.category === activeFilter;
      if (!matchesFilter) return false;

      if (!query) return true;
      const cityLabel = getGhanaCity(office.city as GhanaCityId).label.toLowerCase();
      return (
        office.name.toLowerCase().includes(query) ||
        office.service.toLowerCase().includes(query) ||
        office.address.toLowerCase().includes(query) ||
        office.useCase.toLowerCase().includes(query) ||
        cityLabel.includes(query)
      );
    });
  }, [locatedOffices, activeFilter, searchQuery, selectedCityId, usingGps]);

  const nearestOfficeId = referenceLocation
    ? filteredOffices.find((o) => o.distanceKm != null)?.id ?? null
    : null;

  const showRegionalHint =
    !usingGps &&
    selectedCityId !== "all" &&
    !CITIES_WITH_LISTED_OFFICES.has(selectedCityId);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location services.");
      return;
    }

    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setUsingGps(true);
        try {
          await loadOfficeCoordinates();
        } catch (error) {
          setLocationError(
            error instanceof Error
              ? error.message
              : "Unable to load nearby offices from OpenStreetMap."
          );
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission was denied. Please allow location access.");
          return;
        }
        setLocationError("Could not detect your location right now. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleSelectCity = (cityId: GhanaCityId) => {
    setUsingGps(false);
    setSelectedCityId(cityId);
    setLocationError("");
  };

  const scrollToOffice = (officeId: string) => {
    setSelectedOfficeId(officeId);
    window.setTimeout(() => {
      document.getElementById(`office-${officeId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  return (
    <AppShell title="Office Locator">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/50"
        >
          <div className="p-6 md:p-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Smart office finder
            </p>
            <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-foreground md:text-4xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue">
                <MapPin className="h-7 w-7 text-primary" />
              </span>
              Office Locator
            </h1>
            <p className="max-w-2xl text-muted">
              Browse government offices in Accra, Kumasi, Cape Coast, and other areas — or use your
              live location to see what is closest to you.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <OfficeAreaPicker
            selectedCityId={selectedCityId}
            onSelectCity={handleSelectCity}
            usingGps={usingGps}
            onUseMyLocation={handleFindNearest}
            locating={locating}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <OfficeProximityRadar
            offices={filteredOffices.map((o) => ({
              id: o.id,
              name: o.name,
              distanceKm: o.distanceKm,
            }))}
            selectedId={selectedOfficeId}
            hasReferenceLocation={Boolean(referenceLocation)}
            referenceLabel={referenceLabel}
            locating={locating}
            onSelect={scrollToOffice}
            onLocate={handleFindNearest}
          />
        </motion.div>

        {locationError ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {locationError}
          </motion.p>
        ) : null}

        {showRegionalHint ? (
          <NoticeCard
            variant="info"
            title={`Offices nearest to ${getGhanaCity(selectedCityId).label}`}
            description="We do not have dedicated listings in this city yet. Showing the closest GovFlow offices ranked by travel distance — always confirm the official office before you go."
          />
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offices, services, or areas..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {OFFICE_FILTERS.map((filter) => (
              <motion.button
                key={filter.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeFilter === filter.id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "border border-gray-200 bg-white text-muted hover:border-primary/30 hover:text-foreground"
                )}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        <NoticeCard
          variant="warning"
          title="Distances are estimates"
          description="Pins use OpenStreetMap data and your chosen area or live location. Always confirm the latest office details with the official agency before visiting."
        />

        {loadingPins ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading exact map pins from OpenStreetMap...
          </div>
        ) : null}

        <AnimatePresence mode="popLayout">
          <motion.div layout className="space-y-4">
            {filteredOffices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center"
              >
                <p className="font-semibold text-foreground">No offices match your filters</p>
                <p className="mt-1 text-sm text-muted">
                  Try another city, clear your search, or choose All areas.
                </p>
              </motion.div>
            ) : (
              filteredOffices.map((office, index) => (
                <OfficeCard
                  key={office.id}
                  office={office}
                  cityLabel={getGhanaCity(office.city as GhanaCityId).label}
                  distanceKm={office.distanceKm}
                  coordinates={office.coordinates}
                  isNearest={office.id === nearestOfficeId}
                  isSelected={office.id === selectedOfficeId}
                  index={index}
                  onSelect={() => setSelectedOfficeId(office.id)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-950"
        >
          Office details may change. Always confirm from the official agency before visiting.
        </motion.p>
      </div>
    </AppShell>
  );
}
