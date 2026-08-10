export type ReviewSortField = "createdAt" | "rating";

export type Review = {
  /** Prisma/PostgreSQL backend field */
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewInput = {
  rating: number;
  title?: string;
  body: string;
};

export type UpdateReviewInput = Partial<CreateReviewInput>;

export type ReviewQuery = {
  page?: number;
  limit?: number;
  sort?: ReviewSortField;
  order?: "asc" | "desc";
};
