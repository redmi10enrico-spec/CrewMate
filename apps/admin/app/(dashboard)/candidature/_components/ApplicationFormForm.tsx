import { Save } from "lucide-react";
import type { ApplicationFormRow } from "@crewmate/db";
import { Button, FormField, Input, Textarea } from "@crewmate/ui";
import { saveApplicationForm } from "../actions";

export function ApplicationFormForm({ form }: { form?: ApplicationFormRow }) {
  return (
    <form action={saveApplicationForm} className="flex flex-col gap-4">
      {form ? <input type="hidden" name="id" value={form.id} /> : null}
      <FormField label="Nome del ruolo" htmlFor="role_name">
        <Input id="role_name" name="role_name" defaultValue={form?.role_name} required />
      </FormField>
      <FormField label="Slug" htmlFor="slug" hint="Usato nell'URL /candidature/[slug].">
        <Input id="slug" name="slug" defaultValue={form?.slug} pattern="[a-z0-9-]+" required />
      </FormField>
      <FormField label="Descrizione" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={form?.description} />
      </FormField>
      <FormField label="Ordine" htmlFor="order">
        <Input id="order" name="order" type="number" defaultValue={form?.order ?? 0} />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          name="is_open"
          defaultChecked={form?.is_open ?? true}
          className="size-4 rounded border-border accent-accent"
        />
        Candidature aperte
      </label>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {form ? "Salva modifiche" : "Crea modulo"}
      </Button>
    </form>
  );
}
