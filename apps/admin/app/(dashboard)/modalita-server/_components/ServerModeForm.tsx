import { Save } from "lucide-react";
import type { ServerModeRow } from "@crewmate/db";
import { Button, FormField, ICON_REGISTRY, Input, Select, Textarea } from "@crewmate/ui";
import { saveServerMode } from "../actions";

export function ServerModeForm({ mode }: { mode?: ServerModeRow }) {
  return (
    <form action={saveServerMode} className="flex flex-col gap-4">
      {mode ? <input type="hidden" name="id" value={mode.id} /> : null}
      <FormField label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={mode?.name} required />
      </FormField>
      <FormField label="Slug" htmlFor="slug" hint="Solo lettere minuscole, numeri e trattini.">
        <Input id="slug" name="slug" defaultValue={mode?.slug} pattern="[a-z0-9-]+" required />
      </FormField>
      <FormField label="Descrizione" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={mode?.description} required />
      </FormField>
      <FormField label="Icona" htmlFor="icon">
        <Select id="icon" name="icon" defaultValue={mode?.icon ?? Object.keys(ICON_REGISTRY)[0]}>
          {Object.keys(ICON_REGISTRY).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Ordine" htmlFor="order" hint="Numero più basso = mostrato prima.">
        <Input id="order" name="order" type="number" defaultValue={mode?.order ?? 0} />
      </FormField>
      <Button type="submit" className="self-start" icon={<Save className="size-4" aria-hidden />}>
        {mode ? "Salva modifiche" : "Crea modalità"}
      </Button>
    </form>
  );
}
