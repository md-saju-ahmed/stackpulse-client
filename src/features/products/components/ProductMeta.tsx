import { ExternalLinkIcon, BookOpenIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product, ProductPricing } from "../types";

const PRICING_LABELS: Record<ProductPricing, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  OPEN_SOURCE: "Open Source",
};

type ProductMetaProps = {
  product: Product;
};

export function ProductMeta({ product }: ProductMetaProps) {
  return (
    <div className="bg-card/40 dark:bg-zinc-900/40 border border-border/50 rounded-xl p-6 space-y-6">
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Pricing &amp; Category
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs rounded-lg font-medium"
          >
            {PRICING_LABELS[product.pricing]}
          </Badge>
          <Badge
            variant="outline"
            className="px-3 py-1 text-xs rounded-lg font-medium border-border/60"
          >
            {product.category}
          </Badge>
        </div>
      </div>

      {product.tags.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Tags
          </h4>
          <div className="flex flex-wrap items-center gap-1.5">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                variant="ghost"
                className="px-2 py-0.5 text-xs rounded-lg bg-muted/50 dark:bg-zinc-800/50 hover:bg-muted dark:hover:bg-zinc-800 text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border/40 space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Links
        </h4>

        <a
          id="product-visit-website"
          href={product.website}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs",
          )}
        >
          <ExternalLinkIcon className="size-4" />
          Visit Website
        </a>

        {product.github && (
          <a
            id="product-visit-github"
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold",
            )}
          >
            <FaGithub className="size-4" />
            GitHub Repository
          </a>
        )}

        {product.documentation && (
          <a
            id="product-visit-docs"
            href={product.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold",
            )}
          >
            <BookOpenIcon className="size-4" />
            Documentation
          </a>
        )}
      </div>
    </div>
  );
}
