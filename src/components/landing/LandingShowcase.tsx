"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const showcases = [
  {
    image: "/landing-roadmap.svg",
    alt: "Roadmap and progress visualization",
    title: "Roadmaps with progress intelligence",
    description: "Track where you are, what is pending, and what to prioritize next.",
  },
  {
    image: "/landing-documents.svg",
    alt: "Document guidance and analysis preview",
    title: "Documents connected across services",
    description: "Keep uploaded documents organized and referenced in chat and service guidance.",
  },
];

export function LandingShowcase() {
  return (
    <section className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-2">
      {showcases.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className="group overflow-hidden border-primary/10 shadow-sm transition-shadow hover:shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-hidden bg-gradient-to-br from-soft-blue/30 to-white">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={900}
                    height={560}
                    className="h-auto w-full"
                  />
                </motion.div>
              </div>
              <div className="border-t border-gray-100 p-5">
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}
