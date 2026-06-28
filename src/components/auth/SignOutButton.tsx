"use client";

import { useState } from "react";
import { LogOut, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";

interface SignOutButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  showIcon?: boolean;
  /** When true, centers icon + label for full-width profile layouts */
  fullWidth?: boolean;
}

export function SignOutButton({
  className,
  variant = "ghost",
  size = "default",
  label = "Sign out",
  showIcon = true,
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

  if (!hasSupabaseConfig) return null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(fullWidth && "w-full justify-center gap-2", className)}
        aria-label={label || "Sign out"}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {showIcon ? <LogOut className="h-4 w-4 shrink-0" /> : null}
        {label ? <span>{label}</span> : null}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] grid place-items-end bg-black/40 p-0 sm:place-items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl border border-gray-100 bg-white p-5 shadow-xl sm:rounded-2xl">
            <p className="mb-1 flex items-center gap-2 text-lg font-bold text-foreground">
              <TriangleAlert className="h-5 w-5 shrink-0 text-warning" />
              Confirm sign out
            </p>
            <p className="text-sm leading-relaxed text-muted">
              You will be signed out of this device. You can sign back in anytime.
            </p>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="h-11 w-full sm:min-w-[90px] sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSignOut}
                disabled={loading}
                className="h-11 w-full sm:min-w-[90px] sm:w-auto"
              >
                {loading ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
