import type { LangCode } from "./translations";

export function allowsHebrew(selectedCountry: string | null, selectedLanguage: LangCode, _detectedCountry: string | null): boolean {
  return selectedCountry === "IL" || selectedLanguage === "he";
}

export function displayLanguage(selectedLanguage: LangCode, _selectedCountry: string | null, _detectedCountry: string | null): LangCode {
  return selectedLanguage;
}