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

test("phone numbers and plain text never become links", () => {
  for (const text of [
    "call 1-800-799-SAFE, 24/7",
    "call 116 016 in Germany",
    "no dots here at all",
  ]) {
    assert.deepEqual(splitTextLinks(text), [{ type: "text", value: text }]);
  }
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
