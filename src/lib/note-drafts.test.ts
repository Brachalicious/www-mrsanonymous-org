import { test } from "node:test";
import { strict as assert } from "node:assert";
import { clearNoteDrafts, draftKey, readNoteDraft, writeNoteDraft, type DraftStorage } from "./note-drafts";

function storage(): DraftStorage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    key: i => [...data.keys()][i] ?? null,
    getItem: k => data.get(k) ?? null,
    setItem: (k, v) => { data.set(k, v); },
    removeItem: k => { data.delete(k); },
  };
}

test("two unsaved lines and mood recover after editor recreation", () => {
  const tab = storage();
  const key = draftKey("writer-a", "notebook-1");
  const draft = { content: "First line\nSecond line", mood: "Hopeful" };
  writeNoteDraft(tab, key, draft);
  assert.deepEqual(readNoteDraft(tab, key, { content: "", mood: "" }), draft);
});
test("different accounts and notebooks cannot restore each other's drafts", () => {
  const tab = storage();
  writeNoteDraft(tab, draftKey("writer-a", "book-1"), "private text");
  assert.equal(readNoteDraft(tab, draftKey("writer-b", "book-1"), ""), "");
  assert.equal(readNoteDraft(tab, draftKey("writer-a", "book-2"), ""), "");
});
test("successful save clears only that draft", () => {
  const tab = storage();
  const key = draftKey("writer-a", "book-1");
  writeNoteDraft(tab, key, "saved text");
  writeNoteDraft(tab, draftKey("writer-a", "journal"), "other draft");
  tab.removeItem(key);
  assert.equal(readNoteDraft(tab, key, ""), "");
  assert.equal(readNoteDraft(tab, draftKey("writer-a", "journal"), ""), "other draft");
});
test("sign-out or quick exit removes temporary notes, not unrelated tab data", () => {
  const tab = storage();
  writeNoteDraft(tab, draftKey("writer-a", "journal"), { happened: "private" });
  tab.setItem("unrelated", "keep");
  clearNoteDrafts(tab);
  assert.equal(readNoteDraft(tab, draftKey("writer-a", "journal"), null), null);
  assert.equal(tab.getItem("unrelated"), "keep");
});