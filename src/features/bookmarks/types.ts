export type Bookmark = {
  /** Prisma/PostgreSQL backend field */
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
};

export type BookmarkQuery = {
  page?: number;
  limit?: number;
};
