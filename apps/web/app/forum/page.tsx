import Link from "next/link";
import { BarChart3, Flame, Inbox, UserPlus } from "lucide-react";
import { Button, Card, Container, getIcon } from "@crewmate/ui";
import { getForumHomeContent } from "@/lib/forum-content";

export const revalidate = 60;

export default async function ForumPage() {
  const { categories, stats, latestThreads } = await getForumHomeContent();

  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Forum</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Discuti con la community, chiedi aiuto, condividi le tue creazioni e resta aggiornato sulle
          novità.
        </p>
      </div>

      <div className="grid gap-8 pb-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-5 text-lg font-semibold text-text">Categorie</h2>
          {categories.length === 0 ? (
            <Card icon={<Inbox />} title="Nessuna categoria ancora">
              Il forum non ha ancora categorie configurate dall&apos;admin.
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map((category) => {
                const Icon = getIcon(category.icon);
                return (
                  <Link
                    key={category.id}
                    href={`/forum/${category.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-150 hover:border-border-hover hover:bg-surface-hover"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-accent-muted text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-text">{category.name}</span>
                      <span className="block text-sm text-text-muted">{category.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <Card icon={<BarChart3 />} title="Statistiche">
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              <p className="flex justify-between">
                <span>Discussioni</span> <span className="text-text-dim">{stats.threads} totali</span>
              </p>
              <p className="flex justify-between">
                <span>Messaggi</span> <span className="text-text-dim">{stats.posts} totali</span>
              </p>
              <p className="flex justify-between">
                <span>Membri</span> <span className="text-text-dim">{stats.members} registrati</span>
              </p>
            </div>
          </Card>

          <Card icon={<Flame />} title="Ultime Discussioni">
            {latestThreads.length === 0 ? (
              <>
                <p className="text-sm text-text-muted">Nessuna discussione ancora.</p>
                <p className="text-sm text-text-dim">Sii il primo a scrivere!</p>
              </>
            ) : (
              <ul className="flex flex-col gap-2">
                {latestThreads.map((thread) => (
                  <li key={thread.id} className="truncate text-sm">
                    <span className="text-text">{thread.title}</span>
                    <span className="ml-1 text-text-dim">— {thread.profiles?.mc_username ?? "Anonimo"}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card icon={<UserPlus />} title="Unisciti">
            <p className="mb-4 text-sm text-text-muted">Registrati per partecipare alle discussioni.</p>
            <Link href="/signup">
              <Button className="w-full">Registrati</Button>
            </Link>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
