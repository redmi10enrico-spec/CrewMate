import { CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { Badge, Card } from "@crewmate/ui";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Dashboard</h1>
      <p className="mt-2 text-text-muted">Da qui gestirai tutti i contenuti del sito pubblico.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Card icon={<ShieldCheck />} title="Accesso protetto">
          <Badge tone="success" icon={<CheckCircle2 />}>
            Attivo
          </Badge>
          <p className="mt-3">
            Il pannello è raggiungibile solo da account con <code className="text-accent">role = admin</code>.
          </p>
        </Card>

        <Card icon={<ClipboardList />} title="Audit log">
          <Badge tone="success" icon={<CheckCircle2 />}>
            Pronto
          </Badge>
          <p className="mt-3">Ogni modifica futura verrà tracciata con autore, entità e diff.</p>
        </Card>
      </div>

      <p className="mt-10 text-sm text-text-dim">
        Le prime sezioni editabili (aspetto del sito, modalità server) arrivano in Fase 4.
      </p>
    </div>
  );
}
