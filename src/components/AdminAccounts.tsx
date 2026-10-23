import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAccountsForAdmin, deleteAccountForAdmin, setAccountBlocked } from "@/lib/moderation.functions";
import { Button } from "@/components/ui/button";
import { Trash2, Ban, Undo2 } from "lucide-react";

export function AdminAccounts() {
  const fetchAccounts = useServerFn(listAccountsForAdmin);
  const remove = useServerFn(deleteAccountForAdmin);
  const block = useServerFn(setAccountBlocked);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ id: string; nickname: string } | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [success, setSuccess] = useState("");
  const accounts = useQuery({ queryKey: ["admin-accounts"], queryFn: () => fetchAccounts(), retry: false });
  const blocking = useMutation({ mutationFn: (input: { data: { userId: string; blocked: boolean; confirmation: "BLOCK" | "UNBLOCK" } }) => block(input), onSuccess: (_, variables) => {
    setSuccess(variables.data.blocked ? "Account blocked. Its posts are hidden and known registration identifiers are restricted." : "Account unblocked. Removed posts remain hidden.");
    for (const key of ["admin-accounts", "admin-board-posts", "shared-stories"]) void qc.invalidateQueries({ queryKey: [key] });
  } });
  const deletion = useMutation({ mutationFn: remove, onSuccess: () => {
    setSelected(null); setConfirmation(""); setSuccess("Account and associated saved data deleted.");
    for (const key of ["admin-accounts", "admin-board-posts", "shared-stories", "story-reports"]) void qc.invalidateQueries({ queryKey: [key] });
  } });
  return <section className="mt-12 border-t border-border pt-8"><h2 className="font-serif text-2xl text-foreground">Accounts</h2>
    <p className="mt-3 text-sm text-muted-foreground">Blocking stops sign-in and sharing, hides board posts, and restricts the same nickname and known registration browser. A different browser or device can evade this; anonymous accounts cannot be reliably linked to a person. Admin accounts are protected. Block before deleting if the restriction must remain.</p>
    <label htmlFor="account-search" className="mt-4 block text-sm font-semibold">Find a nickname</label><input id="account-search" value={search} onChange={(event) => setSearch(event.target.value)} className="mt-2 w-full rounded-md border border-input bg-background p-3 text-foreground" />
    {accounts.isPending && <p className="mt-3 text-muted-foreground">Loading accounts…</p>}
    {accounts.isError && <p role="alert" className="mt-3 text-destructive">{accounts.error.message}</p>}
    <div className="mt-4 max-h-96 overflow-y-auto divide-y divide-border">{accounts.data?.filter((account) => account.nickname.toLowerCase().includes(search.toLowerCase())).map((account) => <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="break-words">{account.nickname}{account.protected && " · Admin / protected"}{account.blocked && " · Blocked"}</span><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" disabled={account.protected || blocking.isPending || deletion.isPending} onClick={() => {
      const confirmation = account.blocked ? "UNBLOCK" : "BLOCK";
      if (window.prompt(`Type ${confirmation} to ${account.blocked ? "unblock" : "block"} ${account.nickname}.`) === confirmation) blocking.mutate({ data: { userId: account.id, blocked: !account.blocked, confirmation } });
    }}>{account.blocked ? <Undo2 /> : <Ban />}{account.blocked ? "Unblock" : "Block account"}</Button><Button variant="destructive" size="sm" disabled={account.protected || deletion.isPending || blocking.isPending} onClick={() => { setSelected(account); setConfirmation(""); setSuccess(""); deletion.reset(); }}><Trash2 />Delete account</Button></div></div>)}</div>
    {blocking.isError && <p role="alert" className="mt-3 text-destructive">{blocking.error.message}</p>}
    {selected && <form className="mt-5 space-y-3 border-t border-border pt-4" onSubmit={(event) => { event.preventDefault(); if (confirmation === "DELETE") deletion.mutate({ data: { userId: selected.id, confirmation: "DELETE" } }); }}><h3 className="font-semibold">Delete {selected.nickname}?</h3><p className="text-sm text-muted-foreground">Permanently deletes this account, its board posts, private notebooks, journal records, uploads, support messages, and saved conversations. This cannot be undone.</p><label className="block text-sm" htmlFor="delete-confirmation">Type DELETE to confirm</label><input id="delete-confirmation" autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-foreground" /><div className="flex gap-2"><Button type="submit" variant="destructive" disabled={confirmation !== "DELETE" || deletion.isPending}>{deletion.isPending ? "Deleting…" : "Permanently delete account"}</Button><Button type="button" variant="outline" disabled={deletion.isPending} onClick={() => setSelected(null)}>Cancel</Button></div></form>}
    {deletion.isError && <p role="alert" className="mt-3 text-destructive">{deletion.error.message}</p>}{success && <p role="status" className="mt-3">{success}</p>}
  </section>;
}