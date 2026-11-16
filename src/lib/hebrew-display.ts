import type { LangCode } from "./translations";

export function allowsHebrew(selectedCountry: string | null, selectedLanguage: LangCode, detectedCountry: string | null): boolean {
  return selectedCountry === "IL" || (selectedLanguage === "he" && detectedCountry === "IL");
}

export function displayLanguage(selectedLanguage: LangCode, selectedCountry: string | null, detectedCountry: string | null): LangCode {
  return selectedLanguage === "he" && !allowsHebrew(selectedCountry, selectedLanguage, detectedCountry) ? "en" : selectedLanguage;
}