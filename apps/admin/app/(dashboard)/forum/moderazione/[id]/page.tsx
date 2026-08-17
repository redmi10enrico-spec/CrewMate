import { notFound } from "next/navigation";
import { Lock, Pin, Trash2 } from "lucide-react";
import { getForumPosts, listAllForumThreads } from "@crewmate/db";
import { Button, Card, Switch } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { deletePostAction, toggleThreadLockedAction, toggleThreadPinnedAction } from "../../actions";

export default async function ForumThreadModerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = createServiceRoleClient();

  const threads = await listAllForumThreads(service);
  const thread = threads.find((item) => item.id === id);
  if (!thread) {
    notFound();
  }

  const posts = await getForumPosts(service, id);

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">{thread.title}</h1>
      <p className="mt-2 text-text-muted">
        {thread.forum_categories?.name ?? "Categoria rimossa"} · {thread.profiles?.mc_username ?? "Anonimo"}
      </p>

      <div className="mt-6 flex gap-6">
        <form action={toggleThreadPinnedAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={thread.id} />
          <input type="hidden" name="pinned" value={String(!thread.pinned)} />
          <Switch checked={thread.pinned} label="Fissa in evidenza" />
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <Pin className="size-4" aria-hidden />
            In evidenza
          </span>
        </form>
        <form action={toggleThreadLockedAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={thread.id} />
          <input type="hidden" name="locked" value={String(!thread.locked)} />
          <Switch checked={thread.locked} label="Blocca discussione" />
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <Lock className="size-4" aria-hidden />
            Bloccata
          </span>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center justify-between text-sm text-text-dim">
                  <span className="font-medium text-text">{post.profiles?.mc_username ?? "Anonimo"}</span>
                  <span>{new Date(post.created_at).toLocaleString("it-IT")}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-text">{post.content}</p>
              </div>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="thread_id" value={thread.id} />
                <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                  Elimina
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
