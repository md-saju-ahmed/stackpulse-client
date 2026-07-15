import Link from "next/link";
import {
  ExternalLinkIcon,
  PencilIcon,
  RefreshCwIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import type { Product } from "../types";

type MyProductsTableProps = {
  products: Product[];
  onDelete: (product: Product) => void;
  onResubmit: (product: Product) => void;
};

export function MyProductsTable({
  products,
  onDelete,
  onResubmit,
}: MyProductsTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <Card key={product._id}>
          <CardHeader className="flex-row items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.logo}
              alt=""
              className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-heading text-sm font-medium">
                  {product.name}
                </p>
                <StatusBadge status={product.status} />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {product.tagline}
              </p>
              {product.status === "REJECTED" && (
                <p className="mt-1 text-xs text-destructive">
                  This product was rejected. You can resubmit it for another
                  review.
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <StarIcon className="size-3.5 fill-current" />
                {product.averageRating.toFixed(1)} ({product.reviewCount})
              </span>
              <span>{product.bookmarkCount} bookmarks</span>
              <span>{product.viewCount} views</span>
            </div>
            <div className="flex items-center gap-2">
              {product.status === "PUBLISHED" && (
                <Link href={`/products/${product.slug}`}>
                  <Button
                    id={`my-product-view-${product.slug}`}
                    variant="ghost"
                    size="sm"
                  >
                    <ExternalLinkIcon />
                    View
                  </Button>
                </Link>
              )}
              {product.status === "REJECTED" && (
                <Button
                  id={`my-product-resubmit-${product.slug}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onResubmit(product)}
                >
                  <RefreshCwIcon />
                  Resubmit
                </Button>
              )}
              <Link href={`/dashboard/products/${product.slug}/edit`}>
                <Button
                  id={`my-product-edit-${product.slug}`}
                  variant="outline"
                  size="sm"
                >
                  <PencilIcon />
                  Edit
                </Button>
              </Link>
              <Button
                id={`my-product-delete-${product.slug}`}
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product)}
              >
                <TrashIcon />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type MyProductsTableSkeletonProps = {
  count?: number;
};

export function MyProductsTableSkeleton({
  count = 4,
}: MyProductsTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
