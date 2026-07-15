"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reviewService } from "../review.service";
import type { ReviewQuery } from "../types";

export const REVIEWS_LIST_QUERY_KEY = (
  productSlug: string,
  query?: ReviewQuery,
) => ["reviews", productSlug, "list", query] as const;

export function useProductReviews(productSlug: string, query?: ReviewQuery) {
  return useQuery({
    queryKey: REVIEWS_LIST_QUERY_KEY(productSlug, query),
    queryFn: () => reviewService.getProductReviews(productSlug, query),
    enabled: !!productSlug,
    placeholderData: keepPreviousData,
  });
}
