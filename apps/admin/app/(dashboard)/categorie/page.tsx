import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getProductCategories } from "@crewmate/db";
import { Button, DataTable } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteCategoryAction } from "./actions";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const categories = await getProductCategories(supabase);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Categorie prodotto</h1>
          <p className="mt-2 text-text-muted">Raggruppano i prodotti dello Shop (Ranghi, Kit, Cosmetici...).</p>
        </div>
        <Link href="/categorie/nuovo">
          <Button icon={<Plus className="size-4" aria-hidden />}>Nuova categoria</Button>
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Nome",
              cell: (category) => (
                <Link href={`/categorie/${category.id}`} className="font-medium text-text hover:text-accent">
                  {category.name}
                </Link>
              ),
            },
            { header: "Slug", cell: (category) => <span className="font-mono text-xs">{category.slug}</span> },
            { header: "Ordine", cell: (category) => category.order },
            {
              header: "",
              className: "text-right",
              cell: (category) => (
                <form action={deleteCategoryAction}>
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
