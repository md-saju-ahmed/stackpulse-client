"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { reviewService } from "../review.service";
import { MY_REVIEW_QUERY_KEY } from "./useMyReview";
import type { UpdateReviewInput } from "../types";

export function useUpdateReview(productSlug: string) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateReviewInput) => {
      if (!token) {
        throw new Error("You must be signed in to update your review.");
      }
      return reviewService.updateReview(productSlug, input, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", productSlug, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: MY_REVIEW_QUERY_KEY(productSlug),
      });
      queryClient.invalidateQueries({
        queryKey: ["products", "detail", productSlug],
      });
    },
  });
}
