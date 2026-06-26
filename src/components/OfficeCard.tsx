import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfficialSourceBadge } from "@/components/StatusBadge";
import { MapPin, Phone, Clock, ExternalLink, Plus } from "lucide-react";
import type { Office } from "@/types";

interface OfficeCardProps {
  office: Office;
}

export function OfficeCard({ office }: OfficeCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground">{office.name}</h3>
          <OfficialSourceBadge />
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
          <Button size="sm" variant="outline" disabled title="Demo mode">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button size="sm" variant="outline" disabled title="Demo mode">
            <MapPin className="h-4 w-4" />
            Directions
          </Button>
          {office.id === "orc" ? (
            <Button size="sm" variant="default" asChild>
              <a href="https://rgd.gov.gh" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open official portal
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
