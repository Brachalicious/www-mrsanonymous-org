import { useEffect, useState, type SetStateAction } from "react";
import { draftKey, readNoteDraft, writeNoteDraft } from "@/lib/note-drafts";

export function useNoteDraft<T>(owner: string | undefined, editor: string, initial: T) {
  const key = owner ? draftKey(owner, editor) : null;
  const [state, setState] = useState<{ key: string | null; value: T }>({ key: null, value: initial });
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const value = state.key === key ? state.value : initial;

  // Read only after hydration and after the account identity is known.
  useEffect(() => {
    if (!key) {
      setState({ key: null, value: initial });
      setReadyKey(null);
      return;
    }
    let restored = initial;
    try { restored = readNoteDraft(window.sessionStorage, key, initial); } catch { /* memory only */ }
    setState({ key, value: restored });
    setReadyKey(key);
    // The editor identity, not a fresh initial object, controls restoration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function setValue(next: SetStateAction<T>) {
    if (!key || readyKey !== key) return;
    const updated = typeof next === "function" ? (next as (previous: T) => T)(value) : next;
    // Write synchronously on input: a page recreation must not outrun an effect.
    try { writeNoteDraft(window.sessionStorage, key, updated); } catch { /* memory only */ }
    setState({ key, value: updated });
  }

  function clear() {
    if (key) {
      try { window.sessionStorage.removeItem(key); } catch { /* memory only */ }
    }
    setState({ key, value: initial });
  }

  return { value, setValue, clear, ready: Boolean(key && readyKey === key) };
}