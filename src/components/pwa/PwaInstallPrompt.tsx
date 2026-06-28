"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "govflow-install-dismissed";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const dismissedFlag = window.localStorage.getItem(DISMISS_KEY) === "1";
    setDismissed(dismissedFlag);

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIos(ios);

    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone =
      typeof window.navigator !== "undefined" &&
      "standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    setIsStandalone(standalone || iosStandalone);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        // no-op: install prompt can still work in some browsers
      });
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setDismissed(true);
      window.localStorage.setItem(DISMISS_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const showIosHint = useMemo(
    () => isIos && !isStandalone && !dismissed,
    [dismissed, isIos, isStandalone]
  );
  const showInstallButton = useMemo(
    () => Boolean(deferredPrompt) && !isStandalone && !dismissed,
    [deferredPrompt, dismissed, isStandalone]
  );

  if (!showIosHint && !showInstallButton) return null;

  const dismiss = () => {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDismissed(true);
      window.localStorage.setItem(DISMISS_KEY, "1");
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-28 left-3 z-50 max-w-xs rounded-2xl border border-primary/20 bg-white p-3 shadow-lg md:bottom-6 md:left-6">
      <p className="text-xs font-semibold text-foreground">
        {showInstallButton ? "Install GovFlow app" : "Add GovFlow to Home Screen"}
      </p>
      <p className="mt-1 text-xs text-muted">
        {showInstallButton
          ? "Install for faster access from your home screen or desktop."
          : "On iPhone/iPad, tap Share and choose 'Add to Home Screen'."}
      </p>
      <div className="mt-2 flex gap-2">
        {showInstallButton ? (
          <Button size="sm" onClick={() => void install()}>
            <Download className="h-4 w-4" />
            Install
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            <Smartphone className="h-4 w-4" />
            iOS steps
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
