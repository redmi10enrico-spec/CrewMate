import { Award, Check, Crown, Info, Medal, Pickaxe, Sparkles, Sword } from "lucide-react";
import type { ComponentType } from "react";
import { Badge, Button, Card, Container } from "@crewmate/ui";

interface ShopProduct {
  id: string;
  badge: string;
  icon: ComponentType<{ className?: string }>;
  name: string;
  price: string;
  priceNote: string;
  features: string[];
  featured?: boolean;
}

const PRODUCTS: ShopProduct[] = [
  {
    id: "vip",
    badge: "Rank",
    icon: Medal,
    name: "VIP",
    price: "4,99€",
    priceNote: "per sempre",
    features: ["Prefix [VIP] in chat", "2 home extra", "Accesso a /kit vip"],
  },
  {
    id: "mvp",
    badge: "Popolare",
    icon: Award,
    name: "MVP",
    price: "9,99€",
    priceNote: "per sempre",
    features: ["Tutti i vantaggi VIP", "Prefix [MVP] colorato", "5 home extra", "Effetti particellari"],
    featured: true,
  },
  {
    id: "elite",
    badge: "Rank",
    icon: Crown,
    name: "ELITE",
    price: "19,99€",
    priceNote: "per sempre",
    features: ["Tutti i vantaggi MVP", "Prefix [ELITE] animato", "Home illimitate", "Accesso prioritario"],
  },
  {
    id: "kit-guerriero",
    badge: "Kit",
    icon: Sword,
    name: "Kit Guerriero",
    price: "2,99€",
    priceNote: "una tantum",
    features: ["Armatura in diamante", "Spada incantata", "Pozioni assortite"],
  },
  {
    id: "kit-minatore",
    badge: "Kit",
    icon: Pickaxe,
    name: "Kit Minatore",
    price: "2,99€",
    priceNote: "una tantum",
    features: ["Piccone Fortuna III", "Set completo di picconi", "Torce e cibo"],
  },
  {
    id: "particelle",
    badge: "Cosmetico",
    icon: Sparkles,
    name: "Pacchetto Particelle",
    price: "3,99€",
    priceNote: "una tantum",
    features: ["20+ effetti particellari", "Scie personalizzate", "Ali cosmetiche"],
  },
];

export default function ShopPage() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Shop</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Supporta il server e sblocca ranghi, kit e vantaggi esclusivi. Ogni acquisto ci aiuta a tenere
          il server online.
        </p>
      </div>

      <div className="grid gap-5 pb-8 sm:grid-cols-2 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card
            key={product.id}
            interactive
            icon={<product.icon />}
            className={product.featured ? "border-accent/50" : undefined}
          >
            <Badge tone={product.featured ? "accent" : "neutral"}>{product.badge}</Badge>
            <h3 className="mt-3 text-base font-semibold text-text">{product.name}</h3>
            <p className="mt-2 text-xl font-semibold text-text">
              {product.price} <span className="text-sm font-normal text-text-muted">/ {product.priceNote}</span>
            </p>
            <ul className="my-5 flex flex-col gap-2 text-sm text-text-muted">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-success" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant={product.featured ? "primary" : "secondary"} className="w-full">
              Acquista
            </Button>
          </Card>
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 pb-16 text-center text-sm text-text-dim">
        <Info className="size-4 shrink-0" aria-hidden />
        Il carrello e i pagamenti reali arrivano nella Fase 5/10 della roadmap — questa è ancora una
        vetrina statica dei prodotti.
      </p>
    </Container>
  );
}
