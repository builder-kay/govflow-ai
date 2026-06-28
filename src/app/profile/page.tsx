"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { useAppStore, getChecklistProgress } from "@/store/useAppStore";
import { getServiceFlow } from "@/lib/service-registry";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import {
  User,
  Save,
  ShieldCheck,
  Globe,
  Accessibility,
  Scale,
  Type,
  Check,
  Map,
  FileText,
  MessageCircle,
  Handshake,
} from "lucide-react";

const languages = ["English"];

const SERVICE_LABELS: Record<string, string> = {
  "start-business": "Start a Business",
  passport: "Passport",
  "national-service": "National Service",
  "ghana-card": "Ghana Card",
  "gra-tin": "GRA / Tax",
};

export default function ProfilePage() {
  const {
    accessibility,
    setAccessibility,
    username,
    setUsername,
    currentServiceId,
    roadmap,
    checklist,
    savedDocuments,
  } = useAppStore();

  const [usernameInput, setUsernameInput] = useState(username);
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const trimmedInput = usernameInput.trim();
  const usernameChanged = trimmedInput !== username;
  const usernameLength = trimmedInput.length;
  const reduceMotion = accessibility.reduceAnimations;

  const roadmapProgress = useMemo(() => {
    const checklistProgress = getChecklistProgress(checklist);
    return Math.max(roadmap.progress, checklistProgress);
  }, [checklist, roadmap.progress]);

  const activeServiceLabel = currentServiceId
    ? SERVICE_LABELS[currentServiceId] ?? getServiceFlow(currentServiceId).roadmapTitle
    : "None yet";

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const metadataUsername = user.user_metadata?.username;
      if (typeof metadataUsername === "string" && metadataUsername.trim()) {
        setUsername(metadataUsername.trim());
      }
    });
  }, [setUsername]);

  const handleSaveUsername = async () => {
    setUsernameError("");
    setUsernameMessage("");
    if (usernameLength < 2) {
      setUsernameError("Username should be at least 2 characters.");
      return;
    }
    if (usernameLength > 32) {
      setUsernameError("Username should be 32 characters or fewer.");
      return;
    }
    if (!usernameChanged) {
      setUsernameMessage("No changes to save.");
      return;
    }

    setSavingUsername(true);
    try {
      if (hasSupabaseConfig) {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.updateUser({ data: { username: trimmedInput } });
        if (error) throw error;
      }
      setUsername(trimmedInput);
      setUsernameMessage("Username saved. GovFlow AI will use it for greetings.");
    } catch (error) {
      setUsernameError(error instanceof Error ? error.message : "Could not save username.");
    } finally {
      setSavingUsername(false);
    }
  };

  const usernameStrength = Math.min(100, (usernameLength / 32) * 100);

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-6xl space-y-6 pb-8 md:space-y-8">
        <ProfileHero
          username={username}
          activeServiceLabel={activeServiceLabel}
          roadmapProgress={roadmapProgress}
          savedDocumentsCount={savedDocuments.length}
          mode={accessibility.mode}
          reduceMotion={reduceMotion}
        />

        {/* Desktop quick links */}
        <div className="hidden gap-3 md:grid md:grid-cols-4">
          {[
            { href: "/roadmap", label: "Continue roadmap", icon: Map, desc: `${roadmapProgress}% complete` },
            { href: "/documents", label: "Your documents", icon: FileText, desc: `${savedDocuments.length} saved` },
            { href: "/assistant", label: "Open assistant", icon: MessageCircle, desc: "Ask in simple English" },
            { href: "/relay", label: "GovFlow Agent", icon: Handshake, desc: "Delegated assistance" },
          ].map((link, index) => {
            const Icon = link.icon;
            const LinkWrapper = reduceMotion ? "div" : motion.div;
            const linkProps = reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.1 + index * 0.05 },
                };
            return (
              <LinkWrapper key={link.href} {...linkProps}>
                <Link
                  href={link.href}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-blue transition group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{link.label}</p>
                    <p className="text-sm text-muted">{link.desc}</p>
                  </div>
                </Link>
              </LinkWrapper>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {/* Primary settings */}
          <div className="space-y-6">
            <ProfileSection
              icon={User}
              title="Account identity"
              description="This name appears in assistant greetings and personalized guidance."
              delay={0.05}
              reduceMotion={reduceMotion}
            >
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="w-full flex-1">
                  <input
                    id="username"
                    type="text"
                    value={usernameInput}
                    onChange={(event) => {
                      setUsernameInput(event.target.value);
                      setUsernameMessage("");
                      setUsernameError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleSaveUsername();
                      }
                    }}
                    placeholder="Enter username"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-background/50 px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength={32}
                    autoComplete="nickname"
                  />
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${usernameStrength}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      {usernameChanged ? (
                        "Unsaved changes"
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          Saved
                        </>
                      )}
                    </span>
                    <span>{usernameLength}/32</span>
                  </div>
                </div>
                <Button
                  onClick={handleSaveUsername}
                  disabled={savingUsername || usernameLength < 2 || usernameLength > 32 || !usernameChanged}
                  className="h-12 w-full shrink-0 rounded-2xl sm:w-auto sm:min-w-[120px]"
                >
                  <Save className="h-4 w-4" />
                  {savingUsername ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-gradient-to-r from-soft-blue/50 to-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">
                  Greeting preview
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {trimmedInput ? `Hi ${trimmedInput}! How can I help you today?` : "Hi there! How can I help you today?"}
                </p>
              </div>

              {usernameError ? (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{usernameError}</p>
              ) : null}
              {usernameMessage ? (
                <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{usernameMessage}</p>
              ) : null}
            </ProfileSection>

            <ProfileSection
              icon={Globe}
              title="Language"
              description="Choose how GovFlow explains steps and AI guidance."
              delay={0.1}
              reduceMotion={reduceMotion}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setAccessibility({ language: lang })}
                    className={cn(
                      "rounded-2xl border-2 p-4 text-left transition-all",
                      accessibility.language === lang
                        ? "border-primary bg-soft-blue shadow-sm"
                        : "border-gray-100 bg-white hover:border-primary/30"
                    )}
                  >
                    <p className="font-bold text-foreground">{lang}</p>
                    <p className="mt-1 text-sm text-muted">Default guidance language</p>
                  </button>
                ))}
                <div className="rounded-2xl border border-dashed border-gray-200 bg-background/50 p-4 text-left">
                  <p className="font-medium text-muted">More languages</p>
                  <p className="mt-1 text-sm text-muted">Additional languages coming soon.</p>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Sidebar settings — sticky on large screens */}
          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <ProfileSection
              icon={Accessibility}
              title="Accessibility"
              description="Improve readability and comfort while using the platform."
              delay={0.08}
              reduceMotion={reduceMotion}
            >
              <div className="space-y-3">
                <AccessibilityToggle label="Bigger text" settingKey="biggerText" icon={Type} />
              </div>
            </ProfileSection>

            <ProfileSection
              icon={Scale}
              title="Legal"
              description="Terms, privacy, cookies, and platform policies."
              delay={0.1}
              reduceMotion={reduceMotion}
            >
              <LegalNavLinks />
            </ProfileSection>

            <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm md:rounded-3xl">
              <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <ShieldCheck className="h-5 w-5 text-warning" />
                Account safety
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Signing out clears your active session on this device. You can sign back in anytime.
              </p>
              {hasSupabaseConfig ? (
                <SignOutButton
                  fullWidth
                  variant="outline"
                  label="Sign out of this device"
                  className="mt-4 h-12 rounded-2xl border-red-200/90 bg-white font-semibold text-red-700 shadow-sm hover:border-red-300 hover:bg-red-50"
                />
              ) : (
                <p className="mt-3 text-sm text-muted">Auth is not configured in this environment.</p>
              )}
            </section>
          </div>
        </div>

        <p className="rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 text-xs leading-relaxed text-muted md:px-5">
          GovFlow AI helps users understand and prepare for government services. See our{" "}
          <Link href="/legal" className="font-medium text-primary hover:underline">
            legal policies
          </Link>{" "}
          for terms, privacy, and disclaimers. Always confirm final requirements from the responsible
          agency.
        </p>
      </div>
    </AppShell>
  );
}
