import { CheckIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "../types";

type PendingProductCardProps = {
  product: Product;
  onApprove: () => void;
  onReject: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
};

export function PendingProductCard({
  product,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: PendingProductCardProps) {
  const isBusy = isApproving || isRejecting;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.logo}
          alt=""
          className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-medium">
            {product.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {product.tagline}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{product.pricing}</Badge>
          <Badge variant="outline">{product.category}</Badge>
          {product.status !== "PENDING" && (
            <Badge
              variant={
                product.status === "PUBLISHED" ? "default" : "destructive"
              }
            >
              {product.status === "PUBLISHED" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
        {product.status === "PENDING" && (
          <div className="flex items-center gap-2">
            <Button
              id={`pending-product-reject-${product.slug}`}
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={onReject}
            >
              <XIcon />
              {isRejecting ? "Rejecting…" : "Reject"}
            </Button>
            <Button
              id={`pending-product-approve-${product.slug}`}
              variant="default"
              size="sm"
              disabled={isBusy}
              onClick={onApprove}
            >
              <CheckIcon />
              {isApproving ? "Approving…" : "Approve"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type PendingProductCardSkeletonProps = {
  count?: number;
};

export function PendingProductCardSkeleton({
  count = 4,
}: PendingProductCardSkeletonProps) {
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
