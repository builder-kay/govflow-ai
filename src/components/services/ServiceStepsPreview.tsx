"use client";

import { motion } from "framer-motion";
import { ArrowDown, ListOrdered } from "lucide-react";

interface ServiceStepsPreviewProps {
  steps: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

export function ServiceStepsPreview({ steps }: ServiceStepsPreviewProps) {
  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground md:text-2xl">
          <ListOrdered className="h-5 w-5 text-primary" />
          Steps to complete
        </h2>
        <p className="mt-1 text-sm text-muted">
          GovFlow will personalise these based on your answers — here is the typical path.
        </p>
      </motion.div>

      <motion.ol
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-0"
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <motion.li key={step} variants={stepVariants} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2 + index * 0.12,
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/25"
                >
                  {index + 1}
                </motion.span>
                {!isLast ? (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.35 + index * 0.12, duration: 0.4, ease: "easeOut" }}
                    style={{ originY: 0 }}
                    className="mt-2 w-0.5 min-h-[28px] flex-1 bg-gradient-to-b from-primary/40 to-primary/10"
                  />
                ) : null}
              </div>

              <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-5"
                >
                  <p className="font-medium text-foreground md:text-base">{step}</p>
                  {!isLast ? (
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                      <ArrowDown className="h-3 w-3" />
                      Then
                    </p>
                  ) : null}
                </motion.div>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
