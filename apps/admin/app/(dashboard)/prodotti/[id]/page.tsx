import { notFound } from "next/navigation";
import { List, Pencil, Plus, Trash2 } from "lucide-react";
import { getProductCategories, listProductFeatures, listProducts } from "@crewmate/db";
import { Button, Card, Input } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { ProductForm } from "../_components/ProductForm";
import { addProductFeatureAction, deleteProductFeatureAction } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  // Service role solo per i prodotti (RLS pubblica: solo enabled = true).
  // Le categorie e le feature prodotto sono leggibili pubblicamente.
  const service = createServiceRoleClient();
  const [products, categories, features] = await Promise.all([
    listProducts(service),
    getProductCategories(supabase),
    listProductFeatures(supabase, id),
  ]);
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica prodotto</h1>
      <Card icon={<Pencil />} title={product.name} className="mt-8">
        <ProductForm product={product} categories={categories} />
      </Card>

      <Card icon={<List />} title="Elenco puntato (vantaggi)" className="mt-6">
        <div className="flex flex-col gap-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between rounded-sm border border-border bg-surface-alt px-3 py-2"
            >
              <span className="text-sm text-text">{feature.text}</span>
              <form action={deleteProductFeatureAction}>
                <input type="hidden" name="id" value={feature.id} />
                <input type="hidden" name="product_id" value={product.id} />
                <Button type="submit" variant="ghost" size="sm" icon={<Trash2 className="size-4" aria-hidden />}>
                  Rimuovi
                </Button>
              </form>
            </div>
          ))}
          {features.length === 0 ? <p className="text-sm text-text-dim">Nessuna voce ancora.</p> : null}
        </div>

        <form action={addProductFeatureAction} className="mt-4 flex gap-2">
          <input type="hidden" name="product_id" value={product.id} />
          <input type="hidden" name="order" value={features.length + 1} />
          <Input name="text" placeholder="Es. Prefix [VIP] in chat" required className="flex-1" />
          <Button type="submit" icon={<Plus className="size-4" aria-hidden />}>
            Aggiungi
          </Button>
        </form>
      </Card>
    </div>
  );
}
