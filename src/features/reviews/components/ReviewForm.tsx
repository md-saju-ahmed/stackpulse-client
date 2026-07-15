"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { reviewFormSchema, type ReviewFormSchema } from "@/validators/review";
import { StarRating } from "@/components/StarRating";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "../hooks/useCreateReview";
import { useUpdateReview } from "../hooks/useUpdateReview";
import type { Review } from "../types";

type ReviewFormProps = {
  productSlug: string;
  mode: "create" | "edit";
  initialReview?: Review;
  onDone?: () => void;
  onCancel?: () => void;
};

export function ReviewForm({
  productSlug,
  mode,
  initialReview,
  onDone,
  onCancel,
}: ReviewFormProps) {
  const createReview = useCreateReview(productSlug);
  const updateReview = useUpdateReview(productSlug);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormSchema>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: initialReview?.rating ?? 0,
      title: initialReview?.title ?? "",
      body: initialReview?.body ?? "",
    },
  });

  const pending =
    isSubmitting || createReview.isPending || updateReview.isPending;

  async function onSubmit(values: ReviewFormSchema) {
    const payload = {
      rating: values.rating,
      title: values.title ? values.title : undefined,
      body: values.body,
    };

    try {
      if (mode === "create") {
        await createReview.mutateAsync(payload);
        toast.success("Review submitted");
      } else {
        await updateReview.mutateAsync(payload);
        toast.success("Review updated");
      }
      onDone?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save review";
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              readOnly={false}
            />
          )}
        />
        {errors.rating && (
          <p className="text-destructive text-sm mt-1">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium mb-1"
        >
          Title <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="review-title"
          type="text"
          placeholder="Sum it up in a few words"
          className="h-11 rounded-xl"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-sm mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium mb-1">
          Review
        </label>
        <Textarea
          id="review-body"
          rows={4}
          placeholder="What did you think? (at least 10 characters)"
          {...register("body")}
        />
        {errors.body && (
          <p className="text-destructive text-sm mt-1">{errors.body.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          id="review-form-submit"
          type="submit"
          disabled={pending}
          className="h-11 px-6 rounded-xl"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Submit review"
              : "Save changes"}
        </Button>
        {onCancel && (
          <Button
            id="review-form-cancel"
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
            className="h-11 px-6 rounded-xl"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
