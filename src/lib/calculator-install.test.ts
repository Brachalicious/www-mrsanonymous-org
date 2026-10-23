import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

for (const file of ["manifest.webmanifest", "manifest-calc.webmanifest"]) {
  test(`${file} installs as Calculator with the red calculator artwork`, () => {
    const manifest = JSON.parse(readFileSync(new URL(`../../public/${file}`, import.meta.url), "utf8"));
    assert.equal(manifest.id, "/");
    assert.equal(manifest.name, "Calculator");
    assert.equal(manifest.short_name, "Calculator");
    assert.equal(manifest.start_url, "/?m=calc");
    assert.ok(manifest.icons.some((icon: { src: string }) => icon.src === "/calc-icon-512.png"));
    assert.ok(manifest.icons.every((icon: { src: string }) => icon.src.startsWith("/calc-icon-")));
    assert.equal(manifest.shortcuts?.length ?? 0, 0);
  });
}