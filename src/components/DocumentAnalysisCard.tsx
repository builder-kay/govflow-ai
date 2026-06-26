import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import type { DocumentAnalysis } from "@/types";

interface DocumentAnalysisCardProps {
  analysis: DocumentAnalysis;
}

export function DocumentAnalysisCard({ analysis }: DocumentAnalysisCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <Badge variant="gold" className="mb-2 w-fit">
          AI Analysis
        </Badge>
        <CardTitle className="text-xl">{analysis.documentType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h4 className="mb-2 font-semibold text-foreground">What this document is for</h4>
          <p className="text-sm leading-relaxed text-muted">{analysis.purpose}</p>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Important sections
          </h4>
          <ul className="space-y-1">
            {analysis.importantSections.map((section) => (
              <li key={section} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {section}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Missing or risky areas
          </h4>
          <ul className="space-y-2">
            {analysis.missingAreas.map((area) => (
              <li
                key={area}
                className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-soft-blue p-4">
          <h4 className="mb-1 flex items-center gap-2 font-semibold text-primary-dark">
            <ArrowRight className="h-4 w-4" />
            Next action
          </h4>
          <p className="text-sm text-primary-dark">{analysis.nextAction}</p>
        </div>

        <p className="text-xs text-muted italic">
          Document explanations are for guidance only. Review official forms carefully before submission.
        </p>
      </CardContent>
    </Card>
  );
}
