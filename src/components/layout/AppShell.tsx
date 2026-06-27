"use client";

import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatPanel } from "@/components/ChatPanel";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
  showChat?: boolean;
  showFooter?: boolean;
  requireAuth?: boolean;
}

export function AppShell({
  children,
  title,
  showNav = true,
  showChat = true,
  showFooter = true,
  requireAuth = true,
}: AppShellProps) {
  const { accessibility } = useAppStore();

  return (
    <AuthGate enabled={requireAuth}>
      <div
        className={cn(
          "min-h-screen bg-background",
          accessibility.biggerText && "bigger-text",
          accessibility.highContrast && "high-contrast",
          accessibility.reduceAnimations && "reduce-motion"
        )}
      >
        {showNav && <Sidebar />}
        <div className={cn(showNav && "md:ml-64")}>
          {showNav && <Header title={title} />}
          <main className={cn("px-4 py-6 md:px-8", showNav && "pb-24 md:pb-8")}>
            {children}
          </main>
          {showFooter && <Footer />}
        </div>
        {showNav && <MobileBottomNav />}
        {showChat && showNav && <ChatPanel />}
      </div>
    </AuthGate>
  );
}
