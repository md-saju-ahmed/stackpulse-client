"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { dashboardService } from "../dashboard.service";
import type { Product } from "@/features/products/types";

export const OWNED_PRODUCT_QUERY_KEY = (slug: string) =>
  ["dashboard", "products", "by-slug", slug] as const;

export function useOwnedProductBySlug(slug: string) {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: OWNED_PRODUCT_QUERY_KEY(slug),
    queryFn: async (): Promise<Product> => {
      const { data } = await dashboardService.getOwnedProductBySlug(
        slug,
        token,
      );
      return data;
    },
    enabled: isAuthenticated && slug.length > 0,
  });
}
