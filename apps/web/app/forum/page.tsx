import Link from "next/link";
import { Button, Card, Container } from "@crewmate/ui";

const CATEGORIES = [
  { icon: "📢", title: "Annunci", description: "Novità ufficiali, aggiornamenti e patch note." },
  { icon: "💡", title: "Suggerimenti", description: "Proponi idee per migliorare il server." },
  { icon: "🛠️", title: "Supporto", description: "Problemi tecnici, bug e richieste di aiuto." },
  { icon: "🏗️", title: "Creazioni", description: "Mostra le tue costruzioni e progetti." },
  {
    icon: "⚖️",
    title: "Segnalazioni & Ban Appeal",
    description: "Segnala giocatori o richiedi la revisione di un ban.",
  },
  { icon: "🗨️", title: "Off-Topic", description: "Chiacchiere libere fuori dal gioco." },
];

export default function ForumPage() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="font-title text-xl text-text">💬 Forum</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Discuti con la community, chiedi aiuto, condividi le tue creazioni e resta aggiornato sulle
          novità.
        </p>
      </div>

      <div className="grid gap-8 pb-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-title text-sm text-text">Categorie</h2>
            <Button>+ Nuova Discussione</Button>
          </div>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => (
              <a
                key={category.title}
                href="#"
                className="flex items-center gap-4 rounded-lg border border-accent-soft bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="flex-1">
                  <span className="block text-text">{category.title}</span>
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
          <Card title="📊 Statistiche">
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              <p>
                Discussioni <span className="float-right text-text-dim">0 totali</span>
              </p>
              <p>
                Messaggi <span className="float-right text-text-dim">0 totali</span>
              </p>
              <p>
                Membri <span className="float-right text-text-dim">0 registrati</span>
              </p>
            </div>
          </Card>

          <Card title="🔥 Ultime Discussioni">
            <p className="text-sm text-text-muted">Nessuna discussione ancora.</p>
            <p className="text-sm text-text-dim">Sii il primo a scrivere!</p>
          </Card>

          <Card title="👋 Unisciti">
            <p className="mb-4 text-sm text-text-muted">Registrati per partecipare alle discussioni.</p>
            <Link href="/signup">
              <Button className="w-full">Registrati</Button>
            </Link>
          </Card>
        </aside>
      </div>

      <p className="pb-16 text-center text-sm text-text-dim">
        💡 Il forum diventa scrivibile (discussioni, risposte, moderazione) nella Fase 8 della roadmap.
      </p>
    </Container>
  );
}
