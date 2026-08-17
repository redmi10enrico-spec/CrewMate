import { CheckCircle2, Globe } from "lucide-react";
import { getSiteSettings } from "@crewmate/db";
import { Alert, Button, Card, FormField, Input, Textarea } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveBranding } from "./actions";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const settings = await getSiteSettings(supabase);

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Aspetto & Branding</h1>
      <p className="mt-2 text-text-muted">
        Testi e informazioni mostrate sul sito pubblico. Le modifiche sono visibili entro un minuto.
      </p>

      <Card icon={<Globe />} title="Impostazioni generali" className="mt-8">
        <div className="flex flex-col gap-4">
          {success ? (
            <Alert tone="success" className="items-center">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4" aria-hidden />
                Modifiche salvate.
              </span>
            </Alert>
          ) : null}
          <form action={saveBranding} className="flex flex-col gap-4">
            <FormField label="Nome del sito" htmlFor="site_name">
              <Input id="site_name" name="site_name" defaultValue={asString(settings.site_name)} required />
            </FormField>
            <FormField label="IP del server" htmlFor="server_ip">
              <Input id="server_ip" name="server_ip" defaultValue={asString(settings.server_ip)} required />
            </FormField>
            <FormField label="Link Discord" htmlFor="discord_url">
              <Input id="discord_url" name="discord_url" defaultValue={asString(settings.discord_url)} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Versione Minecraft" htmlFor="minecraft_version">
                <Input
                  id="minecraft_version"
                  name="minecraft_version"
                  defaultValue={asString(settings.minecraft_version)}
                />
              </FormField>
              <FormField label="Etichetta uptime" htmlFor="uptime_label">
                <Input id="uptime_label" name="uptime_label" defaultValue={asString(settings.uptime_label)} />
              </FormField>
            </div>
            <FormField label="Titolo hero (Home)" htmlFor="hero_title">
              <Input id="hero_title" name="hero_title" defaultValue={asString(settings.hero_title)} />
            </FormField>
            <FormField label="Descrizione hero (Home)" htmlFor="hero_description">
              <Textarea
                id="hero_description"
                name="hero_description"
                defaultValue={asString(settings.hero_description)}
              />
            </FormField>
            <Button type="submit" className="self-start">
              Salva modifiche
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
