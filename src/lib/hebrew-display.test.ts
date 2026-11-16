import { test } from "node:test";
import { strict as assert } from "node:assert";
import { allowsHebrew, displayLanguage } from "./hebrew-display";

test("selecting Israel permits Hebrew without a location lookup", () => {
  assert.equal(allowsHebrew("IL", "en", null), true);
  assert.equal(displayLanguage("he", "IL", null), "he");
});
test("selecting Hebrew always displays Hebrew regardless of country or location permission", () => {
  assert.equal(displayLanguage("he", null, "IL"), "he");
  assert.equal(displayLanguage("he", "US", "US"), "he");
  assert.equal(displayLanguage("he", null, null), "he");
  assert.equal(allowsHebrew("US", "he", null), true);
});
test("Israel location alone does not permit Hebrew without Hebrew selection", () => {
  assert.equal(allowsHebrew(null, "en", "IL"), false);
  assert.equal(displayLanguage("en", "IL", "IL"), "en");
});