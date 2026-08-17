import { notFound, redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import { getApplicationForms, getApplicationQuestions, getUserApplication } from "@crewmate/db";
import { Alert, Badge, Button, Card, Container } from "@crewmate/ui";
import { ApplicationQuestionField } from "@/components/ApplicationQuestionField";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitApplicationAction } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  pending: "In attesa di revisione",
  interview: "Colloquio",
  accepted: "Accettata",
  rejected: "Rifiutata",
};

export default async function ApplicationFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const forms = await getApplicationForms(supabase);
  const form = forms.find((item) => item.slug === slug);

  if (!form) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/candidature/${slug}`)}`);
  }

  const [existing, questions] = await Promise.all([
    getUserApplication(supabase, form.id, user.id),
    getApplicationQuestions(supabase, form.id),
  ]);

  const boundSubmit = submitApplicationAction.bind(
    null,
    form.id,
    questions.map((question) => question.id)
  );

  return (
    <Container>
      <div className="mx-auto max-w-xl py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{form.role_name}</h1>
        <p className="mt-2 text-text-muted">{form.description}</p>

        {existing ? (
          <Card className="mt-8" title="Hai già inviato una candidatura">
            <p>Stato attuale:</p>
            <Badge tone="accent" className="mt-2">
              {STATUS_LABEL[existing.status] ?? existing.status}
            </Badge>
          </Card>
        ) : !form.is_open ? (
          <Alert tone="warning" className="mt-8">
            Le candidature per questo ruolo sono chiuse al momento.
          </Alert>
        ) : (
          <Card className="mt-8" title="Modulo di candidatura">
            <form action={boundSubmit} className="flex flex-col gap-4">
              {questions.map((question) => (
                <ApplicationQuestionField key={question.id} question={question} />
              ))}
              <Button type="submit" icon={<UserPlus className="size-4" aria-hidden />}>
                Invia candidatura
              </Button>
            </form>
          </Card>
        )}
      </div>
    </Container>
  );
}
