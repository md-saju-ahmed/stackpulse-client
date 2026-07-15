"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { dashboardService } from "../dashboard.service";
import type { DashboardListQuery } from "../types";

export const MY_PRODUCTS_QUERY_KEY = (query?: DashboardListQuery) =>
  ["dashboard", "products", query] as const;

export function useMyProducts(query?: DashboardListQuery) {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: MY_PRODUCTS_QUERY_KEY(query),
    queryFn: () => {
      if (!token) {
        throw new Error("You must be signed in to view your products.");
      }
      return dashboardService.getOwnedProducts(query, token);
    },
    enabled: isAuthenticated && !!token,
    placeholderData: keepPreviousData,
  });
}
