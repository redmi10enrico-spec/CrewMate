import Link from "next/link";
import { Play, ShoppingCart, UserPlus } from "lucide-react";
import { Badge, Button, Card, Container, SectionTitle, getIcon } from "@crewmate/ui";
import { IpCopyButton } from "@/components/IpCopyButton";
import { getHomeContent } from "@/lib/site-content";

export const revalidate = 60;

export default async function Home() {
  const { settings, serverModes, homeFeatures } = await getHomeContent();

  return (
    <Container>
      <div className="flex animate-fade-in flex-col items-center gap-6 py-24 text-center">
        <Badge tone="success" icon={<span className="size-1.5 rounded-full bg-success" />}>
          Server Online
        </Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          {settings.hero_title}
        </h1>
        <p className="max-w-2xl text-lg text-text-muted">{settings.hero_description}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button size="lg" icon={<Play className="size-4" aria-hidden />}>
            Gioca Ora
          </Button>
          <Link href="/shop">
            <Button size="lg" variant="secondary" icon={<ShoppingCart className="size-4" aria-hidden />}>
              Visita lo Shop
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { label: "Giocatori Online", value: settings.players_online },
            { label: "Versione", value: settings.minecraft_version },
            { label: "Utenti Registrati", value: settings.registered_users },
            { label: "Uptime", value: settings.uptime_label },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold text-text">{stat.value}</p>
              <p className="mt-1 text-sm text-text-dim">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16">
        <SectionTitle subtitle="Scegli come divertirti sul nostro network.">
          Modalità di Gioco
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          {serverModes.map((mode) => {
            const Icon = getIcon(mode.icon);
            return (
              <Card key={mode.id} interactive icon={<Icon />} title={mode.name}>
                {mode.description}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <SectionTitle subtitle="Una community sana e un server curato nei dettagli.">
          Perché {settings.site_name}?
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {homeFeatures.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <Card key={feature.id} interactive icon={<Icon />} title={feature.title}>
                {feature.description}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <Card className="mx-auto max-w-2xl text-center" title="Pronto a iniziare?">
          <p className="mb-6 text-text-muted">Entra nel server e diventa parte della crew. Ti aspettiamo!</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <IpCopyButton serverIp={settings.server_ip} />
            <Link href="/candidature">
              <Button variant="outline" icon={<UserPlus className="size-4" aria-hidden />}>
                Candidati nello Staff
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </Container>
  );
}
