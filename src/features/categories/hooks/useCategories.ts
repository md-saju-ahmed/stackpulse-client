"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoryService } from "../category.service";
import type { CategoryQuery } from "../types";

export const CATEGORIES_LIST_QUERY_KEY = (query?: CategoryQuery) =>
  ["categories", "list", query] as const;

export function useCategories(query?: CategoryQuery) {
  return useQuery({
    queryKey: CATEGORIES_LIST_QUERY_KEY(query),
    queryFn: () => categoryService.getCategories(query),
    placeholderData: keepPreviousData,
  });
}
