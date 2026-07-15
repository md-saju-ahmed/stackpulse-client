"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { productService } from "../product.service";
import type { CreateProductInput } from "../types";

export function useCreateProduct() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => {
      if (!token) {
        throw new Error("You must be signed in to submit a tool.");
      }
      return productService.createProduct(input, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
    },
  });
}
