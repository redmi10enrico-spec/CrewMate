import { Badge, Container, SectionTitle } from "@crewmate/ui";

export default function AdminHome() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <Badge tone="warning">Scaffold Fase 0</Badge>
        <SectionTitle subtitle="Il guard di autenticazione (role = admin) arriva in Fase 3.">
          Pannello Admin — CrewMate Network
        </SectionTitle>
      </div>
    </Container>
  );
}
