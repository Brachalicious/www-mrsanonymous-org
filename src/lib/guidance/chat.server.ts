import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, validateUIMessages, type UIMessage } from "ai";
import { z } from "zod";
import { createResponsesCall } from "./responses.server";
import { withLovableAiGatewayRunIdHeader } from "./run-id.server";
import { GUIDANCE_INSTRUCTIONS } from "./prompt.server";
import { validGuidanceQuestion } from "../guidance-input";

const fail = (status: number, message: string) => Response.json({ error: message }, { status });
export async function handleGuidanceRequest(request: Request) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!url || !key || !apiKey) return fail(401, "App guidance is not configured yet.");
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer "))
      return fail(401, "Please sign in to ask for guidance.");
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { Authorization: authorization },
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { data: auth, error: authError } = await db.auth.getUser(authorization.slice(7));
    if (authError || !auth.user) return fail(401, "Please sign in again.");
    const input = z
      .object({ threadId: z.string().uuid(), messages: z.array(z.unknown()) })
      .parse(await request.json());
    const { data: thread, error: threadError } = await db
      .from("guidance_threads")
      .select("id, title")
      .eq("id", input.threadId)
      .eq("owner_id", auth.user.id)
      .maybeSingle();
    if (threadError || !thread)
      return fail(403, "Conversation unavailable or awaiting account verification.");
    const clientMessages = await validateUIMessages({ messages: input.messages });
    const latest = clientMessages.at(-1);
    if (!latest || latest.role !== "user" || latest.parts.some((p) => p.type !== "text"))
      return fail(400, "Please send a text question.");
    const text = latest.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("")
      .trim();
    if (!validGuidanceQuestion(text))
      return fail(400, "Please keep your question between 1 and 4,000 characters.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: blocked, error: stateError } = await supabaseAdmin
      .from("guidance_ai_state")
      .select("status, message")
      .eq("id", "gateway")
      .maybeSingle();
    if (stateError) return fail(503, "Unable to check guidance availability.");
    if (blocked) return fail(blocked.status, blocked.message);
    const { data: rows, error: readError } = await db
      .from("guidance_messages")
      .select("message")
      .eq("thread_id", thread.id)
      .order("created_at");
    if (readError) return fail(500, "Unable to load your conversation.");
    const messages = (rows ?? []).map((row) => row.message as unknown as UIMessage);
    if (!messages.some((m) => m.id === latest.id)) messages.push(latest);
    const { error: saveError } = await db
      .from("guidance_messages")
      .upsert(
        { thread_id: thread.id, sdk_id: latest.id, message: latest },
        { onConflict: "thread_id,sdk_id" },
      );
    if (saveError) return fail(500, "Your question could not be saved. Please try again.");
    const { error: titleError } = await db
      .from("guidance_threads")
      .update({
        updated_at: new Date().toISOString(),
        ...(thread.title === "New conversation" ? { title: text.slice(0, 70) } : {}),
      })
      .eq("id", thread.id);
    if (titleError) return fail(500, "Your conversation could not be updated.");
    let resolveUpstream: (value: { status: number; message?: string }) => void = () => {};
    const upstream = new Promise<{ status: number; message?: string }>((resolve) => {
      resolveUpstream = resolve;
    });
    const call = createResponsesCall(
      request,
      {
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey,
        model: "openai/gpt-6-astra",
        onUpstream: async (response) => {
          let message: string | undefined;
          if (!response.ok) {
            const payload = await response
              .clone()
              .json()
              .catch(() => null);
            message =
              payload?.message ??
              payload?.error?.message ??
              "App guidance is temporarily unavailable.";
            if (response.status === 402 || response.status === 403) {
              const { error } = await supabaseAdmin.from("guidance_ai_state").upsert({
                id: "gateway",
                status: response.status,
                message: message ?? "App guidance is unavailable.",
                updated_at: new Date().toISOString(),
              });
              if (error) console.error("Could not persist guidance access block");
            }
          }
          resolveUpstream({ status: response.status, message });
        },
      },
      await convertToModelMessages(messages),
      GUIDANCE_INSTRUCTIONS,
    );
    const response = call.result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onError: (error) => {
        resolveUpstream({
          status: 500,
          message: "App guidance could not connect. Please try again later.",
        });
        return error instanceof Error ? error.message : "App guidance failed.";
      },
      onFinish: async ({ responseMessage, isAborted }) => {
        if (isAborted) return;
        if (!responseMessage.parts.some((p) => p.type === "text" && p.text.trim()))
          throw new Error("No guidance answer was returned. This request has ended.");
        const { error } = await db
          .from("guidance_messages")
          .upsert(
            { thread_id: thread.id, sdk_id: responseMessage.id, message: responseMessage },
            { onConflict: "thread_id,sdk_id" },
          );
        if (error)
          throw new Error(
            "The answer could not be saved. Keep this page open and try again later.",
          );
      },
    });
    const status = await upstream;
    if (status.status >= 400)
      return fail(status.status, status.message ?? "App guidance is unavailable.");
    return withLovableAiGatewayRunIdHeader(response, call.runIdFetch);
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    if (error instanceof z.ZodError) return fail(400, "Invalid conversation or question.");
    return fail(500, "App guidance could not load. Please try again later.");
  }
}
