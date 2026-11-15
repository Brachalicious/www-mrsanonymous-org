import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeMoneyPlan, type MoneyPlan, type PhonebookContact } from "@/lib/phonebook";

export function usePhonebook() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<PhonebookContact[]>([]);
  const [money, setMoney] = useState<MoneyPlan>(normalizeMoneyPlan(null));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    let live = true;
    supabase.from("phonebooks").select("contacts, money").eq("owner_id", user.id).maybeSingle().then(({ data }) => {
      if (!live) return;
      setContacts(Array.isArray(data?.contacts) ? (data!.contacts as unknown as PhonebookContact[]) : []);
      setMoney(normalizeMoneyPlan(data?.money));
      setLoaded(true);
    });
    return () => { live = false; };
  }, [user]);

  const save = useCallback(async (next: { contacts?: PhonebookContact[]; money?: MoneyPlan }) => {
    if (!user) throw new Error("Sign in to save");
    const c = next.contacts ?? contacts;
    const m = next.money ?? money;
    const { error } = await supabase.from("phonebooks").upsert({ owner_id: user.id, contacts: c as never, money: m as never });
    if (error) throw error;
    setContacts(c); setMoney(m);
  }, [user, contacts, money]);

  return { user, contacts, money, setContacts, setMoney, loaded, save };
}
