"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import { User, Save, ShieldCheck } from "lucide-react";

const languages = ["English"];
const explanationStyles = ["simple", "normal", "detailed"] as const;

export default function ProfilePage() {
  const { accessibility, setAccessibility, username, setUsername } = useAppStore();
  const [usernameInput, setUsernameInput] = useState(username);
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const trimmedInput = usernameInput.trim();
  const usernameChanged = trimmedInput !== username;
  const usernameLength = trimmedInput.length;

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

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/30 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
                <p className="text-muted">Personalize your GovFlow experience for better guidance.</p>
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm text-muted shadow-sm">
              Signed in settings
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Account identity</h2>
              <p className="mt-1 text-sm text-muted">
                This name appears in assistant greetings and personalized guidance.
              </p>

              <div className="mt-4">
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
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
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring"
                    maxLength={32}
                  />
                  <Button
                    onClick={handleSaveUsername}
                    disabled={savingUsername || usernameLength < 2 || usernameLength > 32 || !usernameChanged}
                    className="sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    {savingUsername ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span>{usernameChanged ? "Unsaved changes" : "Saved"}</span>
                  <span>{usernameLength}/32</span>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-primary/10 bg-soft-blue/30 px-3 py-2 text-sm text-primary-dark">
                Assistant greeting preview:{" "}
                <span className="font-semibold">
                  {trimmedInput ? `Hi ${trimmedInput}!` : "Hi there!"}
                </span>
              </div>
              {usernameError ? <p className="mt-2 text-sm text-red-600">{usernameError}</p> : null}
              {usernameMessage ? <p className="mt-2 text-sm text-emerald-600">{usernameMessage}</p> : null}
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Language</h2>
              <p className="mt-1 text-sm text-muted">
                Choose how GovFlow explains steps and AI guidance.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setAccessibility({ language: lang })}
                    className={cn(
                      "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      accessibility.language === lang
                        ? "border-primary bg-soft-blue text-primary-dark"
                        : "border-gray-100 bg-white hover:border-primary/30"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Explanation style</h2>
              <p className="mt-1 text-sm text-muted">
                Adjust answer depth based on your comfort level.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {explanationStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setAccessibility({ explanationStyle: style })}
                    className={cn(
                      "rounded-xl border-2 px-5 py-3 text-sm font-medium capitalize transition-all",
                      accessibility.explanationStyle === style
                        ? "border-primary bg-soft-blue text-primary-dark"
                        : "border-gray-100 bg-white hover:border-primary/30"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Accessibility</h2>
              <p className="mt-1 text-sm text-muted">
                Improve readability and comfort while using the platform.
              </p>
              <div className="mt-4 space-y-3">
                <AccessibilityToggle label="Bigger text" settingKey="biggerText" />
                <AccessibilityToggle
                  label="Voice reading"
                  description="Read explanations aloud"
                  settingKey="voiceReading"
                />
                <AccessibilityToggle label="High contrast mode" settingKey="highContrast" />
                <AccessibilityToggle label="Reduce animations" settingKey="reduceAnimations" />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Interaction mode</h2>
              <p className="mt-1 text-sm text-muted">
                Pick the interface style that best matches your pace.
              </p>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setAccessibility({ mode: "simple", biggerText: true })}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    accessibility.mode === "simple"
                      ? "border-primary bg-soft-blue"
                      : "border-gray-100 bg-white"
                  )}
                >
                  <p className="font-bold text-foreground">Simple Mode</p>
                  <p className="mt-1 text-sm text-muted">
                    Better for first-time users. Larger text and guided explanations.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setAccessibility({ mode: "quick", biggerText: false })}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    accessibility.mode === "quick"
                      ? "border-primary bg-soft-blue"
                      : "border-gray-100 bg-white"
                  )}
                >
                  <p className="font-bold text-foreground">Quick Mode</p>
                  <p className="mt-1 text-sm text-muted">
                    Shorter answers and compact interface for faster task completion.
                  </p>
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-warning" />
                Account safety
              </p>
              <p className="text-sm text-muted">
                Signing out clears your active session on this device. You can sign back in anytime.
              </p>
              {hasSupabaseConfig ? (
                <SignOutButton className="mt-3 w-full" variant="ghost" />
              ) : null}
            </section>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          GovFlow AI helps users understand and prepare for government services. It does not replace
          official government agencies, legal advice, or official application portals. Always confirm
          final requirements, fees, and timelines from the responsible agency.
        </p>
      </div>
    </AppShell>
  );
}
