"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { reviewService } from "../review.service";
import { MY_REVIEW_QUERY_KEY } from "./useMyReview";
import type { CreateReviewInput } from "../types";

export function useCreateReview(productSlug: string) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => {
      if (!token) {
        throw new Error("You must be signed in to leave a review.");
      }
      return reviewService.createReview(productSlug, input, token);
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
