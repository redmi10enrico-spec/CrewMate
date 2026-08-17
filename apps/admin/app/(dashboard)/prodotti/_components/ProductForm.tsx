import { Save } from "lucide-react";
import type { ProductCategoryRow, ProductRow } from "@crewmate/db";
import { Button, FormField, Input, Select, Textarea } from "@crewmate/ui";
import { saveProduct } from "../actions";

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductRow;
  categories: ProductCategoryRow[];
}) {
  return (
    <form action={saveProduct} className="flex flex-col gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <FormField label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={product?.name} required />
      </FormField>
      <FormField label="Categoria" htmlFor="category_id">
        <Select id="category_id" name="category_id" defaultValue={product?.category_id ?? ""}>
          <option value="">Nessuna categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Descrizione" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={product?.description} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prezzo (EUR)" htmlFor="price">
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
          />
        </FormField>
        <FormField label="Scorte" htmlFor="stock" hint="Vuoto = illimitate.">
          <Input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? ""} />
        </FormField>
      </div>
      <FormField label="URL immagine" htmlFor="image_url" hint="Opzionale, da Supabase Storage o link esterno.">
        <Input id="image_url" name="image_url" type="url" defaultValue={product?.image_url ?? ""} />
      </FormField>
      <FormField label="Ordine" htmlFor="order">
        <Input id="order" name="order" type="number" defaultValue={product?.order ?? 0} />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured}
          className="size-4 rounded border-border accent-accent"
        />
        In evidenza (badge &quot;Popolare&quot;)
      </label>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {product ? "Salva modifiche" : "Crea prodotto"}
      </Button>
    </form>
  );
}
