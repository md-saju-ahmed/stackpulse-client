import Link from "next/link";
import { StarIcon } from "lucide-react";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import { Button } from "@/components/ui/button";
import type { Product, ProductPricing } from "../types";

const PRICING_LABELS: Record<ProductPricing, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  OPEN_SOURCE: "Open Source",
};

const PRICING_BADGE_STYLES: Record<ProductPricing, string> = {
  FREE: "bg-secondary text-secondary-foreground border border-border",
  FREEMIUM: "bg-primary/10 text-primary border border-primary/20",
  PAID: "bg-brand-accent/15 text-brand-accent-foreground border border-brand-accent/30",
  OPEN_SOURCE: "bg-muted text-muted-foreground border border-border",
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative group flex flex-col justify-between h-full bg-white/70 dark:bg-zinc-950/40 backdrop-blur-md border border-slate-150/60 hover:border-primary/20 transition-all duration-300 shadow-premium-sm hover:shadow-premium-lg hover:-translate-y-1 rounded-xl p-6 hover:bg-white">
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 rounded-xl z-10"
      />

      <div className="relative z-0 flex flex-col h-full justify-between">
        <div>
          {/* Header row */}
          <div className="flex justify-between items-start mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.logo}
              alt={product.name}
              className="size-12 rounded-xl object-cover border border-slate-100 bg-white dark:bg-zinc-800 shadow-premium-sm group-hover:scale-105 transition-transform duration-300"
            />
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${PRICING_BADGE_STYLES[product.pricing]}`}
            >
              {PRICING_LABELS[product.pricing]}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-heading text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating meta info */}
          <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
            <StarIcon className="size-3.5 fill-current text-primary/80" />
            <span className="font-medium text-foreground">
              {product.averageRating.toFixed(1)}
            </span>
            <span>
              ({product.reviewCount} review
              {product.reviewCount === 1 ? "" : "s"})
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Action area */}
        <div className="mt-auto pt-4 flex items-center gap-2 border-t border-border/10 relative z-20">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <Button className="w-full h-11 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-premium-sm hover:shadow-premium-md hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer">
              View Details
            </Button>
          </Link>
          <BookmarkButton
            slug={product.slug}
            className="h-11 w-11 rounded-lg shrink-0 border border-border/80 hover:border-border hover:bg-muted/40 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-premium-sm bg-white/80"
          />
        </div>
      </div>
    </div>
  );
}
