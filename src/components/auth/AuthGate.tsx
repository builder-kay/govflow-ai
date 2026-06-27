"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";

interface AuthGateProps {
  children: React.ReactNode;
  enabled?: boolean;
}

type AuthState = "loading" | "authed" | "guest";

export function AuthGate({ children, enabled = true }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>(enabled ? "loading" : "authed");

  useEffect(() => {
    if (!enabled) return;
    if (!hasSupabaseConfig) return;

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthState(data.session ? "authed" : "guest");
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthState(session ? "authed" : "guest");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!hasSupabaseConfig) return;
    if (authState !== "guest") return;
    const next = encodeURIComponent(pathname || "/home");
    router.replace(`/auth?next=${next}`);
  }, [authState, enabled, pathname, router]);

  if (!enabled) return <>{children}</>;

  if (!hasSupabaseConfig) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-6">
            <p className="flex items-center gap-2 text-amber-900 font-semibold">
              <ShieldAlert className="h-5 w-5" />
              Supabase configuration missing
            </p>
            <p className="mt-2 text-sm text-amber-800">
              Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env`
              file and restart the dev server.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          Checking your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
