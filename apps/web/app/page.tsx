import Link from "next/link";
import { Badge, Button, Card, Container, SectionTitle } from "@crewmate/ui";
import { IpCopyButton } from "@/components/IpCopyButton";
import { getHomeContent } from "@/lib/site-content";

export default async function Home() {
  const { settings, serverModes, homeFeatures } = await getHomeContent();

  return (
    <Container>
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <Badge tone="green">🟢 Server Online</Badge>
        <h1 className="font-title text-2xl text-accent">{settings.hero_title}</h1>
        <p className="max-w-2xl text-text-muted">{settings.hero_description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">🎮 Gioca Ora</Button>
          <Link href="/shop">
            <Button size="lg" variant="outline">
              🛒 Visita lo Shop
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="text-center">
            <p className="font-title text-lg text-accent">{settings.players_online}</p>
            <p className="text-sm text-text-muted">Giocatori Online</p>
          </div>
          <div className="text-center">
            <p className="font-title text-lg text-accent">{settings.minecraft_version}</p>
            <p className="text-sm text-text-muted">Versione</p>
          </div>
          <div className="text-center">
            <p className="font-title text-lg text-accent">{settings.registered_users}</p>
            <p className="text-sm text-text-muted">Utenti Registrati</p>
          </div>
          <div className="text-center">
            <p className="font-title text-lg text-accent">{settings.uptime_label}</p>
            <p className="text-sm text-text-muted">Uptime</p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <SectionTitle subtitle="Scegli come divertirti sul nostro network.">
          Modalità di Gioco
        </SectionTitle>
        <div className="grid gap-6 sm:grid-cols-3">
          {serverModes.map((mode) => (
            <Card key={mode.id} icon={mode.icon} title={mode.name}>
              {mode.description}
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16">
        <SectionTitle subtitle="Una community sana e un server curato nei dettagli.">
          Perché {settings.site_name}?
        </SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {homeFeatures.map((feature) => (
            <Card key={feature.id} icon={feature.icon} title={feature.title}>
              {feature.description}
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <Card className="mx-auto max-w-2xl" title="Pronto a iniziare?">
          <p className="mb-6 text-text-muted">Entra nel server e diventa parte della crew. Ti aspettiamo!</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <IpCopyButton serverIp={settings.server_ip} />
            <Link href="/candidature">
              <Button variant="outline">Candidati nello Staff</Button>
            </Link>
          </div>
        </Card>
      </section>
    </Container>
  );
}
