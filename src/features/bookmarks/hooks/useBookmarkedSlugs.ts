"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { bookmarkService } from "../bookmark.service";

export const BOOKMARKED_SLUGS_QUERY_KEY = ["bookmarks", "slugs"] as const;

export function useBookmarkedSlugs() {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: BOOKMARKED_SLUGS_QUERY_KEY,
    queryFn: async () => {
      const { data: slugs } = await bookmarkService.getBookmarkedSlugs(token);
      return new Set<string>(slugs);
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}
