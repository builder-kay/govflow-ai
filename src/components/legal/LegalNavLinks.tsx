import Link from "next/link";
import { ALL_LEGAL_DOCUMENTS, LEGAL_LINKS } from "@/data/legal";
import { cn } from "@/lib/utils";

interface LegalNavLinksProps {
  excludeSlug?: string;
  className?: string;
  variant?: "list" | "inline";
}

export function LegalNavLinks({
  excludeSlug,
  className,
  variant = "list",
}: LegalNavLinksProps) {
  const links = LEGAL_LINKS.filter(
    (link) => link.href !== "/legal" && (!excludeSlug || !link.href.endsWith(excludeSlug))
  );

  if (variant === "inline") {
    return (
      <nav className={cn("flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs", className)}>
        {LEGAL_LINKS.filter((link) => link.href !== "/legal").map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted underline-offset-2 hover:text-primary hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {ALL_LEGAL_DOCUMENTS.filter((doc) => doc.slug !== excludeSlug).map((doc) => (
        <Link
          key={doc.slug}
          href={`/${doc.slug}`}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm transition hover:border-primary/25 hover:bg-soft-blue/30"
        >
          <p className="font-semibold text-foreground">{doc.title}</p>
          <p className="mt-0.5 text-xs text-muted">{doc.summary}</p>
        </Link>
      ))}
      <Link
        href="/legal"
        className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm transition hover:border-primary/25 hover:bg-soft-blue/30 sm:col-span-2"
      >
        <p className="font-semibold text-foreground">Legal hub</p>
        <p className="mt-0.5 text-xs text-muted">View all policies in one place</p>
      </Link>
    </nav>
  );
}
