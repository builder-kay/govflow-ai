"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
}

export function Header({ showLogo = true, title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldShowBack = pathname !== "/home" && pathname !== "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/home");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        {shouldShowBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-9 px-2 text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        ) : null}
        {showLogo && (
          <Link href="/home" className="flex items-center gap-2 md:hidden">
            <Image src="/govflow-mark.png" alt="GovFlow AI" width={36} height={36} className="h-9 w-9" />
            <span className="font-bold text-foreground">GovFlow AI</span>
          </Link>
        )}
        {title && (
          <h1 className="hidden text-lg font-bold text-foreground md:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector />
        <SignOutButton
          size="sm"
          variant="outline"
          label="Sign out"
          className="hidden sm:inline-flex"
        />
        <SignOutButton
          size="icon"
          variant="ghost"
          label=""
          className="sm:hidden"
          showIcon
        />
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
