import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { termsOfService } from "@/data/legal";

export default function TermsPage() {
  return <LegalPageShell document={termsOfService} />;
}
