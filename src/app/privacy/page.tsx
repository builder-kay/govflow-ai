import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { privacyPolicy } from "@/data/legal";

export default function PrivacyPage() {
  return <LegalPageShell document={privacyPolicy} />;
}
