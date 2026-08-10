"use client";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "../types";

type RelatedProductsProps = {
  category: string;
  excludeSlug: string;
};

export function RelatedProducts({
  category,
  excludeSlug,
}: RelatedProductsProps) {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 5,
    category,
    sort: "averageRating",
    order: "desc",
  });

  const related = (data?.data ?? []).filter(
    (product: Product) => product.slug !== excludeSlug,
  );

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-foreground">
        Related tools
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-border/40 bg-card/40 p-6 space-y-4"
            >
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.slice(0, 4).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
