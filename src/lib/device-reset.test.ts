import { test } from "node:test";
import { strict as assert } from "node:assert";
import { clearDeviceData } from "./device-reset";
import type { DraftStorage } from "./note-drafts";

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

test("device reset removes saved addresses, emergency text, safety plan and device preferences", () => {
  const local = storage(); const session = storage();
  const keys = ["mrsanon:saved-addresses", "mrsanon:saved-address-default", "mrsanon:panic-message", "mrsanon:panic-story", "mrsanon:safety-plan:v1", "mrsanon:country", "mrsanon:lang", "mrsanon:inbox-codeword:owner", "mrsanon:inbox-bio:owner"];
  keys.forEach(key => local.setItem(key, "private"));
  clearDeviceData(local, session);
  keys.forEach(key => assert.equal(local.getItem(key), null));
});
test("device reset removes calculator locks and temporary drafts so a normal site visit starts fresh", () => {
  const local = storage(); const session = storage();
  local.setItem("calc_disguise_enabled", "1");
  local.setItem("calc_disguise_passcode", "7+3");
  local.setItem("terms_accepted_v1", "1");
  session.setItem("calc_disguise_unlocked", "1");
  session.setItem("mrsanon:note-draft:owner:journal", "private");
  session.setItem("mrsanon:exited", "1");
  clearDeviceData(local, session);
  assert.equal(local.length, 0); assert.equal(session.length, 0);
});
test("device reset does not wipe unrelated storage or pretend to delete an account", () => {
  const local = storage(); const session = storage();
  local.setItem("unrelated", "keep"); session.setItem("unrelated-tab", "keep");
  clearDeviceData(local, session);
  assert.equal(local.getItem("unrelated"), "keep");
  assert.equal(session.getItem("unrelated-tab"), "keep");
});