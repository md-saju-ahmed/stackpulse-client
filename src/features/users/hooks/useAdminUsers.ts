"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { userService } from "../user.service";
import type { AdminUserQuery } from "../types";

export const ADMIN_USERS_QUERY_KEY = (query?: AdminUserQuery) =>
  ["users", "admin", query] as const;

export function useAdminUsers(query?: AdminUserQuery) {
  const { user } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY(query),
    queryFn: () => {
      if (!token) {
        throw new Error("You must be signed in to view users.");
      }
      return userService.listUsers(query, token);
    },
    enabled: user?.role === "admin" && !!token,
    placeholderData: keepPreviousData,
  });
}
