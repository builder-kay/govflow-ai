"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { LEGAL_CONTACT_EMAIL, LEGAL_PRODUCT } from "@/data/legal";
import { Button } from "@/components/ui/button";

export function LegalContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-primary/15 bg-gradient-to-br from-soft-blue/40 to-white p-5 md:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary-dark">
            <MessageCircle className="h-4 w-4" />
            Questions about these policies?
          </p>
          <p className="mt-1 text-sm text-muted">
            Our team can clarify how {LEGAL_PRODUCT} handles your data and usage rights.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0 bg-white">
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            <Mail className="h-4 w-4" />
            {LEGAL_CONTACT_EMAIL}
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
