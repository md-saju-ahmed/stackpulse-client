"use client";

import Link from "next/link";
import { useCategories } from "@/features/categories/hooks/useCategories";
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon } from "../utils/getCategoryIcon";
import { Reveal } from "@/components/motion/Reveal";

export function BrowseCategories() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 5,
    sort: "productCount",
    order: "desc",
  });
  const categories = categoriesData?.data ?? [];

  return (
    <section className="bg-muted/5 py-20 md:py-24 border-t border-border/30">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal className="mb-12 md:mb-14">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold">
              Browse by Category
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Jump straight to the tools built for the job you&apos;re doing
              right now.
            </p>
          </Reveal>

          {categoriesLoading ? (
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm max-w-md mx-auto">
              No categories found.
            </div>
          ) : (
            <Reveal className="flex flex-wrap justify-center gap-8 md:gap-12">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-white border border-slate-150/60 rounded-xl shadow-premium-sm flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 group-hover:shadow-premium-md group-hover:-translate-y-1 transition-all duration-300">
                      <IconComponent className="size-8 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </p>
                  </Link>
                );
              })}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
