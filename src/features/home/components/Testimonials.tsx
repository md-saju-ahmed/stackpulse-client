"use client";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useProductReviews } from "@/features/reviews/hooks/useProductReviews";
import { useUser } from "@/features/users/hooks/useUser";
import { StarRating } from "@/components/StarRating";
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/features/products/types";
import type { Review } from "@/features/reviews/types";
import type { UserProfile } from "@/features/users/types";

function useTopReviewFor(product: Product | undefined) {
  const { data: reviewsData, isLoading: reviewLoading } = useProductReviews(
    product?.slug ?? "",
    { page: 1, limit: 1, sort: "rating", order: "desc" },
  );
  const review = reviewsData?.data?.[0];

  const { data: userData, isLoading: userLoading } = useUser(
    review?.userId ?? "",
  );

  return {
    product,
    review,
    user: userData?.data,
    isLoading: !!product && (reviewLoading || (!!review && userLoading)),
  };
}

function TestimonialCard({
  product,
  review,
  user,
}: {
  product: Product;
  review: Review;
  user: UserProfile | undefined;
}) {
  const displayName = user?.name || "Anonymous User";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : review.userId.slice(0, 2).toUpperCase();
  const avatarUrl = user?.image;

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl border border-slate-150/60 hover:border-primary/20 hover:shadow-premium-md hover:-translate-y-0.5 hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-premium-sm">
      <div>
        <StarRating
          value={review.rating}
          readOnly
          size="sm"
          className="mb-4 text-primary"
        />
        <p className="text-sm italic text-slate-700 mb-8 leading-relaxed font-medium/90">
          &ldquo;{review.body}&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-4 mt-auto">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100/80 border border-slate-200/60 shadow-sm"
            src={avatarUrl}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div
            aria-hidden
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-xs font-bold text-slate-750 shadow-sm ring-2 ring-slate-100/80"
          >
            {initials}
          </div>
        )}
        <div>
          <p className="text-xs font-bold text-slate-900">{displayName}</p>
          <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold">
            on {product.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 3,
    sort: "averageRating",
    order: "desc",
  });
  const products = productsData?.data ?? [];

  const slot0 = useTopReviewFor(products[0]);
  const slot1 = useTopReviewFor(products[1]);
  const slot2 = useTopReviewFor(products[2]);
  const slots = [slot0, slot1, slot2];

  const isLoading = productsLoading || slots.some((slot) => slot.isLoading);

  const cards = slots.filter(
    (slot): slot is typeof slot & { product: Product; review: Review } =>
      !!slot.product && !!slot.review,
  );

  if (!isLoading && cards.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal className="mb-12 md:mb-14 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold">
            Loved by Developers
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Real ratings and quotes pulled straight from verified product
            reviews — not marketing copy.
          </p>
        </Reveal>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-border/40 bg-card/40 p-8 space-y-4"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex items-center gap-4 pt-6">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map(({ product, review, user }) => (
              <TestimonialCard
                key={product._id}
                product={product}
                review={review}
                user={user}
              />
            ))}
          </Reveal>
        )}
      </Container>
    </section>
  );
}
