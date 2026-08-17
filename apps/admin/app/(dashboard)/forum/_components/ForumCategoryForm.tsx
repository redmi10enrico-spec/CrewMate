import { Save } from "lucide-react";
import type { AppRole, ForumCategoryRow } from "@crewmate/db";
import { Button, FormField, ICON_REGISTRY, Input, Select, Textarea } from "@crewmate/ui";
import { saveForumCategory } from "../actions";

const ROLES: { value: AppRole; label: string }[] = [
  { value: "user", label: "Tutti gli utenti" },
  { value: "helper", label: "Helper e superiori" },
  { value: "mod", label: "Moderatori e superiori" },
  { value: "admin", label: "Solo admin" },
];

export function ForumCategoryForm({ category }: { category?: ForumCategoryRow }) {
  return (
    <form action={saveForumCategory} className="flex flex-col gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <FormField label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={category?.name} required />
      </FormField>
      <FormField label="Slug" htmlFor="slug" hint="Usato nell'URL /forum/[slug].">
        <Input id="slug" name="slug" defaultValue={category?.slug} pattern="[a-z0-9-]+" required />
      </FormField>
      <FormField label="Descrizione" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={category?.description} />
      </FormField>
      <FormField label="Icona" htmlFor="icon">
        <Select id="icon" name="icon" defaultValue={category?.icon ?? Object.keys(ICON_REGISTRY)[0]}>
          {Object.keys(ICON_REGISTRY).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Ordine" htmlFor="order">
        <Input id="order" name="order" type="number" defaultValue={category?.order ?? 0} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Chi può vedere" htmlFor="min_role_view">
          <Select id="min_role_view" name="min_role_view" defaultValue={category?.min_role_view ?? "user"}>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Chi può scrivere" htmlFor="min_role_post">
          <Select id="min_role_post" name="min_role_post" defaultValue={category?.min_role_post ?? "user"}>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {category ? "Salva modifiche" : "Crea categoria"}
      </Button>
    </form>
  );
}
