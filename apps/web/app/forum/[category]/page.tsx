import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye, Pin, Plus } from "lucide-react";
import { getForumCategories, getForumThreads } from "@crewmate/db";
import { Button, Container } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ForumCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const supabase = await createSupabaseServerClient();

  const categories = await getForumCategories(supabase);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const threads = await getForumThreads(supabase, category.id);

  return (
    <Container>
      <div className="py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{category.name}</h1>
            <p className="mt-2 text-text-muted">{category.description}</p>
          </div>
          <Link href={`/forum/${category.slug}/nuovo`}>
            <Button icon={<Plus className="size-4" aria-hidden />}>Nuova Discussione</Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {threads.length === 0 ? (
            <p className="text-center text-text-muted">Nessuna discussione ancora. Sii il primo a scrivere!</p>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${category.slug}/${thread.slug}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-150 hover:border-border-hover hover:bg-surface-hover"
              >
                <div className="flex min-w-0 items-center gap-2">
                  {thread.pinned ? <Pin className="size-4 shrink-0 text-accent" aria-hidden /> : null}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{thread.title}</p>
                    <p className="text-sm text-text-dim">{thread.profiles?.mc_username ?? "Anonimo"}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-sm text-text-dim">
                  <Eye className="size-4" aria-hidden />
                  {thread.views}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}
