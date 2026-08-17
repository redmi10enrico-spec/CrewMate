import { notFound } from "next/navigation";
import { HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { getApplicationQuestions, listApplicationForms } from "@crewmate/db";
import { Button, Card, FormField, Input, Select } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { ApplicationFormForm } from "../_components/ApplicationFormForm";
import { addApplicationQuestionAction, deleteApplicationQuestionAction } from "../actions";

const QUESTION_TYPES = [
  { value: "text", label: "Testo breve" },
  { value: "textarea", label: "Testo lungo" },
  { value: "number", label: "Numero" },
  { value: "select", label: "Elenco a discesa" },
  { value: "radio", label: "Scelta singola" },
  { value: "checkbox", label: "Conferma (checkbox)" },
];

export default async function EditApplicationFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = createServiceRoleClient();
  const forms = await listApplicationForms(service);
  const form = forms.find((item) => item.id === id);

  if (!form) {
    notFound();
  }

  const questions = await getApplicationQuestions(service, id);

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica modulo</h1>
      <Card icon={<Pencil />} title={form.role_name} className="mt-8">
        <ApplicationFormForm form={form} />
      </Card>

      <Card icon={<HelpCircle />} title="Domande del modulo" className="mt-6">
        <div className="flex flex-col gap-2">
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex items-center justify-between rounded-sm border border-border bg-surface-alt px-3 py-2"
            >
              <div>
                <span className="text-sm text-text">{question.label}</span>
                <span className="ml-2 text-xs text-text-dim">
                  ({QUESTION_TYPES.find((t) => t.value === question.type)?.label ?? question.type}
                  {question.required ? ", obbligatoria" : ""})
                </span>
              </div>
              <form action={deleteApplicationQuestionAction}>
                <input type="hidden" name="id" value={question.id} />
                <input type="hidden" name="form_id" value={form.id} />
                <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                  Rimuovi
                </Button>
              </form>
            </div>
          ))}
          {questions.length === 0 ? <p className="text-sm text-text-dim">Nessuna domanda ancora.</p> : null}
        </div>

        <form action={addApplicationQuestionAction} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
          <input type="hidden" name="form_id" value={form.id} />
          <input type="hidden" name="order" value={questions.length + 1} />
          <FormField label="Etichetta" htmlFor="label">
            <Input id="label" name="label" placeholder="Es. Perché vuoi entrare nello staff?" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tipo" htmlFor="type">
              <Select id="type" name="type" defaultValue="text">
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Opzioni" htmlFor="options" hint="Solo per elenco/scelta singola, separate da virgola.">
              <Input id="options" name="options" placeholder="1-5 ore, 5-10 ore, 10+ ore" />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="required" defaultChecked className="size-4 rounded border-border accent-accent" />
            Obbligatoria
          </label>
          <Button type="submit" className="self-start" icon={<Plus className="size-4" aria-hidden />}>
            Aggiungi domanda
          </Button>
        </form>
      </Card>
    </div>
  );
}
