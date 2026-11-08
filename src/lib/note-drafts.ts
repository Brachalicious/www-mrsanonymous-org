// Temporary, tab-scoped recovery only: never localStorage or Cloud autosaving.
const PREFIX = "mrsanon:note-draft:";

export interface DraftStorage {
  length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function draftKey(owner: string, editor: string) {
  return `${PREFIX}${encodeURIComponent(owner)}:${encodeURIComponent(editor)}`;
}

export function readNoteDraft<T>(storage: DraftStorage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeNoteDraft<T>(storage: DraftStorage, key: string, value: T) {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* Keep the live editor usable. */ }
}

export function clearNoteDrafts(storage?: DraftStorage) {
  try {
    const target = storage ?? window.sessionStorage;
    for (let i = target.length - 1; i >= 0; i--) {
      const key = target.key(i);
      if (key?.startsWith(PREFIX)) target.removeItem(key);
    }
  } catch { /* Storage may be unavailable. */ }
}