export type ProductStatus = "PENDING" | "PUBLISHED" | "REJECTED";

export type ProductPricing = "FREE" | "FREEMIUM" | "PAID" | "OPEN_SOURCE";

export type ProductSortField =
  | "createdAt"
  | "averageRating"
  | "reviewCount"
  | "bookmarkCount";

export type Product = {
  /** Prisma/PostgreSQL backend field */
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  website: string;
  github?: string;
  documentation?: string;
  category: string; // Category's slug, not display name
  tags: string[];
  pricing: ProductPricing;
  ownerId: string;
  averageRating: number;
  reviewCount: number;
  bookmarkCount: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  website: string;
  github?: string;
  documentation?: string;
  category: string; // Category's slug
  tags?: string[];
  pricing: ProductPricing;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  pricing?: ProductPricing;
  tags?: string[];
  sort?: ProductSortField;
  order?: "asc" | "desc";
};

export type AdminProductQuery = {
  page?: number;
  limit?: number;
  status?: ProductStatus;
};
