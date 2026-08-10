"use client";
import { useCallback } from "react";
import { useAuth } from "./useAuth";

export type UseJwtTokenReturn = {
  token: string | null;
  isLoading: boolean;
  refetch: () => void;
};

export function useJwtToken(): UseJwtTokenReturn {
  const { isLoading } = useAuth();
  const refetch = useCallback(() => {}, []);

  return {
    token: null,
    isLoading,
    refetch,
  };
}
