"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function inferFlow(pathname: string): string {
  if (pathname.startsWith("/relay")) return "agent";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/assistant")) return "assistant";
  if (pathname.startsWith("/auth")) return "auth";
  if (pathname.startsWith("/documents")) return "documents";
  return "general";
}

export function PageVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/api/")) return;

    const payload = {
      pathname,
      flow: inferFlow(pathname),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    void fetch("/api/analytics/page-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => null);
  }, [pathname]);

  return null;
}
