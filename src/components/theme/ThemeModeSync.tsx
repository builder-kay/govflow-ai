"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

function applyDarkMode(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark-mode", enabled);
  document.body.classList.toggle("dark-mode", enabled);
}

function readPersistedDarkMode(): boolean | null {
  try {
    const raw = window.localStorage.getItem("govflow-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { accessibility?: { darkMode?: boolean } } };
    if (typeof parsed?.state?.accessibility?.darkMode === "boolean") {
      return parsed.state.accessibility.darkMode;
    }
    return null;
  } catch {
    return null;
  }
}

export function ThemeModeSync() {
  const darkMode = useAppStore((state) => state.accessibility.darkMode);

  useEffect(() => {
    const persisted = readPersistedDarkMode();
    if (persisted !== null) {
      applyDarkMode(persisted);
      return;
    }
    applyDarkMode(darkMode);
  }, []);

  useEffect(() => {
    applyDarkMode(darkMode);
  }, [darkMode]);

  return null;
}
