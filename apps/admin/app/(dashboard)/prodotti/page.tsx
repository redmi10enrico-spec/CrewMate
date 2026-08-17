import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getProductCategories, listProducts } from "@crewmate/db";
import { Badge, Button, DataTable, Switch } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { deleteProductAction, toggleProductAction } from "./actions";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  // Service role per i prodotti: la RLS pubblica mostra solo enabled = true,
  // l'admin deve vedere anche quelli nascosti. Le categorie invece sono
  // pubbliche senza restrizioni, va bene il client autenticato normale.
  const service = createServiceRoleClient();
  const [products, categories] = await Promise.all([
    listProducts(service),
    getProductCategories(supabase),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return (
    <div className="mx-auto max-w-5xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Prodotti</h1>
          <p className="mt-2 text-text-muted">Ranghi, kit e cosmetici in vendita nello Shop.</p>
        </div>
        <Link href="/prodotti/nuovo">
          <Button icon={<Plus className="size-4" aria-hidden />}>Nuovo prodotto</Button>
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Prodotto",
              cell: (product) => (
                <Link href={`/prodotti/${product.id}`} className="font-medium text-text hover:text-accent">
                  {product.name}
                </Link>
              ),
            },
            {
              header: "Categoria",
              cell: (product) =>
                product.category_id ? (categoryById.get(product.category_id)?.name ?? "—") : "—",
            },
            { header: "Prezzo", cell: (product) => `${product.price.toFixed(2)}€` },
            {
              header: "Stato",
              cell: (product) => (
                <div className="flex gap-2">
                  {product.enabled ? (
                    <Badge tone="success">Attivo</Badge>
                  ) : (
                    <Badge tone="neutral">Nascosto</Badge>
                  )}
                  {product.featured ? <Badge tone="accent">Popolare</Badge> : null}
                </div>
              ),
            },
            {
              header: "Abilita",
              cell: (product) => (
                <form action={toggleProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="enabled" value={String(!product.enabled)} />
                  <Switch checked={product.enabled} label={`Abilita ${product.name}`} />
                </form>
              ),
            },
            {
              header: "",
              className: "text-right",
              cell: (product) => (
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                    Elimina
                  </Button>
                </form>
              ),
            },
          ]}
          rows={products}
          getRowKey={(product) => product.id}
          emptyMessage="Nessun prodotto configurato."
        />
      </div>
    </div>
  );
}
