"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";

interface SignOutButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  showIcon?: boolean;
  /** Compact circular icon for mobile header */
  iconOnly?: boolean;
  /** When true, centers icon + label for full-width profile layouts */
  fullWidth?: boolean;
}

export function SignOutButton({
  className,
  variant = "ghost",
  size = "default",
  label = "Sign out",
  showIcon = true,
  iconOnly = false,
  fullWidth = false,
}: SignOutButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    if (!hasSupabaseConfig) return;
    setError("");
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/auth";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign out. Please try again.");
      setLoading(false);
    }
  };

  const openDialog = () => {
    setError("");
    setOpen(true);
  };

  if (!hasSupabaseConfig) return null;

  return (
    <>
      {iconOnly ? (
        <motion.button
          type="button"
          aria-label="Sign out"
          whileTap={{ scale: 0.94 }}
          onClick={openDialog}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200/80 bg-gradient-to-br from-red-50 to-white text-red-700 shadow-sm transition-colors hover:border-red-300 hover:bg-red-100 sm:h-10 sm:w-10",
            className
          )}
        >
          <LogOut className="h-4 w-4" />
        </motion.button>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={cn(fullWidth && "w-full justify-center gap-2", className)}
          aria-label={label || "Sign out"}
          onClick={openDialog}
        >
          {showIcon ? <LogOut className="h-4 w-4 shrink-0" /> : null}
          {label ? <span>{label}</span> : null}
        </Button>
      )}

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
              onClick={() => !loading && setOpen(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="sign-out-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[91] w-full rounded-t-3xl border border-gray-100 bg-white p-5 pb-8 shadow-xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />
              <div className="mb-4 inline-flex rounded-2xl bg-red-100 p-3 text-red-700">
                <LogOut className="h-6 w-6" />
              </div>
              <p id="sign-out-title" className="text-lg font-bold text-foreground">
                Sign out of GovFlow?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                You will be signed out on this device. Your saved progress stays on this browser until
                you clear site data. You can sign back in anytime.
              </p>
              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="h-11 w-full sm:min-w-[100px] sm:w-auto"
                >
                  Stay signed in
                </Button>
                <Button
                  variant="danger"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="h-11 w-full sm:min-w-[100px] sm:w-auto"
                >
                  {loading ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
