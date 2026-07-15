"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyReview } from "../hooks/useMyReview";
import { useDeleteReview } from "../hooks/useDeleteReview";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type MyReviewSectionProps = {
  productSlug: string;
};

export function MyReviewSection({ productSlug }: MyReviewSectionProps) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useMyReview(productSlug);
  const deleteReview = useDeleteReview(productSlug);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        Sign in to leave a review for this tool.
      </p>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  const myReview = data?.data ?? null;

  async function handleDelete() {
    try {
      await deleteReview.mutateAsync();
      toast.success("Review deleted");
      setIsConfirmOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete review";
      toast.error(message);
    }
  }

  if (!myReview) {
    return (
      <div>
        <h3 className="font-heading text-sm font-medium mb-2">
          Leave a review
        </h3>
        <ReviewForm productSlug={productSlug} mode="create" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <h3 className="font-heading text-sm font-medium mb-2">
          Edit your review
        </h3>
        <ReviewForm
          productSlug={productSlug}
          mode="edit"
          initialReview={myReview}
          onDone={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="font-heading text-sm font-medium mb-2">Your review</h3>
        <ReviewCard
          review={myReview}
          actions={
            <div className="flex gap-2">
              <Button
                id="my-review-edit"
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                id="my-review-delete"
                size="sm"
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                disabled={deleteReview.isPending}
              >
                Delete
              </Button>
            </div>
          }
        />
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete Review"
        description="Delete your review? This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteReview.isPending}
      />
    </>
  );
}
