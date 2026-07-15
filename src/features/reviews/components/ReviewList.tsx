"use client";
import { MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductReviews } from "../hooks/useProductReviews";
import { ReviewCard } from "./ReviewCard";
import type { ReviewQuery } from "../types";

type ReviewListProps = {
  productSlug: string;
  query: ReviewQuery;
  onPageChange: (page: number) => void;
};

export function ReviewList({
  productSlug,
  query,
  onPageChange,
}: ReviewListProps) {
  const { data, isLoading, isError } = useProductReviews(productSlug, query);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const reviews = data?.data ?? [];

  if (isError || reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareIcon className="size-8" />}
        title="No reviews yet"
        description="Be the first to share your thoughts on this tool."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={onPageChange} />
      )}
    </div>
  );
}
