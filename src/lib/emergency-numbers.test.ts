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

test("text lines that need registration or a special device are not offered as general texting", () => {
  // UK 999 text needs the phone registered with EmergencySMS in advance.
  assert.equal(getEmergency("en", "GB").smsSupported, false);
  assert.equal(getEmergency("en", "GB").smsNoteKey, "uk-registration");
  // Canada's Text with 9-1-1 needs carrier registration and is not everywhere.
  assert.equal(getEmergency("en", "CA").smsSupported, false);
  assert.equal(getEmergency("en", "CA").smsNoteKey, "ca-registration");
  // Australia 106 is a TTY relay line; SMS never reaches 000.
  assert.equal(getEmergency("en", "AU").smsSupported, false);
  assert.equal(getEmergency("en", "AU").smsNoteKey, "au-tty");
  // NZ 111 TXT needs prior registration with NZ Police.
  assert.equal(getEmergency("en", "NZ").smsSupported, false);
  assert.equal(getEmergency("en", "NZ").smsNoteKey, "nz-registration");
});

test("France's 114 stays available but is labelled as the cannot-speak line", () => {
  const fr = getEmergency("fr", "FR");
  assert.equal(fr.smsSupported, true);
  assert.equal(fr.smsNoteKey, "fr-accessibility");
});

test("the United States is the general no-registration text-to-police line", () => {
  const us = getEmergency("en", "US");
  assert.equal(us.sms, "911");
  assert.equal(us.smsSupported, true);
  assert.equal(us.smsNoteKey, undefined);
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
