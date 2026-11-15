import { test } from "node:test";
import { strict as assert } from "node:assert";
import { budgetSummary, emptyMoneyPlan, goalProgress, contactFromResource } from "./phonebook";

test("received grants and scholarships cover a monthly rent shortfall", () => {
  const p = emptyMoneyPlan();
  p.costs = [{ id: "a", label: "Rent", amount: 1200 }, { id: "b", label: "Food", amount: 300 }];
  p.income = [{ id: "c", label: "Job", amount: 1000 }];
  p.funding = [
    { id: "d", label: "Victim comp", amount: 1000, kind: "compensation", received: true },
    { id: "e", label: "Scholarship", amount: 500, kind: "scholarship", received: false },
  ];
  const s = budgetSummary(p);
  assert.equal(s.monthlyGap, -500);
  assert.equal(s.fundingReceived, 1000);
  assert.equal(s.fundingPending, 500);
  assert.equal(s.monthsCovered, 2);
});

test("savings goal progress caps at 100", () => {
  assert.equal(goalProgress({ id: "g", label: "Deposit", target: 500, saved: 250 }), 50);
  assert.equal(goalProgress({ id: "g", label: "Deposit", target: 500, saved: 900 }), 100);
});

test("saving a resource keeps its phone and site", () => {
  const c = contactFromResource({ name: "Hotline", tel: "tel:18007997233", href: "https://thehotline.org" });
  assert.equal(c.phone, "18007997233");
  assert.equal(c.site, "https://thehotline.org");
});
