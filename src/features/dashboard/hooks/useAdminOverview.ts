"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { isAdminUser } from "@/lib/auth-utils";
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
    queryFn: () => dashboardService.getAdminOverview(token),
    enabled: isAdminUser(user),
    staleTime: 30 * 1000,
  });
}
