"use client";

import Link from "next/link";
import { Sparkles, User } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
}

export function Header({ showLogo = true, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        {showLogo && (
          <Link href="/home" className="flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-foreground">GovFlow AI</span>
          </Link>
        )}
        {title && (
          <h1 className="hidden text-lg font-bold text-foreground md:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector />
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-blue text-primary"
          aria-label="Profile settings"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
