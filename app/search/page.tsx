import { Suspense } from "react";
import { db } from "@/lib/db";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchForm } from "@/components/search/search-form";

export const revalidate = 60;

async function searchMenuItems(query: string) {
  if (!query) {
    return [];
  }

  return await db.menuItem.findMany({
    where: {
      inStock: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    take: 20,
  });
}

async function SearchResults({ query }: { query: string }) {
  const items = await searchMenuItems(query);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && (
          <p className="text-muted-foreground">
            {items.length} result{items.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Enter a search term to find menu items
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No items found matching &quot;{query}&quot;
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <>
      <div className="border-b bg-muted/40">
        <div className="container py-8">
          <SearchForm initialQuery={query} />
        </div>
      </div>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
