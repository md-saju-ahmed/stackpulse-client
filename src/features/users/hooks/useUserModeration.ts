"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { userService } from "../user.service";

function useUserMutation(
  mutationFn: (id: string, jwt?: string | null) => Promise<unknown>,
) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutationFn(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "admin-overview"],
      });
    },
  });
}

export function useApproveUserAccount() {
  return useUserMutation(userService.approveUser);
}

export function useSuspendUserAccount() {
  return useUserMutation(userService.suspendUser);
}

export function useUnsuspendUserAccount() {
  return useUserMutation(userService.unsuspendUser);
}

export function useDeleteUserAccount() {
  return useUserMutation(userService.deleteUser);
}
