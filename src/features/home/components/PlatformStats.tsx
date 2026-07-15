"use client";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/Reveal";

export function PlatformStats() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 4,
    sort: "createdAt",
    order: "desc",
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 1,
  });

  const isLoading = productsLoading || categoriesLoading;

  const totalProducts = productsData?.meta?.total;
  const totalCategories = categoriesData?.meta?.total;
  const trendingReviewCount = (productsData?.data ?? []).reduce(
    (sum, product) => sum + (product.reviewCount ?? 0),
    0,
  );

  return (
    <section className="bg-slate-50/40 py-12 md:py-16 border-y border-slate-100 backdrop-blur-xs">
      <Container>
        <Reveal>
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-10">
            StackPulse by the numbers — pulled live, not padded
          </p>
          <div className="flex flex-wrap justify-around gap-8 text-center max-w-4xl mx-auto">
            <div className="group">
              {isLoading ? (
                <Skeleton className="h-9 w-20 mx-auto mb-1.5" />
              ) : (
                <p className="font-heading text-3xl md:text-4xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5">
                  {totalProducts !== undefined
                    ? totalProducts.toLocaleString()
                    : "—"}
                </p>
              )}
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Tools Indexed
              </p>
            </div>
            <div className="group">
              {isLoading ? (
                <Skeleton className="h-9 w-20 mx-auto mb-1.5" />
              ) : (
                <p className="font-heading text-3xl md:text-4xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5">
                  {totalCategories !== undefined
                    ? totalCategories.toLocaleString()
                    : "—"}
                </p>
              )}
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Categories
              </p>
            </div>
            <div className="group">
              {isLoading ? (
                <Skeleton className="h-9 w-20 mx-auto mb-1.5" />
              ) : (
                <p className="font-heading text-3xl md:text-4xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5">
                  {trendingReviewCount.toLocaleString()}
                </p>
              )}
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Reviews on Trending Tools
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
