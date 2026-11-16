import { test } from "node:test";
import { strict as assert } from "node:assert";
import { allowsHebrew, displayLanguage } from "./hebrew-display";

test("selecting Israel permits Hebrew without a location lookup", () => {
  assert.equal(allowsHebrew("IL", "en", null), true);
  assert.equal(displayLanguage("he", "IL", null), "he");
});
test("Hebrew selection requires a detected Israel location otherwise", () => {
  assert.equal(displayLanguage("he", null, "IL"), "he");
  assert.equal(displayLanguage("he", "US", "US"), "en");
  assert.equal(displayLanguage("he", null, null), "en");
});
test("Israel location alone does not permit Hebrew without Hebrew selection", () => {
  assert.equal(allowsHebrew(null, "en", "IL"), false);
  assert.equal(displayLanguage("en", "IL", "IL"), "en");
});