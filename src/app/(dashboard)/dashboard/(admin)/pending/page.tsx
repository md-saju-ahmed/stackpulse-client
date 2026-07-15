"use client";
import { useState } from "react";
import { PackageSearchIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { usePendingProducts } from "@/features/products/hooks/usePendingProducts";
import { useMyProducts } from "@/features/dashboard/hooks/useMyProducts";
import { useApproveProduct } from "@/features/products/hooks/useApproveProduct";
import { useRejectProduct } from "@/features/products/hooks/useRejectProduct";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { useResubmitProduct } from "@/features/products/hooks/useResubmitProduct";
import {
  PendingProductCard,
  PendingProductCardSkeleton,
} from "@/features/products/components/PendingProductCard";
import {
  MyProductsTable,
  MyProductsTableSkeleton,
} from "@/features/products/components/MyProductsTable";
import type { Product, ProductStatus } from "@/features/products/types";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";

const PAGE_LIMIT = 10;

// Filter
type AllFilter = { label: "All Products"; value: "ALL" };
type AdminFilter = { label: string; value: ProductStatus };
type MyFilter = { label: "My Products"; value: "MY_PRODUCTS" };
type Filter = AllFilter | AdminFilter | MyFilter;

const FILTERS: Filter[] = [
  { label: "All Products", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "PUBLISHED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "My Products", value: "MY_PRODUCTS" },
];

// Confirm dialog
type ModerationAction = {
  product: Product;
  kind: "approve" | "reject" | "delete" | "resubmit";
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter["value"]>("PENDING");
  const [action, setAction] = useState<ModerationAction | null>(null);

  const isMyProducts = filter === "MY_PRODUCTS";
  const adminStatus =
    isMyProducts || filter === "ALL" ? undefined : (filter as ProductStatus);

  // Admin products (Pending / Approved / Rejected)
  const adminQuery = usePendingProducts(
    !isMyProducts
      ? { page, limit: PAGE_LIMIT, status: adminStatus }
      : undefined,
  );

  // My Products (dashboard endpoint)
  const myQuery = useMyProducts(
    isMyProducts ? { page, limit: PAGE_LIMIT } : undefined,
  );

  const { data, isLoading, isError } = isMyProducts ? myQuery : adminQuery;

  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const deleteProduct = useDeleteProduct();
  const resubmitProduct = useResubmitProduct();

  const products = data?.data ?? [];
  const meta = data?.meta;

  const isMutating =
    approveProduct.isPending ||
    rejectProduct.isPending ||
    deleteProduct.isPending ||
    resubmitProduct.isPending;

  async function handleConfirm() {
    if (!action) return;

    try {
      if (action.kind === "approve") {
        await approveProduct.mutateAsync(action.product.slug);
        toast.success(`"${action.product.name}" approved`);
      } else if (action.kind === "reject") {
        await rejectProduct.mutateAsync(action.product.slug);
        toast.success(`"${action.product.name}" rejected`);
      } else if (action.kind === "resubmit") {
        await resubmitProduct.mutateAsync(action.product.slug);
        toast.success(`"${action.product.name}" resubmitted for review`);
      } else {
        await deleteProduct.mutateAsync(action.product.slug);
        toast.success(`"${action.product.name}" deleted`);
      }
      setAction(null);
    } catch (error) {
      toast.error(
        errorMessage(error, "Something went wrong. Please try again."),
      );
    }
  }

  function changeFilter(value: Filter["value"]) {
    setFilter(value);
    setPage(1);
  }

  const confirmTitle = action
    ? action.kind === "approve"
      ? `Approve "${action.product.name}"?`
      : action.kind === "reject"
        ? `Reject "${action.product.name}"?`
        : action.kind === "resubmit"
          ? `Resubmit "${action.product.name}"?`
          : `Delete "${action.product.name}"?`
    : "";

  const confirmDescription = action
    ? action.kind === "approve"
      ? "This tool will become publicly visible in Products."
      : action.kind === "reject"
        ? "This tool will be marked rejected and won't appear publicly."
        : action.kind === "resubmit"
          ? "This will send the tool back for admin review."
          : "This can't be undone. The tool, its reviews, and bookmarks will no longer be accessible."
    : undefined;

  const confirmLabel = action
    ? action.kind === "approve"
      ? "Approve"
      : action.kind === "reject"
        ? "Reject"
        : action.kind === "resubmit"
          ? "Resubmit"
          : "Delete"
    : "Confirm";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          Review submissions, browse approved and rejected tools, or manage your
          own products.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            id={`admin-products-filter-${f.value.toLowerCase()}`}
            type="button"
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => changeFilter(f.value)}
            className={cn(filter === f.value && "pointer-events-none")}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Product list */}
      {isLoading ? (
        isMyProducts ? (
          <MyProductsTableSkeleton count={PAGE_LIMIT} />
        ) : (
          <PendingProductCardSkeleton count={PAGE_LIMIT} />
        )
      ) : isError ? (
        <EmptyState
          title="Couldn't load products"
          description="Something went wrong fetching this list. Please try again."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<PackageSearchIcon className="size-8" />}
          title={
            filter === "PENDING"
              ? "Nothing to review"
              : filter === "MY_PRODUCTS"
                ? "No products yet"
                : filter === "ALL"
                  ? "No products yet"
                  : "No products here yet"
          }
          description={
            filter === "PENDING"
              ? "New submissions will show up here."
              : filter === "MY_PRODUCTS"
                ? "Submit your first tool to see it here."
                : filter === "ALL"
                  ? "Submitted tools will show up here in any status."
                  : "Products will show up here once they're in this state."
          }
          action={
            filter === "MY_PRODUCTS" ? (
              <Link href="/products/submit">
                <Button id="admin-my-products-submit">Submit a tool</Button>
              </Link>
            ) : undefined
          }
        />
      ) : isMyProducts ? (
        /* My Products view: editable table with delete/resubmit */
        <MyProductsTable
          products={products}
          onDelete={(product) => setAction({ product, kind: "delete" })}
          onResubmit={(product) => setAction({ product, kind: "resubmit" })}
        />
      ) : (
        /* Admin moderation view: approve / reject */
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <PendingProductCard
              key={product._id}
              product={product}
              onApprove={() => setAction({ product, kind: "approve" })}
              onReject={() => setAction({ product, kind: "reject" })}
              isApproving={
                approveProduct.isPending &&
                action?.product.slug === product.slug &&
                action.kind === "approve"
              }
              isRejecting={
                rejectProduct.isPending &&
                action?.product.slug === product.slug &&
                action.kind === "reject"
              }
            />
          ))}
        </div>
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      <ConfirmDialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        isLoading={isMutating}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
