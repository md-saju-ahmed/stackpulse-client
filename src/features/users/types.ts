export type AccountStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "DELETED";

export type UserProfile = {
  /** Prisma/PostgreSQL backend field */
  id: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  websiteUrl?: string;
  location?: string;
  role: "USER" | "ADMIN";
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  name?: string;
  bio?: string | null;
  image?: string | null;
  websiteUrl?: string | null;
  location?: string | null;
};

export type AdminUser = {
  /** Prisma/PostgreSQL backend field */
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: "USER" | "ADMIN";
  accountStatus: AccountStatus;
  createdAt: string;
};

export type AdminUserQuery = {
  page?: number;
  limit?: number;
  accountStatus?: AccountStatus;
  keyword?: string;
};
