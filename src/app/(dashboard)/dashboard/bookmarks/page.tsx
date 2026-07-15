"use client";
import { useState } from "react";
import { BookmarkedProductsList } from "@/features/bookmarks/components/BookmarkedProductsList";

const PAGE_LIMIT = 12;

export default function MyBookmarksPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My bookmarks</h1>
        <p className="text-sm text-muted-foreground">
          Tools you&apos;ve saved for later.
        </p>
      </div>

      <BookmarkedProductsList
        query={{ page, limit: PAGE_LIMIT }}
        onPageChange={setPage}
      />
    </div>
  );
}
