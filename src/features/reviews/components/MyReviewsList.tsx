"use client";
import { MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDashboardReviews } from "@/features/dashboard/hooks/useMyDashboardReviews";
import { ReviewCard } from "./ReviewCard";
import type { DashboardListQuery } from "@/features/dashboard/types";

type MyReviewsListProps = {
  query: DashboardListQuery;
  onPageChange: (page: number) => void;
};

export function MyReviewsList({ query, onPageChange }: MyReviewsListProps) {
  const { data, isLoading, isError } = useMyDashboardReviews(query);

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
        description="Reviews you write on tools will show up here."
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
