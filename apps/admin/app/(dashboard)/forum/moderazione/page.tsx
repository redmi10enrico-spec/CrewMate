import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { listAllForumThreads } from "@crewmate/db";
import { Button, DataTable, Switch } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { deleteThreadAction, toggleThreadLockedAction, toggleThreadPinnedAction } from "../actions";

export default async function ForumModerationPage() {
  const service = createServiceRoleClient();
  const threads = await listAllForumThreads(service);

  return (
    <div className="mx-auto max-w-5xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Moderazione forum</h1>
      <p className="mt-2 text-text-muted">Tutte le discussioni, di tutte le categorie.</p>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Discussione",
              cell: (thread) => (
                <Link href={`/forum/moderazione/${thread.id}`} className="font-medium text-text hover:text-accent">
                  {thread.title}
                </Link>
              ),
            },
            { header: "Categoria", cell: (thread) => thread.forum_categories?.name ?? "—" },
            { header: "Autore", cell: (thread) => thread.profiles?.mc_username ?? "Anonimo" },
            {
              header: "Viste",
              cell: (thread) => (
                <span className="flex items-center gap-1 text-text-dim">
                  <Eye className="size-4" aria-hidden />
                  {thread.views}
                </span>
              ),
            },
            {
              header: "In evidenza",
              cell: (thread) => (
                <form action={toggleThreadPinnedAction}>
                  <input type="hidden" name="id" value={thread.id} />
                  <input type="hidden" name="pinned" value={String(!thread.pinned)} />
                  <Switch checked={thread.pinned} label={`Fissa ${thread.title}`} />
                </form>
              ),
            },
            {
              header: "Bloccata",
              cell: (thread) => (
                <form action={toggleThreadLockedAction}>
                  <input type="hidden" name="id" value={thread.id} />
                  <input type="hidden" name="locked" value={String(!thread.locked)} />
                  <Switch checked={thread.locked} label={`Blocca ${thread.title}`} />
                </form>
              ),
            },
            {
              header: "",
              className: "text-right",
              cell: (thread) => (
                <form action={deleteThreadAction}>
                  <input type="hidden" name="id" value={thread.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={threads}
          getRowKey={(thread) => thread.id}
          emptyMessage="Nessuna discussione ancora."
        />
      </div>
    </div>
  );
}
