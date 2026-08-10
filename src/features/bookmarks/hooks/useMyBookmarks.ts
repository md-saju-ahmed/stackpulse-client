"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { bookmarkService } from "../bookmark.service";
import type { BookmarkQuery } from "../types";

export const BOOKMARKS_LIST_QUERY_KEY = (query?: BookmarkQuery) =>
  ["bookmarks", "list", query] as const;

export function useMyBookmarks(query?: BookmarkQuery) {
  const { isAuthenticated } = useAuth();
  const { token } = useJwtToken();

  return useQuery({
    queryKey: BOOKMARKS_LIST_QUERY_KEY(query),
    queryFn: () => bookmarkService.getMyBookmarks(query, token),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
