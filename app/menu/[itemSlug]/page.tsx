import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { Plus } from "lucide-react";

export const revalidate = 60;

async function getMenuItem(slug: string) {
  return await db.menuItem.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export default async function MenuItemPage({
  params,
}: {
  params: { itemSlug: string };
}) {
  const item = await getMenuItem(params.itemSlug);

  if (!item) {
    notFound();
  }

  const variants = item.variants as
    | Array<{ name: string; options: Array<{ name: string; price: number }> }>
    | null;

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {item.category.name}
            </p>
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-6">
              {formatPrice(item.price)}
            </p>
            {item.description && (
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {variants && variants.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Customize</h3>
                <div className="space-y-4">
                  {variants.map((variant, idx) => (
                    <div key={idx}>
                      <label className="text-sm font-medium mb-2 block">
                        {variant.name}
                      </label>
                      <div className="space-y-2">
                        {variant.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span className="text-sm">{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm font-medium">
                                +{formatPrice(option.price)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  );
}
