"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { categoryService } from "../category.service";
import type { UpdateCategoryInput } from "../types";

export function useUpdateCategory(slug: string) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => categoryService.updateCategory(slug, input, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["categories", "detail", slug],
      });
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
    },
  });
}
