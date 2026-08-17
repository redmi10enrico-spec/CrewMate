import Link from "next/link";
import { Calendar, Clock, Mic, UserPlus } from "lucide-react";
import { Button, Card, Container } from "@crewmate/ui";

const REQUIREMENTS = [
  { icon: Calendar, title: "Età minima", description: "Devi avere almeno 14 anni per candidarti." },
  { icon: Mic, title: "Discord", description: "Microfono e account Discord attivo richiesti." },
  { icon: Clock, title: "Disponibilità", description: "Almeno qualche ora a settimana sul server." },
];

export default function CandidaturePage() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Candidature Staff</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Vuoi far parte del team di CrewMate Network? I moduli di candidatura (Helper, Moderatore,
          Builder...) arrivano nella Fase 7 della roadmap, configurabili dall&apos;admin senza toccare il
          codice.
        </p>
      </div>

      <div className="grid gap-5 pb-16 sm:grid-cols-3">
        {REQUIREMENTS.map((req) => (
          <Card key={req.title} icon={<req.icon />} title={req.title}>
            {req.description}
          </Card>
        ))}
      </div>

      <div className="pb-16 text-center">
        <Card className="mx-auto max-w-lg text-center" title="Nel frattempo">
          <p className="mb-6 text-text-muted">
            Crea un account e collega il tuo nome Minecraft: appena i moduli saranno pronti potrai
            candidarti direttamente da qui.
          </p>
          <Link href="/signup">
            <Button className="w-full" icon={<UserPlus className="size-4" aria-hidden />}>
              Crea un account
            </Button>
          </Link>
        </Card>
      </div>
    </Container>
  );
}
