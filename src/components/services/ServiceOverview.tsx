"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface ServiceOverviewProps {
  overview: string;
  involves: string[];
}

export function ServiceOverview({ overview, involves }: ServiceOverviewProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-10"
    >
      <p className="text-base leading-relaxed text-foreground md:text-lg">{overview}</p>

      {involves.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-soft-blue/40 to-white p-5 md:p-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary-dark">
            <Info className="h-4 w-4 shrink-0" />
            What this usually involves
          </p>
          <ul className="space-y-3">
            {involves.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
                className="flex gap-3 text-sm leading-relaxed text-muted md:text-base"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.section>
  );
}
