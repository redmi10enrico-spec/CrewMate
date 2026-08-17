import { Badge, Card, Container, SectionTitle } from "@crewmate/ui";

export default function DashboardPage() {
  return (
    <Container>
      <div className="py-16">
        <SectionTitle subtitle="Da qui gestirai tutti i contenuti del sito pubblico.">
          Dashboard
        </SectionTitle>
        <Card title="Fondamenta pronte">
          <Badge tone="green">Fase 3 completata</Badge>
          <p className="mt-4 text-text-muted">
            Autenticazione e guard <code className="text-accent">role = admin</code> attivi, audit log
            pronto. Le prime sezioni editabili (aspetto, modalità server) arrivano in Fase 4.
          </p>
        </Card>
      </div>
    </Container>
  );
}
