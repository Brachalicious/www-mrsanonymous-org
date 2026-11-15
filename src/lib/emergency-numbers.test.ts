import { test } from "node:test";
import { strict as assert } from "node:assert";
import { getEmergency } from "./emergency-numbers";

test("Israel offers a police text line and marks it as the accessibility desk", () => {
  const il = getEmergency("he", "IL");
  assert.equal(il.country, "IL");
  assert.equal(il.police, "100");
  assert.equal(il.sms, "0522020100");
  assert.equal(il.smsSupported, true);
  assert.equal(il.smsNoteKey, "israel-accessibility");
});

test("an English speaker living in Israel gets the same Israel numbers", () => {
  const il = getEmergency("en", "IL");
  assert.equal(il.police, "100");
  assert.equal(il.medical, "101");
  assert.equal(il.sms, "0522020100");
  assert.equal(il.smsNoteKey, "israel-accessibility");
});

test("countries with no public text-to-police service hide the text button", () => {
  assert.equal(getEmergency("es", "ES").smsSupported, false);
  assert.equal(getEmergency("de", "DE").smsSupported, false);
  // France does have a public text line: 114.
  assert.equal(getEmergency("fr", "FR").sms, "114");
  assert.equal(getEmergency("fr", "FR").smsSupported, true);
});

test("a Spanish speaker living in the United States gets 911, not 112", () => {
  const us = getEmergency("es", "US");
  assert.equal(us.country, "US");
  assert.equal(us.police, "911");
  assert.equal(us.sms, "911");
  assert.equal(us.smsSupported, true);
});

test("an unlisted country falls back to the language default", () => {
  const unknown = getEmergency("es", "ZZ");
  assert.equal(unknown.country, "ES");
  assert.equal(unknown.police, "112");
});
