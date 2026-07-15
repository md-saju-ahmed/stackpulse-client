"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { productService } from "../product.service";

export function useDeleteProduct() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => {
      if (!token) {
        throw new Error("You must be signed in to delete this tool.");
      }
      return productService.deleteProduct(slug, token);
    },
    onSuccess: (_result, slug) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.removeQueries({ queryKey: ["products", "detail", slug] });
    },
  });
}
