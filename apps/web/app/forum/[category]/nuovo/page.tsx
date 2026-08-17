import { notFound } from "next/navigation";
import { MessageSquarePlus, Send } from "lucide-react";
import { getForumCategories } from "@crewmate/db";
import { Alert, Button, Card, Container, FormField, Input, Textarea } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createThreadAction } from "./actions";

export default async function NewThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { category: slug } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const categories = await getForumCategories(supabase);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const boundAction = createThreadAction.bind(null, slug);

  return (
    <Container>
      <div className="mx-auto max-w-xl py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Nuova discussione in {category.name}
        </h1>
        <Card icon={<MessageSquarePlus />} title="Scrivi il tuo messaggio" className="mt-8">
          <div className="flex flex-col gap-4">
            {error ? <Alert tone="danger">Compila titolo e messaggio.</Alert> : null}
            <form action={boundAction} className="flex flex-col gap-4">
              <FormField label="Titolo" htmlFor="title">
                <Input id="title" name="title" required />
              </FormField>
              <FormField label="Messaggio" htmlFor="content">
                <Textarea id="content" name="content" rows={6} required />
              </FormField>
              <Button type="submit" icon={<Send className="size-4" aria-hidden />}>
                Pubblica discussione
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}
