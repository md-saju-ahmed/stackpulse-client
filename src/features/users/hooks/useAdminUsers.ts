"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { isAdminUser } from "@/lib/auth-utils";
import { userService } from "../user.service";
import type { AdminUserQuery } from "../types";

export const ADMIN_USERS_QUERY_KEY = (query?: AdminUserQuery) =>
  ["users", "admin", query] as const;

export function useAdminUsers(query?: AdminUserQuery) {
  const { user } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY(query),
    queryFn: () => userService.listUsers(query, token),
    enabled: isAdminUser(user),
    placeholderData: keepPreviousData,
  });
}
