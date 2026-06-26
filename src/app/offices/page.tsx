import { AppShell } from "@/components/layout/AppShell";
import { OfficeCard } from "@/components/OfficeCard";
import { offices } from "@/data/offices";
import { MapPin } from "lucide-react";

export default function OfficesPage() {
  return (
    <AppShell title="Office Locator">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
            <MapPin className="h-8 w-8 text-primary" />
            Office Locator
          </h1>
          <p className="text-muted">
            Relevant offices for your food delivery business roadmap in Cape Coast.
          </p>
        </div>

        <div className="space-y-4">
          {offices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>

        <p className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Office details may change. Always confirm from the official agency before visiting.
        </p>
      </div>
    </AppShell>
  );
}
