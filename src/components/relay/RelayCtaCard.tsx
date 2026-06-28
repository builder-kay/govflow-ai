"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Handshake, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RELAY_FEATURE_NAME } from "@/lib/relay-config";

export function RelayCtaCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-soft-blue/60 via-white to-white p-5 shadow-sm md:p-6"
    >
      <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-semibold text-primary-dark">
        <Handshake className="h-3.5 w-3.5" />
        New concierge pilot
      </p>
      <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
        Hire {RELAY_FEATURE_NAME} for your passport process
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
        Delegate office follow-ups and admin-heavy steps to GovFlow. We only call you in for
        mandatory presence moments like biometrics and collection.
      </p>

      <div className="mt-4 grid gap-2 text-xs text-muted sm:grid-cols-3">
        <p className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 py-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
          Coordinator-led operations
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 py-2">
          <UserCheck className="h-3.5 w-3.5 text-primary" />
          User-presence alerts by SMS
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 py-2">
          <Handshake className="h-3.5 w-3.5 text-primary" />
          Pay once per passport case
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/relay/passport">
            Start Agent intake
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/relay">View my Agent cases</Link>
        </Button>
      </div>
    </motion.section>
  );
}
