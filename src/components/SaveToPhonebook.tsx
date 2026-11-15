import { useState } from "react";
import { usePhonebook } from "@/hooks/use-phonebook";
import { contactFromResource, hasContact } from "@/lib/phonebook";

export function SaveToPhonebook({ resource }: { resource: { name: string; phone?: string; tel?: string; href?: string; note?: string } }) {
  const { user, contacts, save, loaded } = usePhonebook();
  const [msg, setMsg] = useState<string | null>(null);
  const saved = loaded && hasContact(contacts, resource.name);

  async function onClick() {
    if (!user) { setMsg("Sign in to save"); return; }
    if (saved) return;
    try { await save({ contacts: [...contacts, contactFromResource(resource)] }); setMsg(null); }
    catch { setMsg("Could not save"); }
  }

  return (
    <button type="button" onClick={onClick} aria-label={`Save ${resource.name} to My Phonebook`}
      className="ml-2 rounded-full border border-ink-300/60 bg-white px-3 py-1 text-xs font-semibold text-ink-900 hover:border-rose-500">
      {msg ?? (saved ? "✓ In My Phonebook" : "☎ Save to My Phonebook")}
    </button>
  );
}
