"use client";
import { useState } from "react";
import Link from "next/link";
import { PackageSearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdminUser } from "@/lib/auth-utils";
import { useMyProducts } from "@/features/dashboard/hooks/useMyProducts";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { useResubmitProduct } from "@/features/products/hooks/useResubmitProduct";
import {
  MyProductsTable,
  MyProductsTableSkeleton,
} from "@/features/products/components/MyProductsTable";
import type { Product } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ApiError } from "@/lib/api";

const PAGE_LIMIT = 10;

export default function MyProductsPage() {
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { user } = useAuth();
  const { data, isLoading, isError } = useMyProducts({
    page,
    limit: PAGE_LIMIT,
  });
  const deleteProduct = useDeleteProduct();
  const resubmitProduct = useResubmitProduct();

  const products = data?.data ?? [];
  const meta = data?.meta;
  const canSubmit =
    user?.accountStatus === "APPROVED" || isAdminUser(user);
  const submitBlockReason =
    user?.accountStatus === "PENDING"
      ? "Your account is pending approval"
      : user?.accountStatus === "SUSPENDED"
        ? "Your account has been suspended"
        : undefined;

  async function handleConfirmDelete() {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.slug);
      toast.success(`"${productToDelete.name}" was deleted`);
      setProductToDelete(null);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to delete tool";
      toast.error(message);
    }
  }

  async function handleResubmit(product: Product) {
    try {
      await resubmitProduct.mutateAsync(product.slug);
      toast.success(`"${product.name}" resubmitted for review`);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to resubmit tool";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">My products</h1>
          <p className="text-sm text-muted-foreground">
            Everything you&apos;ve submitted, including tools pending review.
          </p>
        </div>
        {canSubmit ? (
          <Link href="/products/submit">
            <Button id="my-products-submit">Submit a tool</Button>
          </Link>
        ) : (
          <Button id="my-products-submit" disabled title={submitBlockReason}>
            Submit a tool
          </Button>
        )}
      </div>

      {isLoading ? (
        <MyProductsTableSkeleton count={PAGE_LIMIT} />
      ) : isError ? (
        <EmptyState
          title="Couldn't load your products"
          description="Something went wrong fetching your products. Please try again."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<PackageSearchIcon className="size-8" />}
          title="No products yet"
          description="Submit your first tool to see it here."
          action={
            canSubmit ? (
              <Link href="/products/submit">
                <Button id="my-products-empty-submit">Submit a tool</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <MyProductsTable
          products={products}
          onDelete={(product) => setProductToDelete(product)}
          onResubmit={handleResubmit}
        />
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      <ConfirmDialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
        title={`Delete "${productToDelete?.name ?? ""}"?`}
        description="This can't be undone. The tool, its reviews, and its bookmarks will no longer be accessible."
        confirmLabel="Delete"
        isLoading={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
