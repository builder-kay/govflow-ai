"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoadmapCard } from "@/components/RoadmapCard";
import { useAppStore } from "@/store/useAppStore";
import { detectServiceFromQuery } from "@/lib/ai-mock";
import { cn } from "@/lib/utils";
import { NoticeCard } from "@/components/NoticeCard";

const quickServices = [
  { id: "start-business", icon: Briefcase, title: "Start a Business", href: "/services/start-business" },
  { id: "passport", icon: BookOpen, title: "Passport", href: "/services/passport" },
  {
    id: "national-service",
    icon: GraduationCap,
    title: "National Service",
    href: "/services/national-service",
  },
  { id: "ghana-card", icon: CreditCard, title: "Ghana Card", href: "/services/ghana-card" },
  { id: "nhis", icon: Heart, title: "NHIS", href: "/services/nhis", comingSoon: true },
  {
    id: "drivers-licence",
    icon: Car,
    title: "Driver's Licence",
    href: "/services/drivers-licence",
    comingSoon: true,
  },
  { id: "gra-tin", icon: Receipt, title: "GRA / Tax", href: "/services/gra-tin", comingSoon: true },
  { id: "fda-permit", icon: UtensilsCrossed, title: "FDA Permit", href: "/services/fda-permit", comingSoon: true },
  {
    id: "building-permit",
    icon: Building2,
    title: "Building Permit",
    href: "/services/building-permit",
    comingSoon: true,
  },
  {
    id: "afcfta-trade-support",
    icon: Briefcase,
    title: "AfCFTA Trade Support",
    href: "/services/afcfta-trade-support",
    comingSoon: true,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { userQuery, setUserQuery, roadmap, currentServiceId } = useAppStore();
  const [query, setQuery] = useState(userQuery || "");

  const handleBuildRoadmap = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setUserQuery(trimmed);
    const serviceId = detectServiceFromQuery(trimmed);
    if (serviceId) {
      useAppStore.getState().ensureServiceChecklist(serviceId);
      router.push(`/services/${serviceId}`);
      return;
    }
    router.push("/services");
  };

  const handleServiceSelect = (serviceId: string) => {
    useAppStore.getState().ensureServiceChecklist(serviceId);
  };

  return (
    <AppShell title="Home">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/10 bg-gradient-to-br from-white to-soft-blue/30">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                What are we processing today with GovFlow?
              </h2>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tell GovFlow what you need help with today."
                rows={3}
                className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={handleBuildRoadmap}
                  className="w-full sm:w-auto"
                >
                  Build My Roadmap
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setUserQuery(query);
                    router.push("/assistant");
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                  Ask AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <NoticeCard
          variant="warning"
          title="Before you submit any application"
          description="Always verify final fees, appointment slots, and document requirements from official government portals."
        />

        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">Quick services</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickServices.map(({ id, icon, title, href, comingSoon }) => {
              const Icon = icon;
              const card = (
                <Card
                  className={cn(
                    "h-full transition-all hover:border-primary/20 hover:shadow-md",
                    comingSoon && "opacity-70"
                  )}
                >
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-soft-blue text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">{title}</p>
                    {comingSoon ? (
                      <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                        Coming soon
                      </span>
                    ) : null}
                  </CardContent>
                </Card>
              );

              if (comingSoon) {
                return (
                  <div key={id} className="text-left">
                    {card}
                  </div>
                );
              }

              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => handleServiceSelect(id)}
                  className="block text-left"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">Continue</h3>
          <RoadmapCard
            title={roadmap.title}
            location={roadmap.location}
            progress={roadmap.progress}
            riskLevel={roadmap.riskLevel}
            nextStep={roadmap.mainNextStep}
            continueHref="/roadmap"
            checklistHref="/checklist"
            riskHref="/risk"
          />
        </section>
      </div>
    </AppShell>
  );
}
