import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Called only after the caller's admin role is verified; RLS also enforces it.
export async function getAccountNumbers(client: SupabaseClient<Database>, userIds: string[]) {
  if (!userIds.length) return new Map<string, string>();
  const { data, error } = await client.from("account_numbers")
    .select("user_id, account_number").in("user_id", [...new Set(userIds)]);
  if (error) throw new Error("Could not load account numbers.");
  return new Map((data ?? []).map((row) => [row.user_id, String(row.account_number)]));
}