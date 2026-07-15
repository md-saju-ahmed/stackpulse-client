"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productService } from "../product.service";
import type { ProductQuery } from "../types";

export const PRODUCTS_LIST_QUERY_KEY = (query?: ProductQuery) =>
  ["products", "list", query] as const;

export function useProducts(query?: ProductQuery) {
  return useQuery({
    queryKey: PRODUCTS_LIST_QUERY_KEY(query),
    queryFn: () => productService.getProducts(query),
    placeholderData: keepPreviousData,
  });
}
