"use client";
import { FolderOpenIcon } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import {
  CategoryGrid,
  CategoryGridSkeleton,
} from "@/features/categories/components/CategoryGrid";
import { EmptyState } from "@/components/EmptyState";

export default function CategoriesPage() {
  const { data, isLoading, isError } = useCategories({ limit: 100 });
  const categories = data?.data ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Browse developer tools by category.
        </p>
      </div>

      {isLoading ? (
        <CategoryGridSkeleton />
      ) : isError ? (
        <EmptyState
          title="Couldn't load categories"
          description="Something went wrong fetching categories. Please try again."
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderOpenIcon className="size-8" />}
          title="No categories yet"
          description="Check back once categories have been added."
        />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  );
}
