import { test } from "node:test";
import { strict as assert } from "node:assert";
import { localTranslation } from "./translations";
import { safetyTranslations, hasSafetyMeaningError } from "./safety-translations";

test("Hebrew safety describes personal protection rather than a money safe", () => {
  assert.equal(localTranslation("Safety", "he"), "ביטחון אישי");
  assert.equal(localTranslation("My Safety Plan", "he"), "תוכנית הבטיחות האישית שלי");
  assert.equal(localTranslation("A safe &", "he"), "מרחב בטוח ו");
  for (const value of Object.values(safetyTranslations.he ?? {})) {
    assert.equal(value.includes("כספת"), false);
  }
});

test("reject money-safe translations of personal safety without rewriting actual financial safes", () => {
  assert.equal(hasSafetyMeaningError("Keep yourself safe", "שמרי על עצמך בכספת", "he"), true);
  assert.equal(hasSafetyMeaningError("Store cash in a safe", "שמרי כסף בכספת", "he"), false);
  assert.equal(localTranslation("Safe", "he"), "בטוחה");
  assert.equal(localTranslation("Your safe word or code phrase", "he"), "מילת הקוד או הביטוי המוסכם שלך");
});
