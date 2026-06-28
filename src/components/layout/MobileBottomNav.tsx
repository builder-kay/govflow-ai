"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, FileText, Building2, User, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/relay", label: "Agent", icon: Handshake },
  { href: "/offices", label: "Offices", icon: Building2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === "/roadmaps" && pathname === "/roadmap") ||
            (href === "/home" && pathname === "/");

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors min-w-[60px]",
                active ? "text-primary" : "text-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
