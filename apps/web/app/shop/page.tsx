import { Badge, Button, Card, Container } from "@crewmate/ui";

interface ShopProduct {
  id: string;
  badge: string;
  icon: string;
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
    icon: "🥉",
    name: "VIP",
    price: "4,99€",
    priceNote: "per sempre",
    features: ["Prefix [VIP] in chat", "2 home extra", "Accesso a /kit vip"],
  },
  {
    id: "mvp",
    badge: "Popolare",
    icon: "🥈",
    name: "MVP",
    price: "9,99€",
    priceNote: "per sempre",
    features: ["Tutti i vantaggi VIP", "Prefix [MVP] colorato", "5 home extra", "Effetti particellari"],
    featured: true,
  },
  {
    id: "elite",
    badge: "Rank",
    icon: "🥇",
    name: "ELITE",
    price: "19,99€",
    priceNote: "per sempre",
    features: ["Tutti i vantaggi MVP", "Prefix [ELITE] animato", "Home illimitate", "Accesso prioritario"],
  },
  {
    id: "kit-guerriero",
    badge: "Kit",
    icon: "⚔️",
    name: "Kit Guerriero",
    price: "2,99€",
    priceNote: "una tantum",
    features: ["Armatura in diamante", "Spada incantata", "Pozioni assortite"],
  },
  {
    id: "kit-minatore",
    badge: "Kit",
    icon: "⛏️",
    name: "Kit Minatore",
    price: "2,99€",
    priceNote: "una tantum",
    features: ["Piccone Fortuna III", "Set completo di picconi", "Torce e cibo"],
  },
  {
    id: "particelle",
    badge: "Cosmetico",
    icon: "✨",
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
        <h1 className="font-title text-xl text-text">🛒 Shop</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">
          Supporta il server e sblocca ranghi, kit e vantaggi esclusivi. Ogni acquisto ci aiuta a tenere
          il server online!
        </p>
      </div>

      <div className="grid gap-6 pb-8 sm:grid-cols-2 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card
            key={product.id}
            icon={product.icon}
            className={product.featured ? "border-accent" : undefined}
          >
            <Badge tone={product.featured ? "green" : "warning"}>{product.badge}</Badge>
            <h3 className="mt-3 font-title text-sm text-text">{product.name}</h3>
            <p className="mt-2 text-lg text-accent">
              {product.price} <span className="text-sm text-text-muted">/ {product.priceNote}</span>
            </p>
            <ul className="my-4 flex flex-col gap-1 text-sm text-text-muted">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button variant={product.featured ? "primary" : "outline"} className="w-full">
              Acquista
            </Button>
          </Card>
        ))}
      </div>

      <p className="pb-16 text-center text-sm text-text-dim">
        💡 Il carrello e i pagamenti reali arrivano nella Fase 5/10 della roadmap — questa è ancora una
        vetrina statica dei prodotti.
      </p>
    </Container>
  );
}
