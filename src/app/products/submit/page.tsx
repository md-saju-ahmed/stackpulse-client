"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockIcon, ClockIcon, BanIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";
import { ProductForm } from "@/features/products/components/ProductForm";
import type { CreateProductInput } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ApiError } from "@/lib/api";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";

export default function SubmitProductPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const createProduct = useCreateProduct();

  async function handleSubmit(payload: CreateProductInput) {
    try {
      const { data } = await createProduct.mutateAsync(payload);
      toast.success(
        data.status === "PUBLISHED"
          ? "Tool submitted and published!"
          : "Tool submitted! It's now pending review.",
      );
      router.push(`/products/${data.slug}`);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to submit tool";
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <Container className="py-10 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="h-100 w-full rounded-xl" />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-10 max-w-3xl">
        <EmptyState
          icon={<LockIcon className="size-8 text-muted-foreground" />}
          title="Sign in required"
          description="You need an account to submit a tool to StackPulse."
          action={
            <Link href="/login?callbackUrl=/products/submit">
              <Button
                id="submit-product-signin"
                className="h-11 px-6 rounded-xl"
              >
                Sign in
              </Button>
            </Link>
          }
        />
      </Container>
    );
  }

  if (user?.accountStatus === "pending") {
    return (
      <Container className="py-10 max-w-3xl">
        <EmptyState
          icon={<ClockIcon className="size-8 text-muted-foreground" />}
          title="Account pending approval"
          description="Your account is awaiting admin approval. Once approved, you'll be able to submit tools."
        />
      </Container>
    );
  }

  if (user?.accountStatus === "suspended") {
    return (
      <Container className="py-10 max-w-3xl">
        <EmptyState
          icon={<BanIcon className="size-8 text-muted-foreground" />}
          title="Account suspended"
          description="Your account has been suspended and can't submit new tools. Contact an admin if you think this is a mistake."
        />
      </Container>
    );
  }

  return (
    <Container className="py-10 max-w-3xl">
      <SectionTitle
        title="Submit a tool"
        description={
          user?.role === "admin"
            ? "Share a developer tool with the community. As an admin, your submissions go live immediately."
            : "Share a developer tool with the community. New submissions are reviewed by an admin before they go live."
        }
        align="left"
        className="mb-8"
      />
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
      />
    </Container>
  );
}
