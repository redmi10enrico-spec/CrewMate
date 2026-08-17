import Link from "next/link";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { listApplicationForms } from "@crewmate/db";
import { Badge, Button, DataTable, Switch } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { deleteApplicationFormAction, toggleApplicationFormAction } from "./actions";

export default async function ApplicationFormsPage() {
  // Service role: la RLS pubblica mostra solo enabled = true.
  const service = createServiceRoleClient();
  const forms = await listApplicationForms(service);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Candidature — Moduli</h1>
          <p className="mt-2 text-text-muted">I ruoli per cui gli utenti possono candidarsi.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/candidature/revisione">
            <Button variant="secondary" icon={<ClipboardCheck className="size-4" aria-hidden />}>
              Revisiona candidature
            </Button>
          </Link>
          <Link href="/candidature/nuovo">
            <Button icon={<Plus className="size-4" aria-hidden />}>Nuovo modulo</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Ruolo",
              cell: (form) => (
                <Link href={`/candidature/${form.id}`} className="font-medium text-text hover:text-accent">
                  {form.role_name}
                </Link>
              ),
            },
            {
              header: "Stato",
              cell: (form) =>
                form.is_open ? <Badge tone="success">Aperte</Badge> : <Badge tone="neutral">Chiuse</Badge>,
            },
            {
              header: "Visibile",
              cell: (form) => (
                <form action={toggleApplicationFormAction}>
                  <input type="hidden" name="id" value={form.id} />
                  <input type="hidden" name="enabled" value={String(!form.enabled)} />
                  <Switch checked={form.enabled} label={`Mostra ${form.role_name}`} />
                </form>
              ),
            },
            {
              header: "",
              className: "text-right",
              cell: (form) => (
                <form action={deleteApplicationFormAction}>
                  <input type="hidden" name="id" value={form.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={forms}
          getRowKey={(form) => form.id}
          emptyMessage="Nessun modulo configurato."
        />
      </div>
    </div>
  );
}
