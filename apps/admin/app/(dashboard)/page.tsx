import Link from "next/link";
import { ArrowRight, Gamepad2, ListTree, Package, Palette, Receipt, Sparkles } from "lucide-react";
import { Card } from "@crewmate/ui";

const SECTIONS = [
  {
    href: "/branding",
    icon: Palette,
    title: "Aspetto & Branding",
    description: "Nome del sito, IP, link Discord e testi della Home.",
  },
  {
    href: "/modalita-server",
    icon: Gamepad2,
    title: "Modalità di gioco",
    description: "Le card della sezione \"Modalità di Gioco\" nella Home.",
  },
  {
    href: "/home-features",
    icon: Sparkles,
    title: "Perché sceglierci",
    description: "Le card della sezione \"Perché CrewMate?\" nella Home.",
  },
  {
    href: "/categorie",
    icon: ListTree,
    title: "Categorie",
    description: "Raggruppano i prodotti dello Shop.",
  },
  {
    href: "/prodotti",
    icon: Package,
    title: "Prodotti",
    description: "Ranghi, kit e cosmetici in vendita.",
  },
  {
    href: "/ordini",
    icon: Receipt,
    title: "Ordini",
    description: "Storico degli acquisti effettuati.",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Dashboard</h1>
      <p className="mt-2 text-text-muted">Da qui gestirai tutti i contenuti del sito pubblico.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card interactive icon={<section.icon />} title={section.title}>
              {section.description}
              <span className="mt-3 flex items-center gap-1 text-sm font-medium text-accent">
                Apri sezione
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
