"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button, type ButtonProps } from "@crewmate/ui";
import { useCart } from "@/lib/cart-context";

export interface AddToCartButtonProps extends Pick<ButtonProps, "variant" | "className"> {
  productId: string;
  name: string;
  unitPrice: number;
}

export function AddToCartButton({ productId, name, unitPrice, variant, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ productId, name, unitPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleClick}
      icon={
        added ? (
          <Check className="size-4 text-success" aria-hidden />
        ) : (
          <ShoppingCart className="size-4" aria-hidden />
        )
      }
    >
      {added ? "Aggiunto" : "Acquista"}
    </Button>
  );
}
