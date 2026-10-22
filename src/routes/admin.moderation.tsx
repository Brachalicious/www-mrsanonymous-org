import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { listStoryReports, resolveStoryReport, listBoardPostsForAdmin, moderateBoardPost, removeBoardPageForAdmin } from "@/lib/moderation.functions";
import { AdminAccounts } from "@/components/AdminAccounts";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [
      { title: "Moderation Queue — MrsANONymous" },
      { name: "description", content: "Support team review queue for reported community stories." },
      { property: "og:title", content: "Moderation Queue — MrsANONymous" },
      { property: "og:description", content: "Support team review queue for reported stories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ModerationPage,
});

function ModerationPage() {
  const { user, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const fetchReports = useServerFn(listStoryReports);
  const resolve = useServerFn(resolveStoryReport);
  const fetchPosts = useServerFn(listBoardPostsForAdmin);
  const posts = useQuery({ queryKey: ["admin-board-posts"], queryFn: () => fetchPosts(), enabled: !!user && isAdmin, retry: false });

  const q = useQuery({
    queryKey: ["story-reports"],
    queryFn: () => fetchReports(),
    enabled: !!user && isAdmin,
  });

  const mutation = useMutation({
    mutationFn: resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-reports"] });
      queryClient.invalidateQueries({ queryKey: ["shared-stories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-board-posts"] });
    },
  });

  if (loading) return <div className="mx-auto max-w-3xl px-5 py-16 text-ink-500">Loading…</div>;
  if (!user || !isAdmin) {
    return <div className="mx-auto max-w-3xl px-5 py-16 text-foreground"><h1 className="font-serif text-3xl">Board moderation</h1><p className="mt-3">Admin access required.</p>{!user && <Button asChild className="mt-4"><Link to="/login">Log in</Link></Button>}</div>;
  }

  const reports = (q.data as any[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-serif text-4xl text-foreground">Board moderation</h1><Button asChild variant="outline"><Link to="/admin/messages" search={{ thread: undefined }}>Support Inbox</Link></Button></div>
      <section className="mt-8">
        <h2 className="font-serif text-2xl text-foreground">Board posts</h2>
        {posts.isPending && <p className="mt-4 text-muted-foreground">Loading posts…</p>}
        {posts.isError && <p role="alert" className="mt-4 text-destructive">{posts.error.message}</p>}
        {posts.data?.length === 0 && <p className="mt-4 text-muted-foreground">No board posts.</p>}
        <div className="mt-4 space-y-4">{posts.data?.map((post) => <BoardPost key={post.id} post={post} />)}</div>
      </section>
      <h2 className="mt-12 font-serif text-2xl text-foreground">Reported posts</h2>
      {q.isError && <p role="alert" className="mt-4 text-destructive">Could not load reports.</p>}
      {mutation.isError && <p role="alert" className="mt-4 text-destructive">{mutation.error.message}</p>}

      {q.isLoading && <p className="mt-6 text-ink-500">Loading…</p>}
      {!q.isLoading && reports.length === 0 && (
        <div className="note-card mt-8 p-6 text-ink-700">Nothing reported. 🌿</div>
      )}

      <div className="mt-8 space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="note-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-lg text-ink-900">{r.notebooks?.title ?? "Untitled story"}</h2>
              <span className="rounded-full border border-ink-300 px-3 py-1 text-xs text-ink-600">
                {r.status}{r.notebooks?.hidden ? " · hidden" : ""}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-rose-600">{r.reason}</p>
            {r.details && <p className="mt-1 text-sm text-ink-700">{r.details}</p>}
            <p className="mt-1 text-xs text-ink-400">{new Date(r.created_at).toLocaleString()}</p>
            {r.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button variant="destructive" disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ data: { reportId: r.id, action: "remove" } })}
                >
                  Remove story
                </Button>
                <Button variant="outline" disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ data: { reportId: r.id, action: "keep" } })}
                >
                  Keep — no violation
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <AdminAccounts />
    </div>
  );
}

