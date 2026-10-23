import { test } from "node:test";
import { strict as assert } from "node:assert";
import { accountBlockSchema, nicknameKey } from "./account-safety";

test("blocked registration identities match normalized nickname sign-in identities", () => {
  assert.equal(nicknameKey(" Test Writer "), "test-writer@mrsanonymous.local");
  assert.equal(nicknameKey("TEST_WRITER"), nicknameKey("test-writer"));
});
test("blocking and unblocking require the matching explicit confirmation", () => {
  const userId = "c27a54c7-17df-4b99-bc6d-2c2d2822b935";
  assert.equal(accountBlockSchema.safeParse({ userId, blocked: true, confirmation: "UNBLOCK" }).success, false);
  assert.equal(accountBlockSchema.safeParse({ userId, blocked: true, confirmation: "BLOCK" }).success, true);
  assert.equal(accountBlockSchema.safeParse({ userId, blocked: false, confirmation: "BLOCK" }).success, false);
});