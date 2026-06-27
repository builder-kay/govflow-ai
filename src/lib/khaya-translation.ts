export const KHAYA_TRANSLATION_BASE_URL = "https://translation-api.ghananlp.org/v2";

export const APP_LANGUAGE_TO_ISO6393: Record<string, string> = {
  English: "eng",
};

export function getIsoCodeForAppLanguage(language: string): string {
  return APP_LANGUAGE_TO_ISO6393[language] ?? "eng";
}

export function buildLanguagePair(source: string, target: string): string {
  return `${source}-${target}`;
}