type BoardPostData = Awaited<ReturnType<typeof listBoardPostsForAdmin>>[number];

function BoardPost({ post }: { post: BoardPostData }) {
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [remove, setRemove] = useState(false);
  const [success, setSuccess] = useState("");
  const qc = useQueryClient();
  const moderate = useServerFn(moderateBoardPost);
  const removePage = useServerFn(removeBoardPageForAdmin);
  const pageMutation = useMutation({ mutationFn: removePage, onSuccess: () => {
    for (const key of ["admin-board-posts", "shared-stories"]) void qc.invalidateQueries({ queryKey: [key] });
  } });
  const mutation = useMutation({ mutationFn: (input: { data: { notebookId: string; remove: boolean; notice?: string } }) => moderate(input), onSuccess: (_, variables) => {
    setSuccess(variables.data.remove ? "Post removed from the board." : "Policy notice sent to the writer’s Inbox.");
    setEditing(false); setNotice("");
    for (const key of ["admin-board-posts", "story-reports", "shared-stories", "shared-story", "admin-messages"]) void qc.invalidateQueries({ queryKey: [key] });
  } });
  return <article className="rounded-lg border border-border bg-card p-5 text-card-foreground">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="break-words font-serif text-xl">{post.title}</h3><span className="text-sm text-muted-foreground">{post.hidden || !post.shared ? "Removed" : "On the board"}</span></div>
    <details className="mt-3"><summary className="cursor-pointer text-sm font-semibold">Read shared pages ({post.pages.length})</summary><div className="mt-3 space-y-4">{post.pages.map((page) => <div key={page.id} className="border-t border-border pt-3"><p className="whitespace-pre-wrap break-words text-sm">{page.content}</p><Button className="mt-2" variant="destructive" size="sm" disabled={pageMutation.isPending} onClick={() => { if (window.confirm("Remove this page from the public board? The writer’s private page is kept.")) pageMutation.mutate({ data: { id: page.id } }); }}><Trash2 />Remove this page</Button></div>)}</div></details>
    {pageMutation.isError && <p role="alert" className="mt-3 text-destructive">{pageMutation.error.message}</p>}
    <div className="mt-4 flex flex-wrap gap-2">
      <Button variant="destructive" disabled={mutation.isPending || post.hidden || !post.shared} onClick={() => { setEditing(true); setRemove(true); setSuccess(""); }}><Trash2 />Remove from board</Button>
      <Button variant="outline" disabled={mutation.isPending} onClick={() => { setEditing(true); setRemove(false); setSuccess(""); }}><MessageSquare />Message writer</Button>
    </div>
    {editing && <form className="mt-5 space-y-3 border-t border-border pt-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ data: { notebookId: post.id, remove, ...(notice.trim() ? { notice: notice.trim() } : {}) } }); }}>
      <p className="text-sm text-muted-foreground">{remove ? "This removes the public post, not the writer’s private notebook. Add an optional policy notice." : "Send a private policy notice to the writer’s Inbox."}</p>
      <label className="block text-sm font-semibold" htmlFor={`notice-${post.id}`}>Policy notice {remove ? "(optional)" : "(required)"}</label>
      <textarea id={`notice-${post.id}`} required={!remove} maxLength={4000} rows={4} value={notice} onChange={(event) => setNotice(event.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-foreground" />
      <div className="flex flex-wrap gap-2"><Button type="submit" variant={remove ? "destructive" : "default"} disabled={mutation.isPending || (!remove && !notice.trim())}><Shield />{mutation.isPending ? "Saving…" : remove ? "Confirm removal" : "Send policy notice"}</Button><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setEditing(false)}>Cancel</Button></div>
    </form>}
    {mutation.isError && <p role="alert" className="mt-3 text-sm text-destructive">{mutation.error.message}</p>}
    {success && <p role="status" className="mt-3 text-sm text-foreground">{success}</p>}
  </article>;
}
