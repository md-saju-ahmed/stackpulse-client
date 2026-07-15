"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PackageXIcon } from "lucide-react";
import { useProduct } from "@/features/products/hooks/useProduct";
import { ProductHeader } from "@/features/products/components/ProductHeader";
import { ProductMeta } from "@/features/products/components/ProductMeta";
import { RelatedProducts } from "@/features/products/components/RelatedProducts";
import { MyReviewSection } from "@/features/reviews/components/MyReviewSection";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ApiError } from "@/lib/api";
import Container from "@/components/layout/Container";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const { data, isLoading, error } = useProduct(slug);
  const [reviewsPage, setReviewsPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (data?.data && data.data.slug !== slug) {
      router.replace(`/products/${data.data.slug}`);
    }
  }, [data, slug, router]);

  if (isLoading) {
    return (
      <Container className="py-10">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton className="size-20 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-1/4 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-50 w-full rounded-xl" />
      </Container>
    );
  }

  const isNotFound = error instanceof ApiError && error.status === 404;

  if (error || !data) {
    return (
      <Container className="py-10 max-w-3xl">
        <EmptyState
          icon={<PackageXIcon className="size-8 text-muted-foreground" />}
          title={isNotFound ? "Tool not found" : "Couldn't load this tool"}
          description={
            isNotFound
              ? "This tool doesn't exist or hasn't been published."
              : "Something went wrong. Please try again."
          }
        />
      </Container>
    );
  }

  const product = data.data;

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <ProductHeader product={product} />

          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-3">
              About this tool
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground bg-card/30 dark:bg-zinc-900/30 border border-border/40 rounded-xl p-6">
              {product.description}
            </p>
          </div>

          <Separator className="my-8" />

          {/* Reviews Section */}
          <section className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Reviews
            </h3>
            <div className="bg-card/30 dark:bg-zinc-900/30 border border-border/40 rounded-xl p-6">
              <MyReviewSection productSlug={slug} />
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-foreground">
              All reviews{" "}
              {product.reviewCount > 0 && `(${product.reviewCount})`}
            </h3>
            <div className="space-y-4">
              <ReviewList
                productSlug={slug}
                query={{ page: reviewsPage, limit: 10 }}
                onPageChange={setReviewsPage}
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <ProductMeta product={product} />
        </div>
      </div>

      <Separator className="my-10" />

      <RelatedProducts category={product.category} excludeSlug={product.slug} />
    </Container>
  );
}
