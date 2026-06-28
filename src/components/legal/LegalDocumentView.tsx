"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import type { LegalDocument } from "@/data/legal";
import { LEGAL_CONTACT_EMAIL } from "@/data/legal";
import type { LegalDocumentMeta } from "@/lib/legal-meta";
import { cn } from "@/lib/utils";

interface LegalDocumentViewProps {
  document: LegalDocument;
  meta: LegalDocumentMeta;
}

function renderParagraph(text: string) {
  const emailPattern = new RegExp(LEGAL_CONTACT_EMAIL.replace(".", "\\."), "g");
  const parts = text.split(emailPattern);

  if (parts.length === 1) {
    return text;
  }

  return parts.flatMap((part, index) => {
    const nodes: React.ReactNode[] = [part];
    if (index < parts.length - 1) {
      nodes.push(
        <a
          key={`email-${index}`}
          href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
        >
          <Mail className="inline h-3.5 w-3.5" />
          {LEGAL_CONTACT_EMAIL}
        </a>
      );
    }
    return nodes;
  });
}

export function LegalDocumentView({ document, meta }: LegalDocumentViewProps) {
  return (
    <article className="min-w-0">
      <div className="space-y-5">
        {document.sections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-4 flex items-start gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                  meta.iconWrap
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="pt-0.5 text-lg font-bold leading-snug text-foreground md:text-xl">
                {section.title}
              </h2>
            </div>

            <div className="space-y-3 pl-0 md:pl-11">
              {section.paragraphs.map((paragraph) =>
                paragraph ? (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-relaxed text-muted md:text-[15px]"
                  >
                    {renderParagraph(paragraph)}
                  </p>
                ) : null
              )}

              {section.bullets?.length ? (
                <ul className="mt-1 space-y-2.5">
                  {section.bullets.map((item) => (
                    <li
                      key={item.slice(0, 48)}
                      className="flex gap-3 rounded-xl border border-gray-50 bg-gray-50/60 px-3 py-2.5 text-sm leading-relaxed text-muted md:text-[15px]"
                    >
                      <span
                        className={cn(
                          "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                          document.slug === "disclaimer" ? "bg-orange-500" : "bg-primary"
                        )}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.section>
        ))}
      </div>
    </article>
  );
}
