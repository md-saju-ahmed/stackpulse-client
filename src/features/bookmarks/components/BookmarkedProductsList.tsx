"use client";
import { BookmarkIcon } from "lucide-react";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/features/products/components/ProductGrid";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { useMyBookmarks } from "../hooks/useMyBookmarks";
import type { BookmarkQuery } from "../types";

type BookmarkedProductsListProps = {
  query: BookmarkQuery;
  onPageChange: (page: number) => void;
};

export function BookmarkedProductsList({
  query,
  onPageChange,
}: BookmarkedProductsListProps) {
  const { data, isLoading, isError } = useMyBookmarks(query);

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  const products = data?.data ?? [];

  if (isError || products.length === 0) {
    return (
      <EmptyState
        icon={<BookmarkIcon className="size-8" />}
        title="No bookmarks yet"
        description="Save tools you like and they'll show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProductGrid products={products} />
      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={onPageChange} />
      )}
    </div>
  );
}
