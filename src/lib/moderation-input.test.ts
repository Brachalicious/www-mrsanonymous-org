import { test } from "node:test";
import { strict as assert } from "node:assert";
import { boardModerationSchema, requireAdminRole } from "./moderation-input";

const notebookId = "c27a54c7-17df-4b99-bc6d-2c2d2822b935";
test("only verified admins can moderate board posts", () => {
  assert.throws(() => requireAdminRole(false), /Forbidden/);
  assert.throws(() => requireAdminRole(null), /Forbidden/);
  assert.throws(() => requireAdminRole(true, new Error("role lookup failed")), /Forbidden/);
  assert.doesNotThrow(() => requireAdminRole(true));
});
test("admin may remove a board post without notifying its writer", () => {
  assert.equal(boardModerationSchema.parse({ notebookId, remove: true }).remove, true);
});
test("messaging a writer without removal requires a policy notice", () => {
  assert.equal(boardModerationSchema.safeParse({ notebookId, remove: false }).success, false);
  assert.equal(boardModerationSchema.parse({ notebookId, remove: false, notice: "Policy violation" }).notice, "Policy violation");
});
test("caller cannot choose the writer or admin identity", () => {
  const parsed = boardModerationSchema.parse({ notebookId, remove: true, ownerId: "someone-else", authorId: "someone-else" });
  assert.equal("ownerId" in parsed, false);
  assert.equal("authorId" in parsed, false);
});