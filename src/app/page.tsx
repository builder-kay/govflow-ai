"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingShowcase } from "@/components/landing/LandingShowcase";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingCta } from "@/components/landing/LandingCta";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { LEGAL_OPERATOR } from "@/data/legal";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 md:px-8 md:pb-12">
        <LandingHeader />
        <LandingHero />
        <LandingFeatures />
        <LandingServices />
        <LandingShowcase />
        <LandingHowItWorks />
        <LandingCta />

        <footer className="mt-16 border-t border-gray-100 pt-8 text-center md:mt-20">
          <LegalNavLinks variant="inline" className="mb-4" />
          <p className="text-xs text-muted">
            Built and managed by {LEGAL_OPERATOR} © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
