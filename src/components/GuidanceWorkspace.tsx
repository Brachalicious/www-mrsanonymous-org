import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UIMessage } from "ai";
import {
  listGuidanceThreads,
  loadGuidanceThread,
  createGuidanceThread,
  deleteGuidanceThread,
} from "@/lib/guidance.functions";
import { Button } from "@/components/ui/button";
import { GuidanceChat } from "@/components/GuidanceChat";

export function GuidanceWorkspace({ threadId }: { threadId?: string }) {
  const { user, loading } = useAuth();
  const list = useServerFn(listGuidanceThreads),
    load = useServerFn(loadGuidanceThread),
    create = useServerFn(createGuidanceThread),
    remove = useServerFn(deleteGuidanceThread);
  const navigate = useNavigate(),
    queryClient = useQueryClient();
  const key = ["guidance-threads", user?.id];
  const threads = useQuery({ queryKey: key, queryFn: () => list(), enabled: Boolean(user) });
  const thread = useQuery({
    queryKey: ["guidance-thread", user?.id, threadId],
    queryFn: () => load({ data: { threadId: threadId ?? "" } }),
    enabled: Boolean(user && threadId),
  });
  const newThread = useMutation({
    mutationFn: () => create(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key });
      navigate({ to: "/guidance/$threadId", params: { threadId: data.id } });
    },
  });
  const deleteThread = useMutation({
    mutationFn: (id: string) => remove({ data: { threadId: id } }),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["guidance-thread", user?.id, id] });
      queryClient.invalidateQueries({ queryKey: key });
      if (id === threadId) navigate({ to: "/guidance" });
    },
  });
  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (!user)
    return (
      <section className="mx-auto max-w-xl px-5 py-12 text-center">
        <h1 className="text-3xl">MrsANONymous app guidance</h1>
        <p className="my-6">
          Sign in to ask the mascot and keep your conversations in your account.
        </p>
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </section>
    );
  const error = threads.error ?? thread.error ?? newThread.error ?? deleteThread.error;
  if (threads.error)
    return (
      <section className="mx-auto max-w-xl px-5 py-12">
        <h1 className="text-3xl">App guidance</h1>
        <p role="alert" className="mt-4">
          {threads.error.message}
        </p>
      </section>
    );
  return (
    <section className="mx-auto max-w-6xl px-3 py-6 md:px-6">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" title="Dashboard">
          <Link to="/dashboard" aria-label="Return to dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl">MrsANONymous app guidance</h1>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-destructive">
          {error.message}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-border pb-4 md:border-b-0 md:border-r md:pr-4">
          <Button
            onClick={() => newThread.mutate()}
            disabled={newThread.isPending || Boolean(threads.error)}
            className="w-full"
          >
            <Plus />
            New conversation
          </Button>
          <nav
            aria-label="Guidance conversations"
            className="mt-3 max-h-40 space-y-1 overflow-y-auto md:max-h-[600px]"
          >
            {threads.data?.map((t) => (
              <div key={t.id} className="flex items-center gap-1">
                <Button
                  asChild
                  variant={t.id === threadId ? "secondary" : "ghost"}
                  className="h-auto min-w-0 flex-1 justify-start whitespace-normal break-words py-3 text-left"
                >
                  <Link to="/guidance/$threadId" params={{ threadId: t.id }}>
                    {t.title}
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete conversation ${t.title}`}
                  title="Delete conversation"
                  disabled={deleteThread.isPending}
                  onClick={() => {
                    if (window.confirm("Permanently delete this guidance conversation?"))
                      deleteThread.mutate(t.id);
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </nav>
        </aside>
        <div className="h-[min(680px,75dvh)] min-h-[400px] min-w-0 rounded-md border border-border bg-card">
          {threadId ? (
            thread.data ? (
              <GuidanceChat
                key={`${user.id}:${threadId}`}
                threadId={threadId}
                initialMessages={JSON.parse(thread.data.messagesJson) as UIMessage[]}
                onSaved={() => {
                  queryClient.invalidateQueries({ queryKey: key });
                  queryClient.invalidateQueries({
                    queryKey: ["guidance-thread", user.id, threadId],
                  });
                }}
              />
            ) : (
              <p className="p-6">
                {thread.error ? "This conversation is unavailable." : "Loading conversation…"}
              </p>
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <h2 className="text-2xl">Your guidance conversations</h2>
              <Button
                onClick={() => newThread.mutate()}
                disabled={newThread.isPending || Boolean(threads.error)}
              >
                <Plus />
                Ask the mascot
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
