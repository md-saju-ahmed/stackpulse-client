"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { dashboardService } from "../dashboard.service";

export const ADMIN_OVERVIEW_QUERY_KEY = [
  "dashboard",
  "admin-overview",
] as const;

export function useAdminOverview() {
  const { user } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: ADMIN_OVERVIEW_QUERY_KEY,
    queryFn: () => {
      if (!token) {
        throw new Error("You must be signed in to view platform stats.");
      }
      return dashboardService.getAdminOverview(token);
    },
    enabled: user?.role === "admin" && !!token,
    staleTime: 30 * 1000,
  });
}
