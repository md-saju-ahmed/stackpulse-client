export type DashboardOverview = {
  totalProducts: number;
  totalReviews: number;
  totalBookmarks: number;
};

// Admin-only
export type PlatformOverview = {
  users: {
    total: number;
    pending: number;
    approved: number;
    suspended: number;
    deleted: number;
  };
  products: {
    total: number;
    pending: number;
    published: number;
    rejected: number;
  };
  totalReviews: number;
  totalBookmarks: number;
  totalCategories: number;
};

export type DashboardListQuery = {
  page?: number;
  limit?: number;
};
