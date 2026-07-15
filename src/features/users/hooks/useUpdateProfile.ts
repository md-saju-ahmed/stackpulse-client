"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { authClient } from "@/lib/auth";
import { userService } from "../user.service";
import { ME_QUERY_KEY } from "./useMe";
import type { UpdateProfileInput } from "../types";

export function useUpdateProfile() {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      if (!token) {
        throw new Error("You must be signed in to update your profile.");
      }
      return userService.updateMe(input, token);
    },
    onSuccess: (_result, input) => {
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });

      if (input.name !== undefined) {
        void authClient.getSession({ query: { disableCookieCache: true } });
      }
    },
  });
}
