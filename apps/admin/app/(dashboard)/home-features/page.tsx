import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { listHomeFeatures } from "@crewmate/db";
import { Badge, Button, DataTable, Switch, getIcon } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteHomeFeatureAction, toggleHomeFeatureAction } from "./actions";

export default async function HomeFeaturesPage() {
  const supabase = await createSupabaseServerClient();
  const features = await listHomeFeatures(supabase);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Perché sceglierci</h1>
          <p className="mt-2 text-text-muted">Le card della sezione &quot;Perché CrewMate?&quot; nella Home.</p>
        </div>
        <Link href="/home-features/nuovo">
          <Button icon={<Plus className="size-4" aria-hidden />}>Nuova feature</Button>
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Feature",
              cell: (feature) => {
                const Icon = getIcon(feature.icon);
                return (
                  <Link
                    href={`/home-features/${feature.id}`}
                    className="flex items-center gap-3 hover:text-text"
                  >
                    <span className="flex size-8 items-center justify-center rounded-sm bg-accent-muted text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="font-medium text-text">{feature.title}</span>
                  </Link>
                );
              },
            },
            { header: "Ordine", cell: (feature) => feature.order },
            {
              header: "Stato",
              cell: (feature) =>
                feature.enabled ? (
                  <Badge tone="success">Attiva</Badge>
                ) : (
                  <Badge tone="neutral">Nascosta</Badge>
                ),
            },
            {
              header: "Abilita",
              cell: (feature) => (
                <form action={toggleHomeFeatureAction}>
                  <input type="hidden" name="id" value={feature.id} />
                  <input type="hidden" name="enabled" value={String(!feature.enabled)} />
                  <Switch checked={feature.enabled} label={`Abilita ${feature.title}`} />
                </form>
              ),
            },
            {
              header: "",
              className: "text-right",
              cell: (feature) => (
                <form action={deleteHomeFeatureAction}>
                  <input type="hidden" name="id" value={feature.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={features}
          getRowKey={(feature) => feature.id}
          emptyMessage="Nessuna feature configurata."
        />
      </div>
    </div>
  );
}
