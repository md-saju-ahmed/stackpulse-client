export type CategorySortField = "createdAt" | "name" | "productCount";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  description: string;
  icon?: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategoryQuery = {
  page?: number;
  limit?: number;
  sort?: CategorySortField;
  order?: "asc" | "desc";
  search?: string;
};
