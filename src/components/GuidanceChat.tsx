import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import mascot from "@/assets/app-guidance-mascot.jpeg.asset.json";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

export function GuidanceChat({
  threadId,
  initialMessages,
  onSaved,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  onSaved: () => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/guidance",
      body: { threadId },
      headers: async () => {
        const { data } = await supabase.auth.getSession();
        return { Authorization: `Bearer ${data.session?.access_token ?? ""}` };
      },
    }),
    onFinish: onSaved,
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    if (!document.querySelector('[role="dialog"]'))
      textarea.current?.focus({ preventScroll: true });
  }, [threadId, status]);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0">
        <ConversationContent>
          {!messages.length && (
            <div className="py-8 text-center">
              <img
                src={mascot.url}
                alt="MrsANONymous mascot"
                className="mx-auto h-48 w-36 object-contain"
              />
              <h2 className="mt-4 text-2xl">What would you like help finding?</h2>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  "Where are my saved notes?",
                  "How do I share on THE BOARD?",
                  "Where is My Safety Plan?",
                ].map((text) => (
                  <Button
                    key={text}
                    variant="outline"
                    className="h-auto whitespace-normal"
                    onClick={() => sendMessage({ text })}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <MessageResponse key={index} isAnimating={busy && message.role === "assistant"}>
                      {part.text}
                    </MessageResponse>
                  ) : part.type === "reasoning" ? (
                    <Reasoning key={index} defaultOpen={false}>
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton aria-label="Scroll to latest message" />
      </Conversation>
      <div className="border-t border-border p-4">
        {error && (
          <p role="alert" className="mb-3 break-words text-sm text-destructive">
            {error.message}
          </p>
        )}
        <PromptInput
          onSubmit={({ text }) => {
            if (text.trim() && !busy) {
              sendMessage({ text: text.trim() });
              textarea.current?.focus();
            }
          }}
        >
          <PromptInputTextarea
            ref={textarea}
            aria-label="Ask for app guidance"
            placeholder="Ask about MrsANONymous…"
            maxLength={4000}
            className="min-h-20 text-base"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-xs text-ink-700">
          AI app guidance · Not emergency support · Saved in your account.{" "}
          <Link to="/privacy" className="underline">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
