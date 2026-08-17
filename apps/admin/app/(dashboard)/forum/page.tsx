import Link from "next/link";
import { Plus, ShieldAlert, Trash2 } from "lucide-react";
import { getForumCategories } from "@crewmate/db";
import { Badge, Button, DataTable } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { deleteForumCategoryAction } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  user: "Tutti",
  helper: "Helper+",
  mod: "Mod+",
  admin: "Admin",
};

export default async function ForumCategoriesPage() {
  // Service role: current_role_rank() nella RLS si basa sull'utente che
  // chiama; l'admin deve vedere tutte le categorie a prescindere.
  const service = createServiceRoleClient();
  const categories = await getForumCategories(service);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Forum — Categorie</h1>
          <p className="mt-2 text-text-muted">Sezioni del forum, con permessi di lettura/scrittura per ruolo.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/forum/moderazione">
            <Button variant="secondary" icon={<ShieldAlert className="size-4" aria-hidden />}>
              Moderazione
            </Button>
          </Link>
          <Link href="/forum/nuovo">
            <Button icon={<Plus className="size-4" aria-hidden />}>Nuova categoria</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Nome",
              cell: (category) => (
                <Link href={`/forum/${category.id}`} className="font-medium text-text hover:text-accent">
                  {category.name}
                </Link>
              ),
            },
            {
              header: "Vista",
              cell: (category) => <Badge tone="neutral">{ROLE_LABEL[category.min_role_view]}</Badge>,
            },
            {
              header: "Scrittura",
              cell: (category) => <Badge tone="neutral">{ROLE_LABEL[category.min_role_post]}</Badge>,
            },
            {
              header: "",
              className: "text-right",
              cell: (category) => (
                <form action={deleteForumCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={categories}
          getRowKey={(category) => category.id}
          emptyMessage="Nessuna categoria configurata."
        />
      </div>
    </div>
  );
}
