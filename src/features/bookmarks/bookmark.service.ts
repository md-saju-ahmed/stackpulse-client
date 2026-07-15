import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type { Product } from "@/features/products/types";
import type { Bookmark, BookmarkQuery } from "./types";

function buildBookmarkQueryString(query?: BookmarkQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const bookmarkService = {
  async addBookmark(
    productSlug: string,
    jwt: string,
  ): Promise<{ data: Bookmark }> {
    return api.post<Bookmark>(`/api/bookmarks/${productSlug}`, undefined, {
      jwt,
    });
  },

  async removeBookmark(
    productSlug: string,
    jwt: string,
  ): Promise<{ data: undefined }> {
    return api.delete<undefined>(`/api/bookmarks/${productSlug}`, { jwt });
  },

  async getMyBookmarks(
    query: BookmarkQuery | undefined,
    jwt: string,
  ): Promise<{ data: Product[]; meta?: PaginationMeta }> {
    return api.get<Product[]>(
      `/api/bookmarks${buildBookmarkQueryString(query)}`,
      { jwt },
    );
  },

  async getBookmarkedSlugs(jwt: string): Promise<{ data: string[] }> {
    return api.get<string[]>("/api/bookmarks/slugs", { jwt });
  },
};
