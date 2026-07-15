export type UserProfile = {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  websiteUrl?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  name?: string;
  bio?: string;
  image?: string;
  websiteUrl?: string;
  location?: string;
};

export type AccountStatus = "pending" | "approved" | "suspended" | "deleted";

export type AdminUser = {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role: "user" | "admin";
  accountStatus: AccountStatus;
  createdAt: string;
};

export type AdminUserQuery = {
  page?: number;
  limit?: number;
  accountStatus?: AccountStatus;
  keyword?: string;
};
