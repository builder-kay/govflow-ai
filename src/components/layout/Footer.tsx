import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LegalNavLinks } from "@/components/legal/LegalNavLinks";
import { LEGAL_OPERATOR } from "@/data/legal";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <LegalNavLinks variant="inline" />
        <p className="text-xs leading-relaxed text-muted">
          GovFlow AI helps users understand and prepare for government services. It does not replace
          official government agencies, legal advice, or official application portals. Always confirm
          final requirements, fees, and timelines from the responsible agency.
        </p>
        <p className="text-xs text-muted">
          Need to chat admin?{" "}
          <Link
            href="https://wa.me/233504378971"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp support: +233504378971
          </Link>
        </p>
        <p className="text-xs text-muted">
          Built and managed by {LEGAL_OPERATOR} © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
