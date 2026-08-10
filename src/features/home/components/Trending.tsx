"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/Reveal";

export function Trending() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 4,
    sort: "createdAt",
    order: "desc",
  });
  const products = productsData?.data ?? [];

  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal className="flex justify-between items-end mb-12 md:mb-14">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
              Trending This Week
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              The most popular frameworks and libraries among senior engineers.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group transition-all"
          >
            View All
            <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {productsLoading ? (
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
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No products found.
          </div>
        ) : (
          <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>
        )}
      </Container>
    </section>
  );
}
