"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/carrello"
      className="relative flex size-10 items-center justify-center rounded-sm text-text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-text"
      aria-label={`Carrello (${count} articoli)`}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-bg-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
