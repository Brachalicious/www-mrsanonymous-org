import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePhonebook } from "@/hooks/use-phonebook";
import {
  budgetSummary, COST_SUGGESTIONS, goalProgress, newId,
  type FundingLine, type MoneyLine, type MoneyPlan, type PhonebookContact,
} from "@/lib/phonebook";

export const Route = createFileRoute("/phonebook")({
  head: () => ({
    meta: [
      { title: "My Phonebook & Money Plan — MrsANONymous.org" },
      { name: "description", content: "Save the hotlines, numbers and websites that helped you, and plan rent, bills, grants, scholarships and savings over time." },
      { property: "og:title", content: "My Phonebook & Money Plan — MrsANONymous.org" },
      { property: "og:description", content: "A private phonebook of helpful resources plus a money plan for rent, grants and savings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhonebookPage,
});

const money$ = (n: number) => `$${(Math.round(n * 100) / 100).toLocaleString()}`;
const input = "w-full rounded-lg border border-ink-300/60 bg-white px-3 py-2 text-ink-900";

function PhonebookPage() {
  const pb = usePhonebook();
  const [tab, setTab] = useState<"phonebook" | "money">("phonebook");
  const [status, setStatus] = useState<string | null>(null);

  async function saveAll() {
    try { await pb.save({ contacts: pb.contacts, money: pb.money }); setStatus(`✓ Saved at ${new Date().toLocaleTimeString()}`); }
    catch { setStatus("Could not save — check your connection and try again."); }
  }

  if (!pb.loaded) return <div className="p-10 text-center text-ink-600">Loading…</div>;
  if (!pb.user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <h1 className="font-serif text-4xl text-ink-900">My Phonebook</h1>
        <p className="mt-4 text-ink-600">Sign in with your anonymous nickname account to save helpful numbers, websites and your money plan.</p>
        <Link to="/login" className="btn-dark mt-6 inline-block">Sign in to use My Phonebook</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-10">
      <div className="mb-6 text-center">
        <span className="hand-note text-2xl">just for you</span>
        <h1 className="mt-2 font-serif text-4xl text-ink-900">My Phonebook</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-600">Numbers and sites that helped you, and a plan for the money you'll need. Saved privately in your account.</p>
      </div>
      <div className="mb-6 flex justify-center gap-2" role="tablist">
        {(["phonebook", "money"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 font-semibold ${tab === t ? "bg-ink-900 text-cream-50" : "border border-ink-300/60 bg-white text-ink-900"}`}>
            {t === "phonebook" ? "☎ Phonebook" : "$ Money plan"}
          </button>
        ))}
      </div>

      {tab === "phonebook" ? <Contacts list={pb.contacts} onChange={pb.setContacts} /> : <Money plan={pb.money} onChange={pb.setMoney} />}

      <div className="sticky bottom-24 mt-8 flex flex-col items-center gap-2 rounded-xl bg-cream-50/95 p-3">
        <button onClick={saveAll} className="btn-dark w-full max-w-xs" data-testid="phonebook-save">Save</button>
        {status && <p role="status" className="text-sm font-semibold text-ink-900">{status}</p>}
      </div>
    </div>
  );
}

function Contacts({ list, onChange }: { list: PhonebookContact[]; onChange: (c: PhonebookContact[]) => void }) {
  const [draft, setDraft] = useState({ name: "", phone: "", site: "", note: "" });
  function add() {
    if (!draft.name.trim()) return;
    onChange([...list, { id: newId(), ...draft, source: "mine" }]);
    setDraft({ name: "", phone: "", site: "", note: "" });
  }
  return (
    <div className="space-y-6">
      <section className="note-card p-5">
        <h2 className="font-serif text-2xl text-ink-900">Add a number or site that helped you</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-ink-900">Name<input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="text-sm font-semibold text-ink-900">Phone<input className={input} inputMode="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
          <label className="text-sm font-semibold text-ink-900">Website<input className={input} inputMode="url" value={draft.site} onChange={(e) => setDraft({ ...draft, site: e.target.value })} /></label>
          <label className="text-sm font-semibold text-ink-900">Note<input className={input} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label>
        </div>
        <button onClick={add} className="btn-dark mt-3">+ Add to list</button>
        <p className="mt-2 text-xs text-ink-500">Tip: tap "Save to My Phonebook" on any resource on the <Link to="/resources" className="underline">Resources page</Link>.</p>
      </section>
      {list.length === 0 ? <p className="text-center text-ink-500">Nothing saved yet.</p> : (
        <ul className="space-y-3">
          {list.map((c) => (
            <li key={c.id} className="note-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-ink-900">{c.name} {c.source === "resource" && <span className="ml-1 text-xs text-rose-600">from Resources</span>}</div>
                {c.note && <div className="text-sm text-ink-500">{c.note}</div>}
                <div className="mt-1 flex flex-wrap gap-3 text-sm">
                  {c.phone && <a href={`tel:${c.phone}`} className="font-semibold underline">Call {c.phone}</a>}
                  {c.site && <a href={c.site} target="_blank" rel="noreferrer" className="font-semibold underline">Visit site</a>}
                </div>
              </div>
              <button onClick={() => onChange(list.filter((x) => x.id !== c.id))} className="text-sm text-rose-600 underline">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Lines({ title, hint, lines, onChange, suggestions }: { title: string; hint: string; lines: MoneyLine[]; onChange: (l: MoneyLine[]) => void; suggestions?: string[] }) {
  const set = (id: string, patch: Partial<MoneyLine>) => onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  return (
    <section className="note-card p-5">
      <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
      <p className="text-sm text-ink-500">{hint}</p>
      <ul className="mt-3 space-y-2">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-2">
            <input aria-label="What" className={input} value={l.label} onChange={(e) => set(l.id, { label: e.target.value })} />
            <input aria-label="Amount" className={`${input} max-w-[8rem]`} type="number" min={0} value={l.amount || ""} onChange={(e) => set(l.id, { amount: Number(e.target.value) })} />
            <button aria-label="Remove" onClick={() => onChange(lines.filter((x) => x.id !== l.id))} className="px-2 text-rose-600">✕</button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => onChange([...lines, { id: newId(), label: "", amount: 0 }])} className="rounded-full border border-ink-300/60 bg-white px-3 py-1 text-sm font-semibold">+ Add</button>
        {suggestions?.filter((s) => !lines.some((l) => l.label === s)).map((s) => (
          <button key={s} onClick={() => onChange([...lines, { id: newId(), label: s, amount: 0 }])} className="rounded-full bg-cream-200 px-3 py-1 text-xs text-ink-900">+ {s}</button>
        ))}
      </div>
    </section>
  );
}

function Money({ plan, onChange }: { plan: MoneyPlan; onChange: (p: MoneyPlan) => void }) {
  const s = budgetSummary(plan);
  const setFund = (id: string, patch: Partial<FundingLine>) => onChange({ ...plan, funding: plan.funding.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-ink-900 p-5 text-cream-50">
        <h2 className="font-serif text-2xl">Your budget at a glance</h2>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <div>Monthly needs<div className="text-2xl font-bold">{money$(s.monthlyCosts)}</div></div>
          <div>Monthly income<div className="text-2xl font-bold">{money$(s.monthlyIncome)}</div></div>
          <div>{s.monthlyGap < 0 ? "Monthly shortfall" : "Left over each month"}<div className={`text-2xl font-bold ${s.monthlyGap < 0 ? "text-rose-300" : ""}`}>{money$(Math.abs(s.monthlyGap))}</div></div>
          <div>Grants & scholarships received<div className="text-2xl font-bold">{money$(s.fundingReceived)}</div></div>
          <div>Still waiting on<div className="text-2xl font-bold">{money$(s.fundingPending)}</div></div>
          {s.monthsCovered !== null && <div>Received money covers about<div className="text-2xl font-bold">{s.monthsCovered} months</div></div>}
        </div>
      </section>

      <Lines title="What you'll need to pay each month" hint="Rent, bills, food, childcare — anything you need to plan for." lines={plan.costs} onChange={(costs) => onChange({ ...plan, costs })} suggestions={COST_SUGGESTIONS} />
      <Lines title="Monthly income" hint="Job, benefits, child support, or other regular money." lines={plan.income} onChange={(income) => onChange({ ...plan, income })} />

      <section className="note-card p-5">
        <h2 className="font-serif text-2xl text-ink-900">Grants, scholarships & compensation</h2>
        <p className="text-sm text-ink-500">Add money you applied for or got. Received amounts are applied to your budget above.</p>
        <ul className="mt-3 space-y-3">
          {plan.funding.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-2">
              <input aria-label="Name" placeholder="e.g. Victim compensation" className={`${input} min-w-[10rem] flex-1`} value={f.label} onChange={(e) => setFund(f.id, { label: e.target.value })} />
              <select aria-label="Type" className={`${input} w-auto`} value={f.kind} onChange={(e) => setFund(f.id, { kind: e.target.value as FundingLine["kind"] })}>
                <option value="grant">Grant</option><option value="scholarship">Scholarship</option><option value="compensation">Compensation</option><option value="other">Other</option>
              </select>
              <input aria-label="Amount" type="number" min={0} className={`${input} max-w-[8rem]`} value={f.amount || ""} onChange={(e) => setFund(f.id, { amount: Number(e.target.value) })} />
              <label className="flex items-center gap-1 text-sm font-semibold"><input type="checkbox" checked={f.received} onChange={(e) => setFund(f.id, { received: e.target.checked })} /> Received</label>
              <button aria-label="Remove" onClick={() => onChange({ ...plan, funding: plan.funding.filter((x) => x.id !== f.id) })} className="px-2 text-rose-600">✕</button>
            </li>
          ))}
        </ul>
        <button onClick={() => onChange({ ...plan, funding: [...plan.funding, { id: newId(), label: "", amount: 0, kind: "grant", received: false }] })} className="mt-3 rounded-full border border-ink-300/60 bg-white px-3 py-1 text-sm font-semibold">+ Add grant or scholarship</button>
      </section>

      <section className="note-card p-5">
        <h2 className="font-serif text-2xl text-ink-900">Savings goals over time</h2>
        <ul className="mt-3 space-y-4">
          {plan.goals.map((g) => {
            const set = (patch: Partial<typeof g>) => onChange({ ...plan, goals: plan.goals.map((x) => (x.id === g.id ? { ...x, ...patch } : x)) });
            return (
              <li key={g.id}>
                <div className="flex flex-wrap gap-2">
                  <input aria-label="Goal" placeholder="e.g. Security deposit" className={`${input} min-w-[10rem] flex-1`} value={g.label} onChange={(e) => set({ label: e.target.value })} />
                  <label className="text-xs">Saved<input type="number" min={0} className={`${input} max-w-[7rem]`} value={g.saved || ""} onChange={(e) => set({ saved: Number(e.target.value) })} /></label>
                  <label className="text-xs">Goal<input type="number" min={0} className={`${input} max-w-[7rem]`} value={g.target || ""} onChange={(e) => set({ target: Number(e.target.value) })} /></label>
                  <label className="text-xs">By<input type="date" className={`${input} max-w-[10rem]`} value={g.by ?? ""} onChange={(e) => set({ by: e.target.value })} /></label>
                  <button aria-label="Remove" onClick={() => onChange({ ...plan, goals: plan.goals.filter((x) => x.id !== g.id) })} className="px-2 text-rose-600">✕</button>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream-200"><div className="h-full bg-rose-600" style={{ width: `${goalProgress(g)}%` }} /></div>
                <div className="text-xs text-ink-500">{goalProgress(g)}% — {money$(g.saved)} of {money$(g.target)}</div>
              </li>
            );
          })}
        </ul>
        <button onClick={() => onChange({ ...plan, goals: [...plan.goals, { id: newId(), label: "", target: 0, saved: 0 }] })} className="mt-3 rounded-full border border-ink-300/60 bg-white px-3 py-1 text-sm font-semibold">+ Add savings goal</button>
      </section>

      <section className="note-card p-5">
        <h2 className="font-serif text-2xl text-ink-900">Important documents checklist</h2>
        <ul className="mt-3 space-y-2">
          {plan.docs.map((d) => (
            <li key={d.id}><label className="flex items-center gap-2"><input type="checkbox" checked={d.done} onChange={(e) => onChange({ ...plan, docs: plan.docs.map((x) => (x.id === d.id ? { ...x, done: e.target.checked } : x)) })} />{d.label}</label></li>
          ))}
        </ul>
      </section>
      <p className="text-center text-sm text-ink-500">Need money help? See <Link to="/resources" className="underline">Financial help & compensation</Link> on the Resources page.</p>
    </div>
  );
}
