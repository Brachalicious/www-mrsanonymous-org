import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UIMessage } from "ai";
import {
  listGuidanceThreads,
  loadGuidanceThread,
  createGuidanceThread,
} from "@/lib/guidance.functions";
import { Button } from "@/components/ui/button";
import { GuidanceChat } from "@/components/GuidanceChat";
import mascot from "@/assets/app-guidance-mascot.jpeg.asset.json";

export function MascotChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const list = useServerFn(listGuidanceThreads);
  const load = useServerFn(loadGuidanceThread);
  const create = useServerFn(createGuidanceThread);
  const queryClient = useQueryClient();
  const key = ["guidance-threads", user?.id];
  const threads = useQuery({
    queryKey: key,
    queryFn: () => list(),
    enabled: open && Boolean(user),
  });
  const threadId = threads.data?.[0]?.id;
  const createThread = useMutation({
    mutationFn: () => create(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  useEffect(() => {
    if (
      open &&
      user &&
      threads.data &&
      threads.data.length === 0 &&
      !createThread.isPending &&
      !createThread.error
    )
      createThread.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, threads.data, threads.error]);
  const thread = useQuery({
    queryKey: ["guidance-thread", user?.id, threadId],
    queryFn: () => load({ data: { threadId: threadId ?? "" } }),
    enabled: open && Boolean(user && threadId),
  });
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="App guidance chat"
      className="fixed bottom-4 left-4 z-[70] flex h-[min(620px,80dvh)] w-[min(420px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <img src={mascot.url} alt="" className="h-10 w-8 object-contain" />
          <span className="font-serif text-lg">App guidance</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Close guidance chat"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        {!user ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p>Sign in to chat with the mascot and keep your conversations in your account.</p>
            <Button asChild>
              <Link to="/login" onClick={onClose}>
                Sign in
              </Link>
            </Button>
          </div>
        ) : threads.error ? (
          <p role="alert" className="p-6 text-destructive">
            {threads.error.message}
          </p>
        ) : threads.isPending || thread.isPending ? (
          <p className="p-6 text-center">Loading…</p>
        ) : createThread.error ? (
          <p role="alert" className="p-6 text-destructive">
            {createThread.error.message}
          </p>
        ) : thread.data ? (
          <GuidanceChat
            key={`${user.id}:${threadId}`}
            threadId={threadId!}
            initialMessages={JSON.parse(thread.data.messagesJson) as UIMessage[]}
            onSaved={() => {
              queryClient.invalidateQueries({ queryKey: key });
              queryClient.invalidateQueries({
                queryKey: ["guidance-thread", user.id, threadId],
              });
            }}
          />
        ) : (
          <p className="p-6 text-center">Starting your conversation…</p>
        )}
      </div>
    </div>
  );
}
