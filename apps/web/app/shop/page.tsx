import { Award, Check, Info, Package, Sparkles, Sword, type LucideIcon } from "lucide-react";
import { Badge, Card, Container } from "@crewmate/ui";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getShopContent } from "@/lib/shop-content";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  ranghi: Award,
  kit: Sword,
  cosmetici: Sparkles,
};

export default async function ShopPage() {
  const { categories, products } = await getShopContent();
  const categoryById = new Map(categories.map((category) => [category.id, category]));

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
        {products.map((product) => {
          const category = product.category_id ? categoryById.get(product.category_id) : undefined;
          const Icon = (category && CATEGORY_ICONS[category.slug]) || Package;
          const features = [...product.product_features].sort((a, b) => a.order - b.order);

          return (
            <Card
              key={product.id}
              interactive
              icon={<Icon />}
              className={product.featured ? "border-accent/50" : undefined}
            >
              <Badge tone={product.featured ? "accent" : "neutral"}>
                {product.featured ? "Popolare" : (category?.name ?? "Prodotto")}
              </Badge>
              <h3 className="mt-3 text-base font-semibold text-text">{product.name}</h3>
              <p className="mt-1 text-text-dim">{product.description}</p>
              <p className="mt-2 text-xl font-semibold text-text">
                {product.price.toFixed(2)}€ <span className="text-sm font-normal text-text-muted">/ acquisto</span>
              </p>
              <ul className="my-5 flex flex-col gap-2 text-sm text-text-muted">
                {features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-success" aria-hidden />
                    {f.text}
                  </li>
                ))}
              </ul>
              <AddToCartButton
                productId={product.id}
                name={product.name}
                unitPrice={product.price}
                variant={product.featured ? "primary" : "secondary"}
                className="w-full"
              />
            </Card>
          );
        })}
      </div>

      <p className="flex items-center justify-center gap-2 pb-16 text-center text-sm text-text-dim">
        <Info className="size-4 shrink-0" aria-hidden />
        I pagamenti reali arrivano nella Fase 10 della roadmap — per ora l&apos;ordine viene confermato
        automaticamente per testare l&apos;intera pipeline.
      </p>
    </Container>
  );
}
