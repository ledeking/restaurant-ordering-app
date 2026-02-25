"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/hooks/use-toast";
import type { MenuItem, Category } from "@prisma/client";

interface MenuItemCardProps {
  item: MenuItem & { category: Category };
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image || undefined,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/menu/${item.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader>
        <Link href={`/menu/${item.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-bold">{formatPrice(item.price)}</span>
        <Button onClick={handleAddToCart} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
