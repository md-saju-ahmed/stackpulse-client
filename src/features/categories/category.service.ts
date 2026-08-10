import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type {
  Category,
  CategoryQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types";

function buildCategoryQueryString(query?: CategoryQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const categoryService = {
  async getCategories(
    query?: CategoryQuery,
  ): Promise<{ data: Category[]; meta?: PaginationMeta }> {
    return api.get<Category[]>(
      `/api/categories${buildCategoryQueryString(query)}`,
    );
  },

  async getCategoryBySlug(slug: string): Promise<{ data: Category }> {
    return api.get<Category>(`/api/categories/${slug}`);
  },

  // Admin: category management
  async createCategory(
    input: CreateCategoryInput,
    jwt?: string | null,
  ): Promise<{ data: Category }> {
    return api.post<Category>("/api/categories", input, { jwt });
  },

  async updateCategory(
    slug: string,
    input: UpdateCategoryInput,
    jwt?: string | null,
  ): Promise<{ data: Category }> {
    return api.patch<Category>(`/api/categories/${slug}`, input, { jwt });
  },

  async deleteCategory(
    slug: string,
    jwt?: string | null,
  ): Promise<{ data: undefined }> {
    return api.delete<undefined>(`/api/categories/${slug}`, { jwt });
  },
};
