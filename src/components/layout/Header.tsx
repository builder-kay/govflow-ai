"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
}

export function Header({ showLogo = true, title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/home" || pathname === "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/home");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          {!isHome ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9 shrink-0 text-primary"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}

          {showLogo && isHome ? (
            <Link href="/home" className="flex min-w-0 items-center gap-2 md:hidden">
              <Image
                src="/govflow-mark.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0"
              />
              <span className="truncate font-bold text-foreground">GovFlow AI</span>
            </Link>
          ) : null}

          {title && !isHome ? (
            <h1 className="min-w-0 truncate text-base font-bold text-foreground sm:text-lg md:hidden">
              {title}
            </h1>
          ) : null}

          {title ? (
            <h1 className="hidden truncate text-lg font-bold text-foreground md:block">{title}</h1>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          <LanguageSelector compact className="sm:[&_select]:min-w-0" />
          <SignOutButton
            size="sm"
            variant="outline"
            label="Sign out"
            className="hidden sm:inline-flex"
          />
          <Link
            href="/profile"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-blue text-primary sm:h-10 sm:w-10",
              pathname === "/profile" && "ring-2 ring-primary/25"
            )}
            aria-label="Profile settings"
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
