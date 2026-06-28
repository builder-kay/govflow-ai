import type { LegalDocument } from "@/data/legal";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <article>
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {document.title}
        </h1>
        <p className="mt-3 text-muted">{document.summary}</p>
        <p className="mt-2 text-xs text-muted">Last updated: {document.lastUpdated}</p>
      </header>

      <div className="space-y-8">
        {document.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
            {section.paragraphs.map((paragraph) =>
              paragraph ? (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ) : null
            )}
            {section.bullets?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
