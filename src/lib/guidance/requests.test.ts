import { test } from "node:test";
import { strict as assert } from "node:assert";
import { guidanceIsWaiting, waitForGuidance } from "./requests";

test("a disabled saved-thread query and a create error cannot trap the mascot in loading", () => {
  assert.equal(guidanceIsWaiting({ listing: false, creating: false, loading: true, error: null }), false);
  assert.equal(guidanceIsWaiting({ listing: false, creating: false, loading: true, error: new Error("Failed") }), false);
  assert.equal(guidanceIsWaiting({ listing: false, creating: false, loading: true, threadId: "existing", error: null }), true);
});

test("stalled guide requests end waiting without replaying a possibly saved write", async () => {
  let calls = 0;
  const request = new Promise<never>(() => { calls++; });
  await assert.rejects(waitForGuidance(request, 5), /reopen the conversation/);
  assert.equal(calls, 1);
  assert.equal(await waitForGuidance(Promise.resolve("loaded"), 5), "loaded");
});