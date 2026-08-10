"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { categoryService } from "../category.service";
import type { CreateCategoryInput } from "../types";

export function useCreateCategory() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.createCategory(input, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
    },
  });
}
