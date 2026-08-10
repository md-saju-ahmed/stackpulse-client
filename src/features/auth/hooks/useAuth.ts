"use client";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AUTH_CHANGE_EVENT } from "@/lib/auth";
import type { AuthUser } from "../types";

export const SESSION_QUERY_KEY = ["auth", "session"] as const;

async function fetchSession(): Promise<AuthUser | null> {
  const res = await fetch(`/api/users/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as { success: boolean; data?: AuthUser };
  return json.success && json.data ? json.data : null;
}

export type UseAuthReturn = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    retry: false,
  });

  useEffect(() => {
    function onAuthChange() {
      void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    }

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    };
  }, [queryClient]);

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: Boolean(data),
  };
}
