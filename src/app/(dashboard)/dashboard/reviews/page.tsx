"use client";
import { useState } from "react";
import { MyReviewsList } from "@/features/reviews/components/MyReviewsList";

const PAGE_LIMIT = 10;

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My reviews</h1>
        <p className="text-sm text-muted-foreground">
          Reviews you&apos;ve written across all tools.
        </p>
      </div>

      <MyReviewsList
        query={{ page, limit: PAGE_LIMIT }}
        onPageChange={setPage}
      />
    </div>
  );
}
