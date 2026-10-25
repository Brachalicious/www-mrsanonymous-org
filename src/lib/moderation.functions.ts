import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { boardModerationSchema, requireAdminRole } from "./moderation-input";
import { requireDeletableAccount } from "./board-options";
import { accountBlockSchema, nicknameKey } from "./account-safety";

const SESSION_COOKIE = "mrsanon_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function sessionId(): string {
  let id = getCookie(SESSION_COOKIE);
  if (!id) {
    id = crypto.randomUUID();
    setCookie(SESSION_COOKIE, id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return id;
}

export const REPORT_REASONS = [
  "Abusive or hateful content",
  "Identifying information about someone",
  "Spam or advertising",
  "Threat of violence or self-harm",
  "Sexual content involving a minor",
  "Something else",
];

export const reportStory = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        notebookId: z.string().uuid(),
        reason: z.string().min(1).max(120),
        details: z.string().max(1000).optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const sid = sessionId();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("story_reports").insert({
      notebook_id: data.notebookId,
      session_id: sid,
      reason: data.reason,
      details: data.details ?? null,
    });
    if (error) throw new Error(error.message);

    // Auto-hide pending review once a story has multiple independent reports.
    const { data: reports } = await supabaseAdmin
      .from("story_reports")
      .select("session_id")
      .eq("notebook_id", data.notebookId)
      .eq("status", "pending");
    const unique = new Set((reports ?? []).map((r: { session_id: string }) => r.session_id));
    if (unique.size >= 2) {
      await supabaseAdmin.from("notebooks").update({ hidden: true }).eq("id", data.notebookId);
    }
    return { ok: true };
  });

export const blockStoryAuthor = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ notebookId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const sid = sessionId();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: nb } = await supabaseAdmin
      .from("notebooks")
      .select("owner_id")
      .eq("id", data.notebookId)
      .maybeSingle();
    if (!nb) throw new Error("Story not found");
    await supabaseAdmin
      .from("story_blocks")
      .upsert({ session_id: sid, owner_id: nb.owner_id }, { onConflict: "session_id,owner_id" });
    return { ok: true };
  });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  requireAdminRole(isAdmin, error);
}

export const listBoardPostsForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: posts, error } = await supabaseAdmin.from("notebooks")
      .select("id, title, shared, hidden, shared_at, owner_id")
      .or("shared.eq.true,hidden.eq.true")
      .order("shared_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (posts ?? []).map((post) => post.id);
    if (!ids.length) return [];
    const { data: pages, error: pageError } = await supabaseAdmin.from("entries")
      .select("id, notebook_id, content").in("notebook_id", ids).eq("shared", true);
    if (pageError) throw new Error(pageError.message);
    const { getAccountNumbers } = await import("./account-numbers.server");
    const numbers = await getAccountNumbers(context.supabase, (posts ?? []).map((post) => post.owner_id));
    return (posts ?? []).map((post) => ({ ...post, accountNumber: numbers.get(post.owner_id) ?? null, pages: (pages ?? []).filter((page) => page.notebook_id === post.id) }));
  });

export const moderateBoardPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => boardModerationSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: threadId, error } = await context.supabase.rpc("moderate_board_post", {
      p_notebook_id: data.notebookId,
      p_remove: data.remove,
      p_notice: data.notice,
    });
    if (error) throw new Error(error.message);
    return { ok: true, threadId };
  });

export const listAccountsForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles, error } = await supabaseAdmin.from("profiles").select("id, nickname, created_at").order("nickname");
    if (error) throw new Error(error.message);
    const roles = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    if (roles.error) throw new Error(roles.error.message);
    const admins = new Set((roles.data ?? []).map((role) => role.user_id));
    const restrictions = await supabaseAdmin.from("account_restrictions").select("user_id").eq("blocked", true);
    if (restrictions.error) throw new Error(restrictions.error.message);
    const blocked = new Set((restrictions.data ?? []).map((row) => row.user_id));
    const { getAccountNumbers } = await import("./account-numbers.server");
    const numbers = await getAccountNumbers(context.supabase, (profiles ?? []).map((profile) => profile.id));
    return (profiles ?? []).map((profile) => ({ ...profile, accountNumber: numbers.get(profile.id) ?? null, blocked: blocked.has(profile.id), protected: admins.has(profile.id) || profile.id === context.userId }));
  });

export const setAccountBlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => accountBlockSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = await supabaseAdmin.from("profiles").select("nickname").eq("id", data.userId).single();
    if (target.error || !target.data) throw new Error("Account not found");
    const roles = await supabaseAdmin.from("user_roles").select("id").eq("user_id", data.userId).eq("role", "admin");
    if (roles.error) throw new Error(roles.error.message);
    requireDeletableAccount(context.userId, data.userId, Boolean(roles.data?.length));
    const auth = await supabaseAdmin.auth.admin.updateUserById(data.userId, { ban_duration: data.blocked ? "876000h" : "none" });
    if (auth.error) throw new Error(auth.error.message);
    const restriction = await supabaseAdmin.from("account_restrictions").upsert({ user_id: data.userId, nickname_key: nicknameKey(target.data.nickname), blocked: data.blocked, blocked_by: context.userId });
    if (restriction.error) throw new Error(restriction.error.message);
    if (data.blocked) {
      const hidden = await supabaseAdmin.from("notebooks").update({ hidden: true, shared: false }).eq("owner_id", data.userId);
      if (hidden.error) throw new Error(hidden.error.message);
    }
    return { ok: true };
  });

export const deleteAccountForAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid(), confirmation: z.literal("DELETE") }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = await supabaseAdmin.from("profiles").select("id").eq("id", data.userId).single();
    if (target.error || !target.data) throw new Error("Account not found");
    const role = await supabaseAdmin.from("user_roles").select("id").eq("user_id", data.userId).eq("role", "admin");
    if (role.error) throw new Error(role.error.message);
    requireDeletableAccount(context.userId, data.userId, Boolean(role.data?.length));
    const { deleteAccountData } = await import("./account-cleanup.server");
    return deleteAccountData(data.userId);
  });

export const removeBoardPageForAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("entries").update({ shared: false, shared_at: null }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStoryReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("story_reports")
      .select("id, notebook_id, reason, details, status, created_at, notebooks(title, hidden)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

export const resolveStoryReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        reportId: z.string().uuid(),
        action: z.enum(["remove", "keep"]),
      })
      .parse(data)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.rpc("resolve_board_report", {
      p_report_id: data.reportId,
      p_action: data.action,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
