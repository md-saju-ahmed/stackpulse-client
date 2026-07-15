"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { productService } from "../product.service";
import { PRODUCT_DETAIL_QUERY_KEY } from "./useProduct";
import type { UpdateProductInput } from "../types";

export function useUpdateProduct(slug: string) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => {
      if (!token) {
        throw new Error("You must be signed in to edit this tool.");
      }
      return productService.updateProduct(slug, input, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_DETAIL_QUERY_KEY(slug),
      });
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "products"] });
    },
  });
}
