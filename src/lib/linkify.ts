export type TextPart = { type: "text" | "link"; value: string; href?: string };

// Matches http(s) URLs, www. URLs, and bare domains (optionally with a path)
// such as ujafedny.org/domestic-violence-resources. Phone numbers and other
// dot-free text never match.
const URL_PATTERN =
  /\b(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<>"']*)?)/gi;

// Punctuation that belongs to the sentence, not the URL.
const TRAILING = /[.,;:!?)\]}"']+$/;

/** Split text into plain-text and link parts so links can render clickable. */
export function splitTextLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    let value = match[0];
    let end = match.index + value.length;
    const trailing = value.match(TRAILING);
    if (trailing) {
      value = value.slice(0, value.length - trailing[0].length);
      end -= trailing[0].length;
    }
    if (!value) continue;
    if (match.index > last) parts.push({ type: "text", value: text.slice(last, match.index) });
    parts.push({
      type: "link",
      value,
      href: /^https?:\/\//i.test(value) ? value : `https://${value}`,
    });
    last = end;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
