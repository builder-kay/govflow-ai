"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListTree } from "lucide-react";
import type { LegalSection } from "@/data/legal";
import type { LegalDocumentMeta } from "@/lib/legal-meta";
import { cn } from "@/lib/utils";

interface LegalTableOfContentsProps {
  sections: LegalSection[];
  meta: LegalDocumentMeta;
  embedded?: boolean;
}

export function LegalTableOfContents({ sections, meta, embedded = false }: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(section.id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sections]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      aria-label="Table of contents"
      className={embedded ? undefined : "lg:sticky lg:top-24 lg:self-start"}
    >
      <div
        className={
          embedded
            ? undefined
            : "rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        }
      >
        {!embedded ? (
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <ListTree className="h-4 w-4 text-primary" />
            On this page
          </p>
        ) : null}
        <ol className="space-y-1">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollTo(section.id)}
                className={cn(
                  "w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm transition",
                  activeId === section.id
                    ? meta.tocActive
                    : "text-muted hover:border-gray-100 hover:bg-gray-50 hover:text-foreground"
                )}
              >
                <span className="mr-2 text-[10px] font-bold tabular-nums text-muted/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-snug">{section.title.replace(/^\d+\.\s*/, "")}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </motion.nav>
  );
}
