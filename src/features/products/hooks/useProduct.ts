"use client";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../product.service";

export const PRODUCT_DETAIL_QUERY_KEY = (slug: string) =>
  ["products", "detail", slug] as const;

export function useProduct(slug: string) {
  return useQuery({
    queryKey: PRODUCT_DETAIL_QUERY_KEY(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}
