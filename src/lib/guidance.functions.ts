import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const threadInput = (data: unknown) => z.object({ threadId: z.string().uuid() }).parse(data);

export const listGuidanceThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: lock, error: lockError } = await context.supabase
      .from("inbox_recovery_locks")
      .select("status")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (lockError) throw new Error("Unable to check account verification.");
    if (lock?.status === "pending")
      throw new Error("Your conversations are hidden until support verifies your account.");
    const { data, error } = await context.supabase
      .from("guidance_threads")
      .select("id, title, updated_at")
      .eq("owner_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Unable to load your conversations.");
    return data ?? [];
  });

export const createGuidanceThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("guidance_threads")
      .insert({ owner_id: context.userId })
      .select("id")
      .single();
    if (error)
      throw new Error("Unable to create a conversation. Your account may need verification.");
    return data;
  });

export const loadGuidanceThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(threadInput)
  .handler(async ({ data, context }) => {
    const { data: thread, error } = await context.supabase
      .from("guidance_threads")
      .select("id, title")
      .eq("id", data.threadId)
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (error || !thread)
      throw new Error("Conversation unavailable or awaiting account verification.");
    const { data: rows, error: readError } = await context.supabase
      .from("guidance_messages")
      .select("message")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (readError) throw new Error("Unable to load your conversation.");
    return { ...thread, messagesJson: JSON.stringify((rows ?? []).map((row) => row.message)) };
  });

export const deleteGuidanceThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(threadInput)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guidance_threads")
      .delete()
      .eq("id", data.threadId)
      .eq("owner_id", context.userId);
    if (error) throw new Error("Unable to delete this conversation.");
    return { ok: true };
  });
