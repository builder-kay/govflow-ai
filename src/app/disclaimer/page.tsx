import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { disclaimer } from "@/data/legal";

export default function DisclaimerPage() {
  return <LegalPageShell document={disclaimer} />;
}
