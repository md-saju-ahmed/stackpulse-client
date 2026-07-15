"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/pagination";

type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { page, totalPages } = meta;

  if (totalPages <= 1) return null;

  return (
    <div
      data-slot="pagination"
      className={
        className ? className : "flex items-center justify-center gap-3"
      }
    >
      <Button
        id="pagination-prev"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        id="pagination-next"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
