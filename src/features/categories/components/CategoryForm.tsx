"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryFormSchema,
  type CategoryFormSchema,
} from "@/validators/category";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { CreateCategoryInput } from "../types";

type CategoryFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<CategoryFormSchema>;
  onSubmit: (payload: CreateCategoryInput) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isRename?: boolean;
  onNameChange?: (value: string) => void;
};

export function CategoryForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  isRename = false,
  onNameChange,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const submitting = isSubmitting ?? isFormSubmitting;

  async function handleFormSubmit(values: CategoryFormSchema) {
    const payload: CreateCategoryInput = {
      name: values.name,
      description: values.description,
      icon: values.icon ? values.icon : undefined,
    };
    await onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="category-name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>
        <Input
          id="category-name"
          placeholder="Developer Tools"
          {...register("name")}
          onChange={(e) => {
            void register("name").onChange(e);
            onNameChange?.(e.target.value);
          }}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>
        <Textarea
          id="category-description"
          placeholder="What kinds of tools belong in this category?"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category-icon"
          className="mb-1 block text-sm font-medium"
        >
          Icon{" "}
          <span className="text-muted-foreground">
            (optional emoji or short code)
          </span>
        </label>
        <Input id="category-icon" placeholder="🛠️" {...register("icon")} />
        {errors.icon && (
          <p className="mt-1 text-sm text-destructive">{errors.icon.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button id="category-form-submit" type="submit" disabled={submitting}>
          {submitting
            ? isRename
              ? "Renaming… updating products"
              : mode === "edit"
                ? "Saving…"
                : "Creating…"
            : mode === "edit"
              ? "Save changes"
              : "Create category"}
        </Button>
        {onCancel && (
          <Button
            id="category-form-cancel"
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
