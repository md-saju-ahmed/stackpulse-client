"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { reviewService } from "../review.service";

export const MY_REVIEW_QUERY_KEY = (productSlug: string) =>
  ["reviews", productSlug, "mine"] as const;

export function useMyReview(productSlug: string) {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: MY_REVIEW_QUERY_KEY(productSlug),
    queryFn: () => reviewService.getMyReview(productSlug, token),
    enabled: isAuthenticated && !!productSlug,
  });
}
