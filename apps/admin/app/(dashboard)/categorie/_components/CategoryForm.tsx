import { Save } from "lucide-react";
import type { ProductCategoryRow } from "@crewmate/db";
import { Button, FormField, Input } from "@crewmate/ui";
import { saveCategory } from "../actions";

export function CategoryForm({ category }: { category?: ProductCategoryRow }) {
  return (
    <form action={saveCategory} className="flex flex-col gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <FormField label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={category?.name} required />
      </FormField>
      <FormField label="Slug" htmlFor="slug" hint="Solo lettere minuscole, numeri e trattini.">
        <Input id="slug" name="slug" defaultValue={category?.slug} pattern="[a-z0-9-]+" required />
      </FormField>
      <FormField label="Ordine" htmlFor="order" hint="Numero più basso = mostrato prima.">
        <Input id="order" name="order" type="number" defaultValue={category?.order ?? 0} />
      </FormField>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {category ? "Salva modifiche" : "Crea categoria"}
      </Button>
    </form>
  );
}
