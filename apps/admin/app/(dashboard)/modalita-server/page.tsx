import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { listServerModes } from "@crewmate/db";
import { Badge, Button, DataTable, Switch, getIcon } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteServerModeAction, toggleServerModeAction } from "./actions";

export default async function ServerModesPage() {
  const supabase = await createSupabaseServerClient();
  const modes = await listServerModes(supabase);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Modalità di gioco</h1>
          <p className="mt-2 text-text-muted">
            Le card mostrate nella sezione &quot;Modalità di Gioco&quot; della Home.
          </p>
        </div>
        <Link href="/modalita-server/nuovo">
          <Button icon={<Plus className="size-4" aria-hidden />}>Nuova modalità</Button>
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Modalità",
              cell: (mode) => {
                const Icon = getIcon(mode.icon);
                return (
                  <Link href={`/modalita-server/${mode.id}`} className="flex items-center gap-3 hover:text-text">
                    <span className="flex size-8 items-center justify-center rounded-sm bg-accent-muted text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="font-medium text-text">{mode.name}</span>
                  </Link>
                );
              },
            },
            { header: "Ordine", cell: (mode) => mode.order },
            {
              header: "Stato",
              cell: (mode) =>
                mode.enabled ? (
                  <Badge tone="success">Attiva</Badge>
                ) : (
                  <Badge tone="neutral">Nascosta</Badge>
                ),
            },
            {
              header: "Abilita",
              cell: (mode) => (
                <form action={toggleServerModeAction}>
                  <input type="hidden" name="id" value={mode.id} />
                  <input type="hidden" name="enabled" value={String(!mode.enabled)} />
                  <Switch checked={mode.enabled} label={`Abilita ${mode.name}`} />
                </form>
              ),
            },
            {
              header: "",
              className: "text-right",
              cell: (mode) => (
                <form action={deleteServerModeAction}>
                  <input type="hidden" name="id" value={mode.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={modes}
          getRowKey={(mode) => mode.id}
          emptyMessage="Nessuna modalità configurata."
        />
      </div>
    </div>
  );
}
