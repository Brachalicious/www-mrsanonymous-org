// Shared, browser-safe message shape for the built-in (no AI) guidance guide.

export interface GuidanceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export function newGuidanceMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Stored rows come in two shapes:
 *  - the older assistant-sdk shape: { id, role, parts: [{ type: "text", text }] }
 *  - the built-in guide shape: { id, role, text }
 * Anything unreadable is dropped rather than rendered as junk.
 */
export function normalizeStoredMessage(row: unknown): GuidanceMessage | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;
  const role = record.role;
  if (role !== "user" && role !== "assistant") return null;
  const id = typeof record.id === "string" ? record.id : newGuidanceMessageId();
  if (typeof record.text === "string") {
    return record.text.trim() ? { id, role, text: record.text } : null;
  }
  if (Array.isArray(record.parts)) {
    const text = record.parts
      .filter(
        (part): part is { type: string; text: string } =>
          Boolean(part) &&
          typeof part === "object" &&
          (part as { type?: unknown }).type === "text" &&
          typeof (part as { text?: unknown }).text === "string",
      )
      .map((part) => part.text)
      .join("");
    return text.trim() ? { id, role, text } : null;
  }
  return null;
}

export function normalizeStoredMessages(rows: readonly unknown[]): GuidanceMessage[] {
  const out: GuidanceMessage[] = [];
  for (const row of rows) {
    const message = normalizeStoredMessage(row);
    if (message) out.push(message);
  }
  return out;
}

export function toStoredMessage(message: GuidanceMessage) {
  return { id: message.id, role: message.role, text: message.text };
}
