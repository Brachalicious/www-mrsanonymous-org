import { test } from "node:test";
import { strict as assert } from "node:assert";
import { splitTextLinks } from "./linkify";

test("https URLs become links with their own href", () => {
  const parts = splitTextLinks("In Canada, ShelterSafe (https://sheltersafe.ca/) can help.");
  assert.deepEqual(parts, [
    { type: "text", value: "In Canada, ShelterSafe (" },
    { type: "link", value: "https://sheltersafe.ca/", href: "https://sheltersafe.ca/" },
    { type: "text", value: ") can help." },
  ]);
});

test("bare domains with paths become https links", () => {
  const parts = splitTextLinks("see ujafedny.org/domestic-violence-resources for help");
  assert.deepEqual(parts, [
    { type: "text", value: "see " },
    {
      type: "link",
      value: "ujafedny.org/domestic-violence-resources",
      href: "https://ujafedny.org/domestic-violence-resources",
    },
    { type: "text", value: " for help" },
  ]);
});

test("www URLs gain an https href", () => {
  const parts = splitTextLinks("visit www.example.org/page");
  assert.deepEqual(parts, [
    { type: "text", value: "visit " },
    { type: "link", value: "www.example.org/page", href: "https://www.example.org/page" },
  ]);
});

test("sentence punctuation after a URL stays plain text", () => {
  const parts = splitTextLinks("use https://nomoredirectory.org/.");
  assert.deepEqual(parts, [
    { type: "text", value: "use " },
    { type: "link", value: "https://nomoredirectory.org/", href: "https://nomoredirectory.org/" },
    { type: "text", value: "." },
  ]);
});

test("dashed phone numbers become tel links", () => {
  const parts = splitTextLinks("call 1-800-799-7233 anytime");
  assert.deepEqual(parts, [
    { type: "text", value: "call " },
    { type: "tel", value: "1-800-799-7233", href: "tel:18007997233" },
    { type: "text", value: " anytime" },
  ]);
});

test("parenthesized and international phone numbers become tel links", () => {
  const parts = splitTextLinks("dial (800) 799-7233 or +44 808 2000 247");
  const tels = parts.filter((p) => p.type === "tel");
  assert.equal(tels.length, 2);
  assert.equal(tels[0].href, "tel:8007997233");
  assert.equal(tels[1].href, "tel:+448082000247");
});

test("short emergency numbers become tel links", () => {
  const parts = splitTextLinks("In Israel call 100, in the US call 911.");
  const tels = parts.filter((p) => p.type === "tel");
  assert.equal(tels.length, 2);
  assert.equal(tels[0].href, "tel:100");
  assert.equal(tels[1].href, "tel:911");
});

test("plain text and small numbers never become links", () => {
  for (const text of ["no dots here at all", "there are 24 languages and 3 steps", "year 2026"]) {
    assert.deepEqual(splitTextLinks(text), [{ type: "text", value: text }]);
  }
});

test("vanity numbers with letters stay plain text", () => {
  const parts = splitTextLinks("call 1-800-799-SAFE (7233) or 1-800-656-HOPE");
  assert.equal(parts.filter((p) => p.type === "tel").length, 0);
});

test("988 crisis lifeline becomes a tel link", () => {
  const parts = splitTextLinks("call or text 988, 24/7");
  const tels = parts.filter((p) => p.type === "tel");
  assert.equal(tels.length, 1);
  assert.equal(tels[0].href, "tel:988");
});

test("digits inside URLs never become tel links", () => {
  const parts = splitTextLinks("see https://example.org/1-800-799-7233 now");
  assert.equal(parts.filter((p) => p.type === "tel").length, 0);
  assert.equal(parts.filter((p) => p.type === "link").length, 1);
});

test("multiple links in one answer all become clickable", () => {
  const parts = splitTextLinks(
    "FreeFrom (https://www.freefrom.org/) and domesticshelters.org/articles/financial help.",
  );
  const links = parts.filter((p) => p.type === "link");
  assert.equal(links.length, 2);
  assert.equal(links[0].href, "https://www.freefrom.org/");
  assert.equal(links[1].href, "https://domesticshelters.org/articles/financial");
});
