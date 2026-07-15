"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtToken } from "@/features/auth/hooks/useJwtToken";
import { bookmarkService } from "../bookmark.service";
import {
  BOOKMARKED_SLUGS_QUERY_KEY,
  useBookmarkedSlugs,
} from "./useBookmarkedSlugs";

type MutationContext = {
  previous: Set<string> | undefined;
};

export function useToggleBookmark(slug: string) {
  const { token } = useJwtToken();
  const queryClient = useQueryClient();
  const { data: bookmarkedSlugs, isLoading } = useBookmarkedSlugs();

  const isBookmarked = bookmarkedSlugs?.has(slug) ?? false;

  const mutation = useMutation<void, Error, void, MutationContext>({
    mutationFn: async () => {
      if (!token) {
        throw new Error("You must be signed in to bookmark a tool.");
      }
      if (isBookmarked) {
        await bookmarkService.removeBookmark(slug, token);
      } else {
        await bookmarkService.addBookmark(slug, token);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: BOOKMARKED_SLUGS_QUERY_KEY });
      const previous = queryClient.getQueryData<Set<string>>(
        BOOKMARKED_SLUGS_QUERY_KEY,
      );

      queryClient.setQueryData<Set<string>>(
        BOOKMARKED_SLUGS_QUERY_KEY,
        (old) => {
          const next = new Set(old ?? []);
          if (isBookmarked) {
            next.delete(slug);
          } else {
            next.add(slug);
          }
          return next;
        },
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context) {
        queryClient.setQueryData(BOOKMARKED_SLUGS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["products", "detail", slug] });
    },
  });

  return {
    isBookmarked,
    isLoading,
    isPending: mutation.isPending,
    toggle: () => mutation.mutate(),
  };
}
