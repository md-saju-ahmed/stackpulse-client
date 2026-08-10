"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { userService } from "../user.service";

export const ME_QUERY_KEY = ["users", "me"] as const;

export function useMe() {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: () => userService.getMe(token),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}
