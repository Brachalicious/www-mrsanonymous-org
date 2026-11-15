// Browser-safe My Phonebook model and money-plan math.
export type PhonebookContact = {
  id: string;
  name: string;
  phone?: string;
  site?: string;
  note?: string;
  source: "resource" | "mine";
};

export type MoneyLine = { id: string; label: string; amount: number };
export type FundingLine = MoneyLine & { kind: "grant" | "scholarship" | "compensation" | "other"; received: boolean };
export type SavingsGoal = { id: string; label: string; target: number; saved: number; by?: string };
export type DocItem = { id: string; label: string; done: boolean };

export type MoneyPlan = {
  costs: MoneyLine[]; // monthly needs: rent, food, phone...
  income: MoneyLine[]; // monthly income
  funding: FundingLine[]; // one-time grants/scholarships applied to budget
  goals: SavingsGoal[];
  docs: DocItem[];
};

export const COST_SUGGESTIONS = ["Rent / housing", "Security deposit", "Utilities", "Food", "Phone", "Transportation", "Childcare", "Medical", "Legal fees", "Moving costs"];
export const DOC_DEFAULTS = ["Photo ID / driver's license", "Birth certificates", "Social Security cards", "Bank & credit card info", "Lease or mortgage papers", "Pay stubs / tax returns", "Insurance cards", "Protective order / court papers"];

export const newId = () => Math.random().toString(36).slice(2, 10);

export function emptyMoneyPlan(): MoneyPlan {
  return { costs: [], income: [], funding: [], goals: [], docs: DOC_DEFAULTS.map((label) => ({ id: newId(), label, done: false })) };
}

export function normalizeMoneyPlan(raw: unknown): MoneyPlan {
  const base = emptyMoneyPlan();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<MoneyPlan>;
  return {
    costs: Array.isArray(r.costs) ? r.costs : [],
    income: Array.isArray(r.income) ? r.income : [],
    funding: Array.isArray(r.funding) ? r.funding : [],
    goals: Array.isArray(r.goals) ? r.goals : [],
    docs: Array.isArray(r.docs) && r.docs.length ? r.docs : base.docs,
  };
}

const sum = (xs: { amount: number }[]) => xs.reduce((t, x) => t + (Number.isFinite(x.amount) ? x.amount : 0), 0);

export function budgetSummary(plan: MoneyPlan) {
  const monthlyCosts = sum(plan.costs);
  const monthlyIncome = sum(plan.income);
  const monthlyGap = monthlyIncome - monthlyCosts; // negative = shortfall
  const fundingReceived = sum(plan.funding.filter((f) => f.received));
  const fundingPending = sum(plan.funding.filter((f) => !f.received));
  // How many months received grants/scholarships cover a monthly shortfall.
  const monthsCovered = monthlyGap < 0 ? Math.floor((fundingReceived / -monthlyGap) * 10) / 10 : null;
  return { monthlyCosts, monthlyIncome, monthlyGap, fundingReceived, fundingPending, monthsCovered };
}

export function goalProgress(g: SavingsGoal) {
  if (g.target <= 0) return 0;
  return Math.min(100, Math.round((g.saved / g.target) * 100));
}

export function contactFromResource(r: { name: string; phone?: string; tel?: string; href?: string; note?: string }): PhonebookContact {
  return { id: newId(), name: r.name, phone: r.phone ?? r.tel?.replace(/^tel:/, ""), site: r.href, note: r.note, source: "resource" };
}

export function hasContact(list: PhonebookContact[], name: string) {
  return list.some((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());
}
