import { test } from "node:test";
import { strict as assert } from "node:assert";
import { matchesAccountSearch } from "./account-number-search";

test("admin can locate an account by its exact account number", () => {
  const account = { nickname: "quiet-rose", accountNumber: "123" };
  assert.equal(matchesAccountSearch(account, "123"), true);
  assert.equal(matchesAccountSearch(account, "#123"), true);
  assert.equal(matchesAccountSearch(account, "12"), false);
  assert.equal(matchesAccountSearch(account, "124"), false);
});
test("nickname search remains available without exposing identifiers in nicknames", () => {
  assert.equal(matchesAccountSearch({ nickname: "Quiet-Rose", accountNumber: "123" }, "ROSE"), true);
  assert.equal(matchesAccountSearch({ nickname: "Quiet-Rose", accountNumber: null }, "123"), false);
});