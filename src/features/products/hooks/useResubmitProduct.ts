"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { productService } from "../product.service";

export function useResubmitProduct() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => {
      if (!token) {
        throw new Error("You must be signed in to resubmit a product.");
      }
      return productService.resubmitProduct(slug, token);
    },
    onSuccess: (_result, slug) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "detail", slug] });
    },
  });
}
