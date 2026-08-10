"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { productService } from "../product.service";

export function useRejectProduct() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => productService.rejectProduct(slug, token),
    onSuccess: (_result, slug) => {
      queryClient.invalidateQueries({ queryKey: ["products", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["products", "detail", slug] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "products"] });
    },
  });
}
