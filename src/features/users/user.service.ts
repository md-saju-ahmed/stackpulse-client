import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/pagination";
import type {
  AdminUser,
  AdminUserQuery,
  UpdateProfileInput,
  UserProfile,
} from "./types";

function buildAdminUserQueryString(query?: AdminUserQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.accountStatus) params.set("accountStatus", query.accountStatus);
  if (query.keyword) params.set("keyword", query.keyword);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const userService = {
  async getMe(jwt: string): Promise<{ data: UserProfile }> {
    return api.get<UserProfile>("/api/users/me", { jwt });
  },

  async getUser(id: string): Promise<{ data: UserProfile }> {
    return api.get<UserProfile>(`/api/users/${id}`);
  },

  async updateMe(
    input: UpdateProfileInput,
    jwt: string,
  ): Promise<{ data: UserProfile }> {
    return api.patch<UserProfile>("/api/users/me", input, { jwt });
  },

  async listUsers(
    query: AdminUserQuery | undefined,
    jwt: string,
  ): Promise<{ data: AdminUser[]; meta?: PaginationMeta }> {
    return api.get<AdminUser[]>(
      `/api/users${buildAdminUserQueryString(query)}`,
      { jwt },
    );
  },

  async approveUser(id: string, jwt: string): Promise<{ data: AdminUser }> {
    return api.patch<AdminUser>(`/api/users/${id}/approve`, undefined, { jwt });
  },

  async suspendUser(id: string, jwt: string): Promise<{ data: AdminUser }> {
    return api.patch<AdminUser>(`/api/users/${id}/suspend`, undefined, { jwt });
  },

  async unsuspendUser(id: string, jwt: string): Promise<{ data: AdminUser }> {
    return api.patch<AdminUser>(`/api/users/${id}/unsuspend`, undefined, {
      jwt,
    });
  },

  async deleteUser(id: string, jwt: string): Promise<{ data: AdminUser }> {
    return api.delete<AdminUser>(`/api/users/${id}`, { jwt });
  },
};
