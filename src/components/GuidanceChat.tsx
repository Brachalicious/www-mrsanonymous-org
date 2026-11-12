import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, X } from "lucide-react";
import mascot from "@/assets/app-guidance-mascot-transparent.png";
import { Button } from "@/components/ui/button";
import { appendGuidanceMessages } from "@/lib/guidance.functions";
import { answerGuidanceQuestion } from "@/lib/guidance/knowledge";
import { newGuidanceMessageId, type GuidanceMessage } from "@/lib/guidance/messages";

const SUGGESTIONS = [
  "Where are my saved notes?",
  "How do I text 911?",
  "Where is My Safety Plan?",
  "How do I share on THE BOARD?",
  "How do I leave this site fast?",
];

export function GuidanceChat({
  threadId,
  initialMessages,
  onSaved,
}: {
  threadId?: string;
  initialMessages: GuidanceMessage[];
  onSaved?: () => void;
}) {
  const [messages, setMessages] = useState<GuidanceMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const append = useServerFn(appendGuidanceMessages);
  const scroller = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, saving]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || saving) return;
    setError(null);
    const userMessage: GuidanceMessage = {
      id: newGuidanceMessageId(),
      role: "user",
      text: question,
    };
    const answer: GuidanceMessage = {
      id: newGuidanceMessageId(),
      role: "assistant",
      text: answerGuidanceQuestion(question),
    };
    setMessages((current) => [...current, userMessage, answer]);
    setDraft("");
    if (!threadId) return;
    setSaving(true);
    try {
      await append({ data: { threadId, messages: [userMessage, answer] } });
      onSaved?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Your conversation could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
      textarea.current?.focus({ preventScroll: true });
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {!messages.length ? (
          <div className="py-6 text-center">
            <img
              src={mascot}
              alt="MrsANONymous mascot"
              className="mx-auto h-56 w-auto object-contain"
            />
            <h2 className="mt-3 font-serif text-2xl text-ink-900">Hello, how can I help?</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((text) => (
                <Button
                  key={text}
                  type="button"
                  variant="outline"
                  className="h-auto whitespace-normal"
                  onClick={() => ask(text)}
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <p
                  className={
                    message.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap break-words rounded-lg bg-ink-900 px-3 py-2 text-sm text-white"
                      : "max-w-[92%] whitespace-pre-wrap break-words rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900"
                  }
                >
                  {message.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-ink-300 p-3">
        {error && (
          <p role="alert" className="mb-2 break-words text-sm text-rose-500">
            {error}
          </p>
        )}
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
        >
          <textarea
            ref={textarea}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Ask for app guidance"
            placeholder="Ask about MrsANONymous…"
            maxLength={4000}
            rows={2}
            className="min-h-16 w-full resize-none rounded-md border border-ink-300 bg-white px-3 py-2 text-base text-ink-900 outline-none focus:border-rose-500"
          />
          <Button type="submit" size="icon" aria-label="Send your question" disabled={saving}>
            {saving ? <X /> : <Send />}
          </Button>
        </form>
        <p className="mt-2 text-xs text-ink-700">
          Built-in guide · no AI, no cost · Not emergency support ·{" "}
          {threadId ? "Saved in your account." : "Not saved — disappears when you close it."}{" "}
          <Link to="/privacy" className="underline">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
