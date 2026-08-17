import { Badge, Button, Card, Container, SectionTitle } from "@crewmate/ui";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <Badge tone="green">Server Online</Badge>
        <h1 className="font-title text-2xl text-text">CrewMate Network</h1>
        <div className="flex gap-4">
          <Button>Gioca Ora</Button>
          <Button variant="outline">Visita lo Shop</Button>
        </div>
      </div>
      <SectionTitle subtitle="Verifica che il design system di packages/ui sia collegato correttamente.">
        Design System — Fase 0
      </SectionTitle>
      <div className="grid gap-6 pb-20 sm:grid-cols-3">
        <Card icon="⛏️" title="Survival">
          Sopravvivi, costruisci ed esplora un mondo persistente.
        </Card>
        <Card icon="🏝️" title="SkyBlock">
          Parti da un&apos;isola nel vuoto e costruisci il tuo impero.
        </Card>
        <Card icon="⚔️" title="Minigames">
          Sfida gli altri giocatori in modalità competitive.
        </Card>
      </div>
    </Container>
  );
}
