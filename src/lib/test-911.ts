// Test mode for the Text-911 feature. Open the app once with
// ?test911=<number> to route emergency texts to that number instead of 911.
// Open with ?test911=off to clear. Stored on this device only.

const LS_KEY = "mrsanon:test911";

export function initTest911(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("test911");
  if (value === null) return;
  if (value === "off" || value === "") {
    localStorage.removeItem(LS_KEY);
  } else {
    const digits = value.replace(/[^\d+]/g, "");
    if (digits) localStorage.setItem(LS_KEY, digits);
  }
  // Remove the param from the address bar so it isn't shared accidentally.
  params.delete("test911");
  const clean = params.toString();
  const url = `${window.location.pathname}${clean ? `?${clean}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);
}

export function getTest911Number(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_KEY);
}

/** The number emergency texts should go to right now (test override wins). */
export function resolveSmsNumber(realNumber: string): string {
  return getTest911Number() ?? realNumber;
}
