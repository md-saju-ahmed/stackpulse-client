"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { dashboardService } from "../dashboard.service";
import type { DashboardListQuery } from "../types";

export const MY_DASHBOARD_REVIEWS_QUERY_KEY = (query?: DashboardListQuery) =>
  ["dashboard", "reviews", query] as const;

export function useMyDashboardReviews(query?: DashboardListQuery) {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: MY_DASHBOARD_REVIEWS_QUERY_KEY(query),
    queryFn: () => dashboardService.getReviews(query, token),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
