import { test } from "node:test";
import { strict as assert } from "node:assert";
import { orderPages, requirePageOwner, triggerWarningsSchema, requireDeletableAccount, pinPageSchema } from "./board-options";

test("writer-selected warnings persist as distinct supported triggers", () => {
  assert.deepEqual(triggerWarningsSchema.parse(["Suicide", "Physical violence", "Suicide"]), ["Suicide", "Physical violence"]);
  assert.equal(triggerWarningsSchema.safeParse(["invalid"]).success, false);
});
test("pinned pages go on top only in the supplied notebook stack", () => {
  const pages = [{ id: "new", pinned_at: null, created_at: "2026-10-22" }, { id: "first", pinned_at: "2026-10-21", created_at: "2026-10-01" }, { id: "top", pinned_at: "2026-10-22", created_at: "2026-09-01" }];
  assert.deepEqual(orderPages(pages).map((page) => page.id), ["top", "first", "new"]);
  assert.equal(pages[0].id, "new");
});
test("only the page owner may pin and callers cannot supply ownership", () => {
  assert.throws(() => requirePageOwner("writer", "other"), /Forbidden/);
  assert.doesNotThrow(() => requirePageOwner("writer", "writer"));
  const parsed = pinPageSchema.parse({ id: "c27a54c7-17df-4b99-bc6d-2c2d2822b935", pinned: true, ownerId: "other" });
  assert.equal("ownerId" in parsed, false);
});
test("individual account deletion protects current and other admin accounts", () => {
  assert.throws(() => requireDeletableAccount("admin", "admin", false));
  assert.throws(() => requireDeletableAccount("admin", "another-admin", true));
  assert.doesNotThrow(() => requireDeletableAccount("admin", "writer", false));
});