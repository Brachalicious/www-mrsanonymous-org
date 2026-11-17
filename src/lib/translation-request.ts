export type TranslationResult = { text: string; translated: boolean };
export const TRANSLATION_STATUS_EVENT = "mrsanon:translation-status";
let blockedUntil = 0;
let pending = new Map<string, Promise<TranslationResult>>();

function notify(unavailable: boolean) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(TRANSLATION_STATUS_EVENT, { detail: unavailable }));
}

export function resetTranslationRequests() {
  blockedUntil = 0;
  pending = new Map();
  notify(false);
}

// Only successful results are cached by callers. A blocked service must not
// turn an English fallback into a permanent "translation".
export async function requestTranslation(text: string, target: string, source: string): Promise<TranslationResult> {
  const fallback = { text, translated: false };
  if (Date.now() < blockedUntil) return fallback;
  const key = JSON.stringify([source, target, text]);
  const existing = pending.get(key);
  if (existing) return existing;
  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const url = new URL("https://translate.googleapis.com/translate_a/single");
      url.search = new URLSearchParams({ client: "gtx", sl: source, tl: target, dt: "t", q: text }).toString();
      const response = await fetch(url, { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" });
      if (!response.ok) throw new Error("Translation unavailable");
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Invalid translation");
      const value = data[0].map((segment: unknown) => Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : "").join("");
      if (!value.trim()) throw new Error("Empty translation");
      notify(false);
      return { text: value, translated: true };
    } catch {
      blockedUntil = Date.now() + 60_000;
      notify(true);
      return fallback;
    } finally {
      clearTimeout(timer);
      pending.delete(key);
    }
  })();
  pending.set(key, request);
  return request;
}