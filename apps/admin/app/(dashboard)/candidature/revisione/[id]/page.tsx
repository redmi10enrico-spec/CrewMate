import { notFound } from "next/navigation";
import { ClipboardCheck, User } from "lucide-react";
import {
  getApplicationAnswers,
  getApplicationById,
  getProfile,
  listApplicationForms,
} from "@crewmate/db";
import { Button, Card, FormField, Select, Textarea } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { reviewApplicationAction } from "../actions";

const STATUS_OPTIONS = [
  { value: "pending", label: "In attesa" },
  { value: "interview", label: "Colloquio" },
  { value: "accepted", label: "Accettata" },
  { value: "rejected", label: "Rifiutata" },
];

export default async function ApplicationReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = createServiceRoleClient();

  const application = await getApplicationById(service, id);
  if (!application) {
    notFound();
  }

  const [forms, answers, applicant] = await Promise.all([
    listApplicationForms(service),
    getApplicationAnswers(service, id),
    getProfile(service, application.user_id),
  ]);
  const form = forms.find((item) => item.id === application.form_id);

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">
        Candidatura — {form?.role_name ?? "Ruolo rimosso"}
      </h1>
      <p className="mt-2 text-text-muted">
        Inviata il {new Date(application.created_at).toLocaleString("it-IT")}
      </p>

      <Card icon={<User />} title={applicant?.mc_username ?? "Utente sconosciuto"} className="mt-8">
        {applicant?.mc_verified ? "Nome Minecraft verificato." : "Nome Minecraft non verificato."}
      </Card>

      <Card title="Risposte" className="mt-6">
        <div className="flex flex-col divide-y divide-border">
          {answers.map((answer) => (
            <div key={answer.id} className="py-3">
              <p className="text-sm text-text-muted">{answer.application_questions?.label ?? "Domanda rimossa"}</p>
              <p className="mt-1 text-text">{answer.value || "—"}</p>
            </div>
          ))}
          {answers.length === 0 ? <p className="py-3 text-sm text-text-dim">Nessuna risposta registrata.</p> : null}
        </div>
      </Card>

      <Card icon={<ClipboardCheck />} title="Revisione" className="mt-6">
        <form action={reviewApplicationAction} className="flex flex-col gap-4">
          <input type="hidden" name="application_id" value={application.id} />
          <FormField label="Stato" htmlFor="status">
            <Select id="status" name="status" defaultValue={application.status}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Note interne" htmlFor="notes">
            <Textarea id="notes" name="notes" defaultValue={application.notes ?? ""} rows={4} />
          </FormField>
          <Button type="submit" className="self-start">
            Salva revisione
          </Button>
        </form>
      </Card>
    </div>
  );
}
