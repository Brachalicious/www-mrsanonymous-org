import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { detectCountry } from "@/lib/emergency-numbers";

const KEY = "mrsanon:country";

/**
 * The visitor's country, used to route emergency numbers and local resources.
 * Prefers the country explicitly chosen on this device, then the country saved
 * on the signed-in profile, then a best-effort guess from the browser locale.
 */
export function useRegion() {
  const { profile } = useAuth();
  const [stored, setStored] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      try { setStored(localStorage.getItem(KEY)); } catch { /* ignore */ }
    };
    refresh();
    setSuggested(detectCountry());
    window.addEventListener("mrsanon:country-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("mrsanon:country-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const profileCountry = (profile as { country?: string | null } | null)?.country ?? null;

  const setCountry = useCallback((code: string) => {
    setStored(code);
    try {
      localStorage.setItem(KEY, code);
      window.dispatchEvent(new Event("mrsanon:country-changed"));
    } catch {
      /* ignore */
    }
  }, []);

  const country = stored ?? profileCountry ?? suggested;

  // True when the number came from a real choice (this device or the profile)
  // rather than from the browser-locale guess.
  const isChosen = Boolean(stored ?? profileCountry);

  return { country, setCountry, isChosen };
}
