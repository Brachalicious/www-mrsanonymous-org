import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function clearStorage(bucket: "evidence" | "notebook-covers", prefix: string) {
  // Always read the first page: deleting it advances the remaining objects.
  for (;;) {
    const { data, error } = await supabaseAdmin.storage.from(bucket).list(prefix, { limit: 100 });
    if (error) throw new Error(`Could not delete ${bucket} files: ${error.message}`);
    if (!data?.length) return;
    const files: string[] = [];
    for (const item of data) {
      const path = `${prefix}/${item.name}`;
      if (item.id) files.push(path);
      else await clearStorage(bucket, path);
    }
    if (files.length) {
      const result = await supabaseAdmin.storage.from(bucket).remove(files);
      if (result.error) throw new Error(result.error.message);
    }
  }
}

function checked(result: { error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
}

export async function deleteAccountData(userId: string) {
  const notebooks = await supabaseAdmin.from("notebooks").select("id").eq("owner_id", userId);
  checked(notebooks);
  const notebookIds = (notebooks.data ?? []).map((row) => row.id);
  const threads = await supabaseAdmin.from("guidance_threads").select("id").eq("owner_id", userId);
  checked(threads);
  const threadIds = (threads.data ?? []).map((row) => row.id);
  if (threadIds.length) checked(await supabaseAdmin.from("guidance_messages").delete().in("thread_id", threadIds));
  checked(await supabaseAdmin.from("guidance_threads").delete().eq("owner_id", userId));
  if (notebookIds.length) {
    checked(await supabaseAdmin.from("entries").delete().in("notebook_id", notebookIds));
    checked(await supabaseAdmin.from("reaction_events").delete().in("notebook_id", notebookIds));
    checked(await supabaseAdmin.from("story_reports").delete().in("notebook_id", notebookIds));
    checked(await supabaseAdmin.from("notebooks").delete().in("id", notebookIds));
  }
  const messages = await supabaseAdmin.from("contact_messages").select("id").eq("sender_user_id", userId);
  checked(messages);
  const messageIds = (messages.data ?? []).map((row) => row.id);
  if (messageIds.length) checked(await supabaseAdmin.from("message_replies").delete().in("message_id", messageIds));
  checked(await supabaseAdmin.from("message_replies").delete().eq("author_user_id", userId));
  checked(await supabaseAdmin.from("contact_messages").delete().eq("sender_user_id", userId));
  await clearStorage("evidence", userId);
  await clearStorage("notebook-covers", userId);
  checked(await supabaseAdmin.from("journal_entries").delete().eq("owner_id", userId));
  checked(await supabaseAdmin.from("security_questions").delete().eq("user_id", userId));
  checked(await supabaseAdmin.from("inbox_recovery_locks").delete().eq("user_id", userId));
  checked(await supabaseAdmin.from("story_blocks").delete().eq("owner_id", userId));
  checked(await supabaseAdmin.from("user_roles").delete().eq("user_id", userId));
  checked(await supabaseAdmin.from("profiles").delete().eq("id", userId));
  checked(await supabaseAdmin.auth.admin.deleteUser(userId));
  return { ok: true };
}