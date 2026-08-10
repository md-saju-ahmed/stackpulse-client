"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { categoryService } from "../category.service";

export function useDeleteCategory() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => categoryService.deleteCategory(slug, token),
    onSuccess: (_result, slug) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
      queryClient.removeQueries({ queryKey: ["categories", "detail", slug] });
    },
  });
}
