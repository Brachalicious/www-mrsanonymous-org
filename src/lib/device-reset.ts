import type { DraftStorage } from "./note-drafts";

/** Only this app's readable device data; never unrelated browser state or moderation cookies. */
export function clearDeviceData(local: DraftStorage, session: DraftStorage) {
  for (const storage of [local, session]) {
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (key && (key.startsWith("mrsanon:") || key.startsWith("calc_disguise_") || key === "terms_accepted_v1")) {
        storage.removeItem(key);
      }
    }
  }
}