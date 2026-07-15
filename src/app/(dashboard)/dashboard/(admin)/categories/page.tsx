"use client";
import { useState } from "react";
import { FolderPlusIcon, TriangleAlertIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";
import { useUpdateCategory } from "@/features/categories/hooks/useUpdateCategory";
import { useDeleteCategory } from "@/features/categories/hooks/useDeleteCategory";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import {
  CategoryTable,
  CategoryTableSkeleton,
} from "@/features/categories/components/CategoryTable";
import type {
  Category,
  CreateCategoryInput,
} from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ApiError } from "@/lib/api";

const PAGE_LIMIT = 20;

type FormState = { mode: "create" } | { mode: "edit"; category: Category };

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const { data, isLoading, isError } = useCategories({
    page,
    limit: PAGE_LIMIT,
    sort: "name",
    order: "asc",
  });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(
    formState?.mode === "edit" ? formState.category.slug : "",
  );
  const deleteCategory = useDeleteCategory();

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const isRenaming =
    updateCategory.isPending &&
    formState?.mode === "edit" &&
    updateCategory.variables !== undefined &&
    updateCategory.variables.name !== undefined &&
    updateCategory.variables.name !== formState.category.name;

  const [pendingName, setPendingName] = useState<string | undefined>(undefined);

  async function handleFormSubmit(payload: CreateCategoryInput) {
    try {
      if (formState?.mode === "edit") {
        await updateCategory.mutateAsync(payload);
        setPendingName(undefined);
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(payload);
        toast.success("Category created");
      }
      setFormState(null);
    } catch (error) {
      toast.error(
        errorMessage(error, "Something went wrong. Please try again."),
      );
    }
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete.slug);
      toast.success(`"${categoryToDelete.name}" was deleted`);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error, "Failed to delete category"));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage the categories tools can be filed under.
          </p>
        </div>
        {formState === null && (
          <Button
            id="admin-categories-new"
            onClick={() => setFormState({ mode: "create" })}
          >
            <FolderPlusIcon />
            New category
          </Button>
        )}
      </div>

      {formState !== null && (
        <div className="rounded-xl border p-4">
          <h2 className="mb-4 font-heading text-lg font-medium">
            {formState.mode === "edit"
              ? `Edit "${formState.category.name}"`
              : "New category"}
          </h2>

          {formState.mode === "edit" &&
            pendingName !== undefined &&
            pendingName !== formState.category.name && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
                <span>
                  Renaming this category will update the category reference on
                  every product filed under it. This may take a moment for large
                  catalogues.
                </span>
              </div>
            )}

          <CategoryForm
            mode={formState.mode}
            defaultValues={
              formState.mode === "edit"
                ? {
                    name: formState.category.name,
                    description: formState.category.description,
                    icon: formState.category.icon ?? "",
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormState(null);
              setPendingName(undefined);
            }}
            onNameChange={
              formState.mode === "edit" ? setPendingName : undefined
            }
            isSubmitting={createCategory.isPending || updateCategory.isPending}
            isRename={isRenaming}
          />
        </div>
      )}

      {isLoading ? (
        <CategoryTableSkeleton count={PAGE_LIMIT} />
      ) : isError ? (
        <EmptyState
          title="Couldn't load categories"
          description="Something went wrong fetching categories. Please try again."
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderPlusIcon className="size-8" />}
          title="No categories yet"
          description="Create your first category to get started."
        />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(category) => setFormState({ mode: "edit", category })}
          onDelete={(category) => setCategoryToDelete(category)}
        />
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      <ConfirmDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
        title={`Delete "${categoryToDelete?.name ?? ""}"?`}
        description="This can't be undone. Categories with products still assigned can't be deleted — move or remove those products first."
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
