import Link from "next/link";
import { ArrowRight, Calendar, Clock, Inbox, Mic } from "lucide-react";
import { Badge, Card, Container } from "@crewmate/ui";
import { getOpenApplicationForms } from "@/lib/applications-content";

export const revalidate = 60;

const REQUIREMENTS = [
  { icon: Calendar, title: "Età minima", description: "Devi avere almeno 14 anni per candidarti." },
  { icon: Mic, title: "Discord", description: "Microfono e account Discord attivo richiesti." },
  { icon: Clock, title: "Disponibilità", description: "Almeno qualche ora a settimana sul server." },
];

export default async function CandidaturePage() {
  const forms = await getOpenApplicationForms();

  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Candidature Staff</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Vuoi far parte del team di CrewMate Network? Scegli un ruolo e compila il modulo.
        </p>
      </div>

      <div className="grid gap-5 pb-16 sm:grid-cols-3">
        {REQUIREMENTS.map((req) => (
          <Card key={req.title} icon={<req.icon />} title={req.title}>
            {req.description}
          </Card>
        ))}
      </div>

      {forms.length === 0 ? (
        <div className="pb-16 text-center">
          <Card className="mx-auto max-w-lg" icon={<Inbox />} title="Nessun modulo disponibile">
            Al momento non ci sono ruoli aperti per le candidature. Torna a trovarci presto!
          </Card>
        </div>
      ) : (
        <div className="grid gap-5 pb-16 sm:grid-cols-2">
          {forms.map((form) => (
            <Link key={form.id} href={`/candidature/${form.slug}`}>
              <Card interactive title={form.role_name}>
                <p>{form.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  {form.is_open ? (
                    <Badge tone="success">Aperte</Badge>
                  ) : (
                    <Badge tone="neutral">Chiuse</Badge>
                  )}
                  <span className="flex items-center gap-1 text-sm font-medium text-accent">
                    Candidati
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
