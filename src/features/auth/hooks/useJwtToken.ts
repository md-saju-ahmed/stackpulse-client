"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { useAuth } from "./useAuth";

export const JWT_QUERY_KEY = ["auth", "jwt"] as const;

export type UseJwtTokenReturn = {
  token: string | null;
  isLoading: boolean;
  refetch: () => void;
};

export function useJwtToken(): UseJwtTokenReturn {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: JWT_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await authClient.token();
      if (error || !data?.token) {
        throw new Error(error?.message ?? "Failed to retrieve JWT");
      }
      return data.token;
    },
    enabled: isAuthenticated,
    staleTime: 45 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    token: data ?? null,
    isLoading: isLoading && isAuthenticated,
    refetch: () => queryClient.invalidateQueries({ queryKey: JWT_QUERY_KEY }),
  };
}
