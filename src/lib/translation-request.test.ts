import { test } from "node:test";
import { strict as assert } from "node:assert";
import { requestTranslation, resetTranslationRequests } from "./translation-request";

test("blocked translation requests preserve the source and stop repeat requests", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("rate limited", { status: 429 }); };
  resetTranslationRequests();
  try {
    assert.deepEqual(await requestTranslation("Resources", "he", "en"), { text: "Resources", translated: false });
    await requestTranslation("Women", "he", "en");
    assert.equal(calls, 1);
    resetTranslationRequests();
    globalThis.fetch = async () => new Response(JSON.stringify([[["מקורות סיוע", "Resources"]]]));
    assert.deepEqual(await requestTranslation("Resources", "he", "en"), { text: "מקורות סיוע", translated: true });
  } finally { globalThis.fetch = original; resetTranslationRequests(); }
});

test("malformed translation cannot be cached as success", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ error: "blocked" }));
  resetTranslationRequests();
  try { assert.deepEqual(await requestTranslation("Help", "he", "en"), { text: "Help", translated: false }); }
  finally { globalThis.fetch = original; resetTranslationRequests(); }
});