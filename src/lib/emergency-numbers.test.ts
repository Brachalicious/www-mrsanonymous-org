import { test } from "node:test";
import { strict as assert } from "node:assert";
import { COUNTRY_OPTIONS, getEmergency } from "./emergency-numbers";

test("every selectable emergency country keeps its numbers when the language changes", () => {
  for (const { code } of COUNTRY_OPTIONS) {
    const english = getEmergency("en", code);
    const hebrew = getEmergency("he", code);
    assert.equal(english.country, code);
    assert.equal(hebrew.police, english.police);
    assert.equal(hebrew.sms, english.sms);
  }
});

test("selected country determines the emergency destination, not the display language", () => {
  assert.equal(getEmergency("en", "IL").police, "100");
  assert.equal(getEmergency("he", "US").police, "911");
  assert.equal(getEmergency("he", "GB").police, "999");
  assert.equal(getEmergency("he", "AU").police, "000");
  assert.equal(getEmergency("he", "NZ").police, "111");
  assert.equal(getEmergency("he", "DE").police, "110");
});

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

test("an absent country never infers Israel or Spain from the language", () => {
  assert.equal(getEmergency("he").police, "911");
  assert.equal(getEmergency("es").police, "911");
});

test("saved country codes are normalized before choosing the emergency destination", () => {
  assert.equal(getEmergency("en", " il ").police, "100");
});

const expectedPolice: Record<string, string> = {
  US: "911", CA: "911", GB: "999", IE: "112", AU: "000", NZ: "111",
  IL: "100", IN: "112", PK: "15", BD: "999", PH: "911", ID: "112",
  JP: "110", KR: "112", CN: "110", VN: "113", RU: "112", UA: "112",
  TR: "112", IR: "110", ZA: "10111", NG: "112", KE: "112", EG: "122",
  MX: "911", BR: "190", AR: "911", ES: "112", FR: "112", DE: "110",
  IT: "112", PT: "112", NL: "112", BE: "112", PL: "112", SE: "112",
  SG: "999",
  CL: "133",
  CO: "123",
  PE: "105",
  EC: "911",
  UY: "911",
  CR: "911",
  GR: "112",
  RO: "112",
  CZ: "112",
  HU: "112",
  HR: "112",
  RS: "112",
  BG: "112",
  TW: "110",
  HK: "999",
  TH: "191",
  MY: "999",
  LK: "119",
  NP: "100",
  MA: "19",
  GH: "191",
  TZ: "112",
  UG: "112",
  ET: "991",
  QA: "999",
  KW: "112",
  JO: "911",
  LB: "112",
  KZ: "112",
  GE: "112",
  NO: "112", DK: "112", FI: "112", CH: "117", AT: "133", AE: "999", SA: "999",
};

for (const [code, number] of Object.entries(expectedPolice)) {
  test(`${code} calls ${number} in both Hebrew and English`, () => {
    assert.equal(getEmergency("he", code).police, number);
    assert.equal(getEmergency("en", code).police, number);
  });
}

test("each named country in the emergency picker has a concrete number expectation", () => {
  for (const { code } of COUNTRY_OPTIONS.filter((c) => c.code !== "INT")) {
    assert.ok(expectedPolice[code], `Missing expected number for ${code}`);
  }
});
