export type TextPart = { type: "text" | "link" | "tel"; value: string; href?: string };

// Matches http(s) URLs, www. URLs, and bare domains (optionally with a path)
// such as ujafedny.org/domestic-violence-resources.
const URL_PATTERN =
  /\b(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<>"']*)?)/gi;

// Matches phone numbers: international (+1-800-...), parenthesized area codes
// ((800) 799-7233), dashed/dotted/spaced groups (800-799-7233), and short
// emergency/crisis numbers (911, 100, 112, 999, 000, 988, 118). Requires at
// least 7 digits for long numbers so years and small counts never match. The
// lookahead keeps vanity numbers like 1-800-799-SAFE plain: a digit run
// followed by letters is not dialable.
const PHONE_PATTERN =
  /(?:\+?\d[\d\s().-]{6,}\d(?![\s().-]*[A-Za-z])|\b(?:911|112|999|100|000|988|118)\b)/g;

// Punctuation that belongs to the sentence, not the URL.
const TRAILING = /[.,;:!?)\]}"']+$/;

function digitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

/** Split text into plain-text, web-link and phone parts so both render clickable. */
export function splitTextLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;

  // Collect URL matches first so phone matching never fires inside a URL.
  const urls: { start: number; end: number; value: string }[] = [];
  for (const match of text.matchAll(URL_PATTERN)) {
    let value = match[0];
    let end = match.index + value.length;
    const trailing = value.match(TRAILING);
    if (trailing) {
      value = value.slice(0, value.length - trailing[0].length);
      end -= trailing[0].length;
    }
    if (value) urls.push({ start: match.index, end, value });
  }

  const phones: { start: number; end: number; value: string }[] = [];
  for (const match of text.matchAll(PHONE_PATTERN)) {
    const value = match[0];
    const start = match.index;
    const end = start + value.length;
    if (digitCount(value) < 3) continue;
    if (urls.some((u) => start < u.end && end > u.start)) continue;
    phones.push({ start, end, value });
  }

  const hits = [
    ...urls.map((u) => ({ ...u, kind: "link" as const })),
    ...phones.map((p) => ({ ...p, kind: "tel" as const })),
  ].sort((a, b) => a.start - b.start);

  for (const hit of hits) {
    if (hit.start < last) continue;
    if (hit.start > last) parts.push({ type: "text", value: text.slice(last, hit.start) });
    if (hit.kind === "link") {
      parts.push({
        type: "link",
        value: hit.value,
        href: /^https?:\/\//i.test(hit.value) ? hit.value : `https://${hit.value}`,
      });
    } else {
      parts.push({
        type: "tel",
        value: hit.value,
        href: `tel:${hit.value.replace(/[^\d+]/g, "")}`,
      });
    }
    last = hit.end;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
