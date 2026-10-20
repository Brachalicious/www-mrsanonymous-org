import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { validGuidanceQuestion } from "./guidance-input";

describe("guidance question validation", () => {
  test("accepts the 4000-character limit", () => {
    assert.equal(validGuidanceQuestion("a".repeat(4000)), true);
    assert.equal(validGuidanceQuestion("a".repeat(4001)), false);
  });
  test("rejects empty questions", () => {
    assert.equal(validGuidanceQuestion("  "), false);
    assert.equal(validGuidanceQuestion("Help"), true);
  });
});
