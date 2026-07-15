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
    queryFn: () => {
      if (!token) {
        throw new Error("You must be signed in to view your profile.");
      }
      return userService.getMe(token);
    },
    enabled: isAuthenticated && !!token,
  });
}
