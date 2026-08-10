import { api, ApiError } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type {
  CreateReviewInput,
  Review,
  ReviewQuery,
  UpdateReviewInput,
} from "./types";

function buildReviewQueryString(query?: ReviewQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const reviewService = {
  async getProductReviews(
    productSlug: string,
    query?: ReviewQuery,
  ): Promise<{ data: Review[]; meta?: PaginationMeta }> {
    return api.get<Review[]>(
      `/api/reviews/${productSlug}${buildReviewQueryString(query)}`,
    );
  },

  // Returns `null` when the user hasn't reviewed this product yet (backend
  // 404s in that case — that's an expected, non-error state here).
  // Branches on `ApiError.status === 404` (not on message text) per the
  // error-handling pattern documented in src/lib/api.ts.
  async getMyReview(
    productSlug: string,
    jwt?: string | null,
  ): Promise<{ data: Review } | null> {
    try {
      return await api.get<Review>(`/api/reviews/${productSlug}/mine`, { jwt });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createReview(
    productSlug: string,
    input: CreateReviewInput,
    jwt?: string | null,
  ): Promise<{ data: Review }> {
    return api.post<Review>(`/api/reviews/${productSlug}`, input, { jwt });
  },

  async updateReview(
    productSlug: string,
    input: UpdateReviewInput,
    jwt?: string | null,
  ): Promise<{ data: Review }> {
    return api.patch<Review>(`/api/reviews/${productSlug}`, input, { jwt });
  },

  async deleteReview(
    productSlug: string,
    jwt?: string | null,
  ): Promise<{ data: undefined }> {
    return api.delete<undefined>(`/api/reviews/${productSlug}`, { jwt });
  },
};
