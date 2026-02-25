"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@prisma/client";

interface AddToCartButtonProps {
  item: MenuItem & { category: Category };
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        menuItemId: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image || undefined,
      });
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${item.name}${quantity > 1 ? "s" : ""} added to your cart.`,
    });
    setQuantity(1);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={handleAddToCart} size="lg" className="flex-1">
        <Plus className="h-5 w-5 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
