import { StarRating } from "@/components/StarRating";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import type { Product } from "../types";

type ProductHeaderProps = {
  product: Product;
};

export function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
      <div className="flex items-start sm:items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.logo}
          alt={product.name}
          className="size-20 shrink-0 rounded-xl object-cover border border-border shadow-xs bg-white dark:bg-zinc-800"
        />
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            {product.tagline}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <StarRating value={product.averageRating} readOnly size="sm" />
            <span className="font-medium text-foreground">
              {product.averageRating.toFixed(1)}
            </span>
            <span>
              ({product.reviewCount} review
              {product.reviewCount === 1 ? "" : "s"})
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0">
        <BookmarkButton
          slug={product.slug}
          className="h-11 w-11 rounded-xl border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        />
      </div>
    </div>
  );
}
