"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { isAdminUser } from "@/lib/auth-utils";
import { productService } from "../product.service";
import type { AdminProductQuery } from "../types";

export const PENDING_PRODUCTS_QUERY_KEY = (query?: AdminProductQuery) =>
  ["products", "admin", query] as const;

export function usePendingProducts(query?: AdminProductQuery) {
  const { user } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: PENDING_PRODUCTS_QUERY_KEY(query),
    queryFn: () => productService.getPendingProducts(query, token),
    enabled: isAdminUser(user),
    placeholderData: keepPreviousData,
  });
}
