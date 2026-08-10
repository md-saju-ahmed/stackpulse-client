import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type {
  AdminProductQuery,
  CreateProductInput,
  Product,
  ProductQuery,
  UpdateProductInput,
} from "./types";

function buildProductQueryString(query?: ProductQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.category) params.set("category", query.category);
  if (query.pricing) params.set("pricing", query.pricing);
  if (query.tags?.length) params.set("tags", query.tags.join(","));
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function buildAdminQueryString(query?: AdminProductQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.status) params.set("status", query.status);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const productService = {
  async getProducts(
    query?: ProductQuery,
  ): Promise<{ data: Product[]; meta?: PaginationMeta }> {
    return api.get<Product[]>(`/api/products${buildProductQueryString(query)}`);
  },

  async getProductBySlug(slug: string): Promise<{ data: Product }> {
    return api.get<Product>(`/api/products/${slug}`);
  },

  async createProduct(
    input: CreateProductInput,
    jwt?: string | null,
  ): Promise<{ data: Product }> {
    return api.post<Product>("/api/products", input, { jwt });
  },

  async updateProduct(
    slug: string,
    input: UpdateProductInput,
    jwt?: string | null,
  ): Promise<{ data: Product }> {
    return api.patch<Product>(`/api/products/${slug}`, input, { jwt });
  },

  async deleteProduct(slug: string, jwt?: string | null): Promise<{ data: undefined }> {
    return api.delete<undefined>(`/api/products/${slug}`, { jwt });
  },

  // Admin: moderation
  async getPendingProducts(
    query: AdminProductQuery | undefined,
    jwt?: string | null,
  ): Promise<{ data: Product[]; meta?: PaginationMeta }> {
    return api.get<Product[]>(
      `/api/products/pending${buildAdminQueryString(query)}`,
      { jwt },
    );
  },

  async approveProduct(slug: string, jwt?: string | null): Promise<{ data: Product }> {
    return api.patch<Product>(`/api/products/${slug}/approve`, undefined, {
      jwt,
    });
  },

  async rejectProduct(slug: string, jwt?: string | null): Promise<{ data: Product }> {
    return api.patch<Product>(`/api/products/${slug}/reject`, undefined, {
      jwt,
    });
  },

  // Owner action: transition REJECTED → PENDING for another review cycle.
  async resubmitProduct(slug: string, jwt?: string | null): Promise<{ data: Product }> {
    return api.post<Product>(`/api/products/${slug}/resubmit`, undefined, {
      jwt,
    });
  },
};
