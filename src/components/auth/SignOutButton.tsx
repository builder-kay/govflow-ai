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
}

export function SignOutButton({
  className,
  variant = "ghost",
  size = "default",
  label = "Sign out",
  showIcon = true,
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
        className={className}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {showIcon ? <LogOut className="h-4 w-4" /> : null}
        {label}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
            <p className="mb-1 flex items-center gap-2 text-lg font-bold text-foreground">
              <TriangleAlert className="h-5 w-5 text-warning" />
              Confirm sign out
            </p>
            <p className="text-sm text-muted">
              You will be signed out of this device. You can sign back in anytime.
            </p>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className={cn("min-w-[90px]")}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSignOut}
                disabled={loading}
                className={cn("min-w-[90px]")}
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
