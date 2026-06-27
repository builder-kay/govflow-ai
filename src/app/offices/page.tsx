"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OfficeCard } from "@/components/OfficeCard";
import { offices } from "@/data/offices";
import { Coordinates, haversineDistanceKm } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/NoticeCard";
import { Loader2, LocateFixed, MapPin } from "lucide-react";

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
  const [locationsByOfficeId, setLocationsByOfficeId] = useState<Record<string, OfficeLocation>>({});
  const [locating, setLocating] = useState(false);
  const [loadingPins, setLoadingPins] = useState(true);
  const [locationError, setLocationError] = useState("");

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

  const nearestOffices = useMemo<LocatedOffice[]>(() => {
    return offices
      .map((office) => {
        const coordinates = locationsByOfficeId[office.id] || null;
        const distanceKm =
          userLocation && coordinates ? haversineDistanceKm(userLocation, coordinates) : null;
        return { ...office, coordinates, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return 0;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [locationsByOfficeId, userLocation]);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location services.");
      return;
    }

    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentUserLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(currentUserLocation);
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

  return (
    <AppShell title="Office Locator">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
            <MapPin className="h-8 w-8 text-primary" />
            Office Locator
          </h1>
          <p className="text-muted">
            Use your current location to rank nearby offices with OpenStreetMap data.
          </p>
          <div className="mt-4">
            <Button onClick={handleFindNearest} disabled={locating}>
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              {locating ? "Finding nearest offices..." : "Use my location"}
            </Button>
          </div>
          {locationError ? <p className="mt-3 text-sm text-red-600">{locationError}</p> : null}
          {userLocation ? (
            <p className="mt-3 text-sm text-muted">
              Showing nearest offices from your detected location ({userLocation.lat.toFixed(4)},{" "}
              {userLocation.lon.toFixed(4)}).
            </p>
          ) : null}
        </div>

        <NoticeCard
          variant="warning"
          title="Nearest office is an estimate"
          description="Open in OSM now uses pinned coordinates for each office. Distance is estimated from your live location after you tap Use my location."
          className="mb-6"
        />

        {loadingPins ? (
          <p className="mb-4 text-sm text-muted">Loading office map pins for exact OSM locations...</p>
        ) : null}

        <div className="space-y-4">
          {nearestOffices.map((office, index) => (
            <OfficeCard
              key={office.id}
              office={{
                ...office,
                name: userLocation && index === 0 ? `${office.name} (Nearest)` : office.name,
              }}
              distanceKm={office.distanceKm}
              coordinates={office.coordinates}
            />
          ))}
        </div>

        <p className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Office details may change. Always confirm from the official agency before visiting.
        </p>
      </div>
    </AppShell>
  );
}
