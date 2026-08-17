"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button, Card, Container, SectionTitle } from "@crewmate/ui";
import { useCart } from "@/lib/cart-context";
import { checkout } from "./actions";

export default function CartPage() {
  const { items, removeItem, total, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      await checkout(items.map((item) => ({ productId: item.productId, unitPrice: item.unitPrice, quantity: item.quantity })));
      clear();
    } catch {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="py-24 text-center">
          <SectionTitle subtitle="Aggiungi qualcosa dallo shop per iniziare.">Il tuo carrello è vuoto</SectionTitle>
          <Link href="/shop">
            <Button icon={<ShoppingBag className="size-4" aria-hidden />}>Vai allo Shop</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-16">
        <SectionTitle>Il tuo carrello</SectionTitle>
        <Card title="Riepilogo">
          <div className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-text">{item.name}</p>
                  <p className="text-sm text-text-dim">
                    {item.quantity} × {item.unitPrice.toFixed(2)}€
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-text">{(item.unitPrice * item.quantity).toFixed(2)}€</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Rimuovi ${item.name}`}
                    className="text-text-dim transition-colors hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-text-muted">Totale</span>
            <span className="text-xl font-semibold text-text">{total.toFixed(2)}€</span>
          </div>

          <Button className="mt-6 w-full" loading={loading} onClick={handleCheckout}>
            Procedi al checkout
          </Button>
          <p className="mt-3 text-center text-xs text-text-dim">
            Pagamento simulato: l&apos;ordine viene confermato subito per testare la pipeline (Fase 5).
          </p>
        </Card>
      </div>
    </Container>
  );
}
