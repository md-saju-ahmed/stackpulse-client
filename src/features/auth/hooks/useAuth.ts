"use client";
import { useSession } from "@/lib/auth";
import type { AuthUser } from "../types";

export type UseAuthReturn = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): UseAuthReturn {
  const { data, isPending } = useSession();

  const user: AuthUser | null = data?.user
    ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: (data.user as { role?: string }).role ?? "user",
        accountStatus:
          (data.user as { accountStatus?: AuthUser["accountStatus"] })
            .accountStatus ?? "pending",
        image: data.user.image,
      }
    : null;

  return {
    user,
    isLoading: isPending,
    isAuthenticated: user !== null,
  };
}
