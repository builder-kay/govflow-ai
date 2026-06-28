"use client";

import { motion } from "framer-motion";
import { FileText, Handshake, MapPinned, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MapPinned,
    title: "Build a roadmap",
    description: "Get a clean sequence of actions, documents, and agencies for your exact goal.",
    accent: "bg-soft-blue text-primary",
    bar: "from-primary to-primary-dark",
  },
  {
    icon: FileText,
    title: "Understand documents",
    description: "Upload forms and notices to see important sections, risk points, and next steps.",
    accent: "bg-emerald-50 text-emerald-700",
    bar: "from-emerald-400 to-teal-600",
  },
  {
    icon: ShieldCheck,
    title: "Reduce mistakes",
    description: "See warning signs early and fix likely rejection points before submission.",
    accent: "bg-amber-50 text-amber-700",
    bar: "from-amber-400 to-orange-500",
  },
  {
    icon: Handshake,
    title: "Delegate hard follow-ups",
    description:
      "Use GovFlow Agent when you need support handling office follow-ups while you focus on essentials.",
    accent: "bg-violet-50 text-violet-700",
    bar: "from-violet-400 to-indigo-600",
  },
];

export function LandingFeatures() {
  return (
    <section className="mt-16 md:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Platform</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            What this platform helps you do
          </h2>
        </div>
        <p className="text-sm text-muted">Designed for clarity, speed, and confidence.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Card className="group h-full overflow-hidden border-gray-100 transition-shadow hover:shadow-lg">
                <div className={`h-1 bg-gradient-to-r ${feature.bar} opacity-80`} />
                <CardContent className="p-5">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <p className="font-bold text-foreground">{feature.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
