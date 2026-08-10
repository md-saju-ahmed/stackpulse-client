import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type { Product } from "@/features/products/types";
import type { Review } from "@/features/reviews/types";
import type {
  DashboardListQuery,
  DashboardOverview,
  PlatformOverview,
} from "./types";

function buildListQueryString(query?: DashboardListQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardService = {
  async getOverview(jwt?: string | null): Promise<{ data: DashboardOverview }> {
    return api.get<DashboardOverview>("/api/dashboard/overview", { jwt });
  },

  // Admin-only
  async getAdminOverview(jwt?: string | null): Promise<{ data: PlatformOverview }> {
    return api.get<PlatformOverview>("/api/dashboard/admin-overview", { jwt });
  },

  async getOwnedProducts(
    query: DashboardListQuery | undefined,
    jwt?: string | null,
  ): Promise<{ data: Product[]; meta?: PaginationMeta }> {
    return api.get<Product[]>(
      `/api/dashboard/products${buildListQueryString(query)}`,
      { jwt },
    );
  },

  async getOwnedProductBySlug(
    slug: string,
    jwt?: string | null,
  ): Promise<{ data: Product }> {
    return api.get<Product>(`/api/dashboard/products/${slug}`, { jwt });
  },

  async getReviews(
    query: DashboardListQuery | undefined,
    jwt?: string | null,
  ): Promise<{ data: Review[]; meta?: PaginationMeta }> {
    return api.get<Review[]>(
      `/api/dashboard/reviews${buildListQueryString(query)}`,
      { jwt },
    );
  },
};
