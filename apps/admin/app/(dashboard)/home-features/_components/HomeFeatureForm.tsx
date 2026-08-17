import { Save } from "lucide-react";
import type { HomeFeatureRow } from "@crewmate/db";
import { Button, FormField, ICON_REGISTRY, Input, Select, Textarea } from "@crewmate/ui";
import { saveHomeFeature } from "../actions";

export function HomeFeatureForm({ feature }: { feature?: HomeFeatureRow }) {
  return (
    <form action={saveHomeFeature} className="flex flex-col gap-4">
      {feature ? <input type="hidden" name="id" value={feature.id} /> : null}
      <FormField label="Titolo" htmlFor="title">
        <Input id="title" name="title" defaultValue={feature?.title} required />
      </FormField>
      <FormField label="Descrizione" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={feature?.description} required />
      </FormField>
      <FormField label="Icona" htmlFor="icon">
        <Select id="icon" name="icon" defaultValue={feature?.icon ?? Object.keys(ICON_REGISTRY)[0]}>
          {Object.keys(ICON_REGISTRY).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Ordine" htmlFor="order" hint="Numero più basso = mostrato prima.">
        <Input id="order" name="order" type="number" defaultValue={feature?.order ?? 0} />
      </FormField>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {feature ? "Salva modifiche" : "Crea feature"}
      </Button>
    </form>
  );
}
