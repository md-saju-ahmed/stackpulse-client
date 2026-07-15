"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useOwnedProductBySlug } from "@/features/dashboard/hooks/useOwnedProductBySlug";
import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import { ProductForm } from "@/features/products/components/ProductForm";
import type { CreateProductInput } from "@/features/products/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ApiError } from "@/lib/api";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const { data: product, isLoading, isError } = useOwnedProductBySlug(slug);
  const updateProduct = useUpdateProduct(slug);

  async function handleSubmit(payload: CreateProductInput) {
    try {
      const { data } = await updateProduct.mutateAsync(payload);
      toast.success(
        data.status === "PENDING" && product?.status === "PUBLISHED"
          ? "Changes saved — sent back for admin review before it's live again."
          : "Changes saved",
      );
      router.push("/dashboard/products");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to save changes";
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <EmptyState
        title="Product not found"
        description="This tool doesn't exist, or it isn't yours to edit."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-2xl font-semibold">Edit tool</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Update the details for &quot;{product.name}&quot;.
      </p>
      <ProductForm
        mode="edit"
        defaultValues={{
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          logo: product.logo,
          website: product.website,
          github: product.github ?? "",
          documentation: product.documentation ?? "",
          category: product.category,
          tags: product.tags.join(", "),
          pricing: product.pricing,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  );
}
