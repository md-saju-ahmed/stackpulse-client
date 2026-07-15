"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { dashboardService } from "../dashboard.service";

export const DASHBOARD_OVERVIEW_QUERY_KEY = ["dashboard", "overview"] as const;

export function useDashboardOverview() {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: () => {
      if (!token) {
        throw new Error("You must be signed in to view your dashboard.");
      }
      return dashboardService.getOverview(token);
    },
    enabled: isAuthenticated && !!token,
    staleTime: 30 * 1000,
  });
}
