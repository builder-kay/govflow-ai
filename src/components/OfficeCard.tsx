import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfficialSourceBadge } from "@/components/StatusBadge";
import { MapPin, Phone, Clock, ExternalLink, Plus } from "lucide-react";
import type { Office } from "@/types";

interface OfficeCardProps {
  office: Office;
  distanceKm?: number | null;
  coordinates?: { lat: number; lon: number } | null;
}

export function OfficeCard({ office, distanceKm, coordinates }: OfficeCardProps) {
  const phoneHref = `tel:${office.phone.replace(/[^\d+]/g, "")}`;
  const directionsHref = coordinates
    ? `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lon}#map=18/${coordinates.lat}/${coordinates.lon}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(office.osmQuery || office.address)}`;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground">{office.name}</h3>
          <div className="flex items-center gap-2">
            {typeof distanceKm === "number" ? (
              <span className="rounded-full bg-soft-blue px-2 py-1 text-xs font-semibold text-primary-dark">
                {distanceKm.toFixed(1)} km away
              </span>
            ) : null}
            <OfficialSourceBadge />
          </div>
        </div>

        <p className="mb-1 text-sm font-semibold text-primary">{office.service}</p>
        <p className="mb-4 text-sm text-muted">{office.useCase}</p>

        <div className="mb-5 space-y-2 text-sm text-muted">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {office.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            {office.phone}
          </p>
          {office.hours && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              {office.hours}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href={phoneHref}>
              <Phone className="h-4 w-4" />
              Call
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={directionsHref} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-4 w-4" />
              Open in OSM
            </a>
          </Button>
          {office.portalUrl ? (
            <Button size="sm" variant="default" asChild>
              <a href={office.portalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {office.portalLabel ?? "Open official portal"}
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
              Add to roadmap
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
