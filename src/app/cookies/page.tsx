import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { cookiePolicy } from "@/data/legal";

export default function CookiesPage() {
  return <LegalPageShell document={cookiePolicy} />;
}
