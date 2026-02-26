import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { ChefHat, Clock, Shield, Truck } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

async function getFeaturedItems() {
  return await db.menuItem.findMany({
    where: { featured: true, inStock: true },
    include: { category: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return await db.category.findMany({
    include: {
      menuItems: {
        where: { inStock: true },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [featuredItems, categories] = await Promise.all([
    getFeaturedItems(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Delicious Food,
            <br />
            <span className="text-primary">Delivered to You</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Order from our extensive menu and enjoy fresh, delicious meals delivered
            right to your doorstep. Fast, reliable, and always satisfying.
          </p>
          <div className="flex gap-4 mt-6">
            <Button asChild size="lg">
              <Link href="/menu">Browse Menu</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/search">Search</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fast Delivery</CardTitle>
              <CardDescription>
                Get your food delivered in 30-45 minutes
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Payment</CardTitle>
              <CardDescription>
                Safe and secure payment processing
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ChefHat className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fresh Ingredients</CardTitle>
              <CardDescription>
                Made with the finest ingredients daily
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>24/7 Service</CardTitle>
              <CardDescription>
                Order anytime, anywhere
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-12 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Browse by Category</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/menu?category=${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="container py-12 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Items</h2>
            <Button asChild variant="outline">
              <Link href="/menu">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
