"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  CreditCard,
  Heart,
  Car,
  Receipt,
  UtensilsCrossed,
  Building2,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { RoadmapCard } from "@/components/RoadmapCard";
import { useAppStore } from "@/store/useAppStore";
import { matchesFoodBusinessQuery } from "@/lib/ai-mock";
import Link from "next/link";

const quickServices = [
  { id: "start-business", icon: Briefcase, title: "Start a Business", href: "/questions" },
  { id: "passport", icon: BookOpen, title: "Passport", href: "/services" },
  { id: "ghana-card", icon: CreditCard, title: "Ghana Card", href: "/services" },
  { id: "nhis", icon: Heart, title: "NHIS", href: "/services" },
  { id: "drivers-licence", icon: Car, title: "Driver's Licence", href: "/services" },
  { id: "gra-tin", icon: Receipt, title: "GRA / Tax", href: "/services" },
  { id: "fda-permit", icon: UtensilsCrossed, title: "FDA Permit", href: "/services" },
  { id: "building-permit", icon: Building2, title: "Building Permit", href: "/services" },
];

export default function HomePage() {
  const router = useRouter();
  const { userQuery, setUserQuery, setCurrentServiceId, roadmap } = useAppStore();
  const [query, setQuery] = useState(
    userQuery || "I want to start a small food delivery business in Cape Coast"
  );

  const handleBuildRoadmap = () => {
    setUserQuery(query);
    if (matchesFoodBusinessQuery(query)) {
      setCurrentServiceId("start-business");
      router.push("/questions");
    } else {
      router.push("/services");
    }
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
                Hi, what government process do you need help with?
              </h2>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Example: I want to start a small food delivery business in Cape Coast"
                rows={3}
                className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button size="lg" onClick={handleBuildRoadmap} className="w-full sm:w-auto">
                Build My Roadmap
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">Quick services</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickServices.map(({ id, icon, title, href }) => (
              <Link key={id} href={href} onClick={() => setCurrentServiceId(id)}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-soft-blue text-primary">
                      {(() => {
                        const Icon = icon;
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </div>
                    <p className="text-sm font-semibold">{title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">Continue</h3>
          <RoadmapCard
            title="Food Delivery Business"
            location="Cape Coast"
            progress={roadmap.progress || 25}
            riskLevel="medium"
            nextStep="Complete business registration checklist"
            continueHref="/roadmap"
            checklistHref="/checklist"
            riskHref="/risk"
          />
        </section>
      </div>
    </AppShell>
  );
}
