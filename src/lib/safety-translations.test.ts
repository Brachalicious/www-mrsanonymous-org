import { test } from "node:test";
import { strict as assert } from "node:assert";
import { LANGUAGES, localTranslation } from "./translations";
import { safetyTranslations } from "./safety-translations";

test("Hebrew safety describes personal protection rather than a money safe", () => {
  assert.equal(localTranslation("Safety", "he"), "ביטחון אישי");
  assert.equal(localTranslation("My Safety Plan", "he"), "תוכנית הבטיחות האישית שלי");
  assert.equal(localTranslation("A safe &", "he"), "מרחב בטוח ו");
  for (const value of Object.values(safetyTranslations.he ?? {})) {
    assert.equal(value.includes("כספת"), false);
  }
});
