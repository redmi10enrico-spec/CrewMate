import { notFound } from "next/navigation";
import { Lock, Send } from "lucide-react";
import { getForumCategories, getForumPosts, getForumThreadBySlug, incrementThreadViews } from "@crewmate/db";
import { Alert, Button, Card, Container, Textarea } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { replyAction } from "./actions";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ category: string; thread: string }>;
}) {
  const { category: categorySlug, thread: threadSlug } = await params;
  const supabase = await createSupabaseServerClient();

  const categories = await getForumCategories(supabase);
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const thread = await getForumThreadBySlug(supabase, category.id, threadSlug);
  if (!thread) {
    notFound();
  }

  const posts = await getForumPosts(supabase, thread.id);

  try {
    await incrementThreadViews(supabase, thread.id);
  } catch {
    // Il conteggio visualizzazioni non è critico: la pagina si carica comunque.
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const boundReply = replyAction.bind(null, thread.id, categorySlug, threadSlug);

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{thread.title}</h1>
        <p className="mt-2 text-sm text-text-dim">{thread.views} visualizzazioni</p>

        <div className="mt-8 flex flex-col gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-center justify-between text-sm text-text-dim">
                <span className="font-medium text-text">{post.profiles?.mc_username ?? "Anonimo"}</span>
                <span>{new Date(post.created_at).toLocaleString("it-IT")}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-text">{post.content}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          {thread.locked ? (
            <Alert tone="warning">
              <span className="flex items-center gap-2">
                <Lock className="size-4" aria-hidden />
                Questa discussione è chiusa: non è più possibile rispondere.
              </span>
            </Alert>
          ) : user ? (
            <Card title="Rispondi">
              <form action={boundReply} className="flex flex-col gap-4">
                <Textarea name="content" rows={4} placeholder="Scrivi una risposta..." required />
                <Button type="submit" className="self-start" icon={<Send className="size-4" aria-hidden />}>
                  Rispondi
                </Button>
              </form>
            </Card>
          ) : (
            <Alert tone="info">Accedi per rispondere a questa discussione.</Alert>
          )}
        </div>
      </div>
    </Container>
  );
}
