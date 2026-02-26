import { Suspense } from "react";
import { db } from "@/lib/db";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuFilter } from "@/components/menu/menu-filter";

export const revalidate = 60;

async function getMenuItems(searchParams: {
  category?: string;
  search?: string;
  sort?: string;
  vegetarian?: string;
}) {
  const where: any = { inStock: true };

  if (searchParams.category) {
    const category = await db.category.findUnique({
      where: { slug: searchParams.category },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy.price = "asc";
  } else if (searchParams.sort === "price-desc") {
    orderBy.price = "desc";
  } else if (searchParams.sort === "name") {
    orderBy.name = "asc";
  }

  return await db.menuItem.findMany({
    where,
    include: { category: true },
    orderBy,
  });
}

async function getCategories() {
  return await db.category.findMany({
    orderBy: { name: "asc" },
  });
}

async function MenuItems({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string; vegetarian?: string };
}) {
  const [items, categories] = await Promise.all([
    getMenuItems(searchParams),
    getCategories(),
  ]);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <MenuFilter categories={categories} />
        </aside>
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Menu</h1>
            <p className="text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItemsSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <Skeleton className="h-64 w-full" />
        </aside>
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string; vegetarian?: string };
}) {
  return (
    <Suspense fallback={<MenuItemsSkeleton />}>
      <MenuItems searchParams={searchParams} />
    </Suspense>
  );
}
