import Link from "next/link";
import {
  BarChart3,
  Flame,
  Gavel,
  Hammer,
  Info,
  MessageCircle,
  Megaphone,
  Plus,
  UserPlus,
  Wrench,
} from "lucide-react";
import { Button, Card, Container } from "@crewmate/ui";

const CATEGORIES = [
  { icon: Megaphone, title: "Annunci", description: "Novità ufficiali, aggiornamenti e patch note." },
  { icon: MessageCircle, title: "Suggerimenti", description: "Proponi idee per migliorare il server." },
  { icon: Wrench, title: "Supporto", description: "Problemi tecnici, bug e richieste di aiuto." },
  { icon: Hammer, title: "Creazioni", description: "Mostra le tue costruzioni e progetti." },
  {
    icon: Gavel,
    title: "Segnalazioni & Ban Appeal",
    description: "Segnala giocatori o richiedi la revisione di un ban.",
  },
  { icon: MessageCircle, title: "Off-Topic", description: "Chiacchiere libere fuori dal gioco." },
];

export default function ForumPage() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Forum</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Discuti con la community, chiedi aiuto, condividi le tue creazioni e resta aggiornato sulle
          novità.
        </p>
      </div>

      <div className="grid gap-8 pb-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Categorie</h2>
            <Button size="sm" icon={<Plus className="size-4" aria-hidden />}>
              Nuova Discussione
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => (
              <a
                key={category.title}
                href="#"
                className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-150 hover:border-border-hover hover:bg-surface-hover"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-accent-muted text-accent">
                  <category.icon className="size-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-text">{category.title}</span>
                  <span className="block text-sm text-text-muted">{category.description}</span>
                </span>
                <span className="text-sm text-text-dim">
                  <strong className="text-text">0</strong> discussioni
                </span>
              </a>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <Card icon={<BarChart3 />} title="Statistiche">
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              <p className="flex justify-between">
                <span>Discussioni</span> <span className="text-text-dim">0 totali</span>
              </p>
              <p className="flex justify-between">
                <span>Messaggi</span> <span className="text-text-dim">0 totali</span>
              </p>
              <p className="flex justify-between">
                <span>Membri</span> <span className="text-text-dim">0 registrati</span>
              </p>
            </div>
          </Card>

          <Card icon={<Flame />} title="Ultime Discussioni">
            <p className="text-sm text-text-muted">Nessuna discussione ancora.</p>
            <p className="text-sm text-text-dim">Sii il primo a scrivere!</p>
          </Card>

          <Card icon={<UserPlus />} title="Unisciti">
            <p className="mb-4 text-sm text-text-muted">Registrati per partecipare alle discussioni.</p>
            <Link href="/signup">
              <Button className="w-full">Registrati</Button>
            </Link>
          </Card>
        </aside>
      </div>

      <p className="flex items-center justify-center gap-2 pb-16 text-center text-sm text-text-dim">
        <Info className="size-4 shrink-0" aria-hidden />
        Il forum diventa scrivibile (discussioni, risposte, moderazione) nella Fase 8 della roadmap.
      </p>
    </Container>
  );
}
