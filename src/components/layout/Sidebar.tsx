"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  FileText,
  Building2,
  LayoutGrid,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/offices", label: "Offices", icon: Building2 },
  { href: "/services", label: "Services", icon: LayoutGrid },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 md:border-r md:border-gray-100 md:bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-foreground">GovFlow AI</p>
          <p className="text-xs text-muted">Government Copilot</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                active
                  ? "bg-soft-blue text-primary-dark"
                  : "text-muted hover:bg-gray-50 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <p className="text-xs leading-relaxed text-muted">
          GovFlow AI helps users understand and prepare for government services. Always confirm
          requirements from official agencies.
        </p>
      </div>
    </aside>
  );
}
