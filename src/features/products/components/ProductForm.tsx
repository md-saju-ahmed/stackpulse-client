"use client";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PRODUCT_PRICING_OPTIONS,
  productFormSchema,
  type ProductFormSchema,
} from "@/validators/product";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ComboboxFilter } from "@/components/ui/combobox-filter";
import type { CreateProductInput } from "../types";

type ProductFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ProductFormSchema>;
  onSubmit: (payload: CreateProductInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ProductForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
    sort: "name",
    order: "asc",
  });
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const submitting = isSubmitting ?? isFormSubmitting;
  const logoUrl = useWatch({
    control,
    name: "logo",
  });

  async function handleFormSubmit(values: ProductFormSchema) {
    const trimmedLogo = values.logo?.trim();
    const payload: CreateProductInput = {
      name: values.name,
      tagline: values.tagline,
      description: values.description,
      logo:
        trimmedLogo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random&size=256`,
      website: values.website,
      github: values.github ? values.github : undefined,
      documentation: values.documentation ? values.documentation : undefined,
      category: values.category,
      tags: values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      pricing: values.pricing,
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Section 1: Basic Information */}
      <div className="bg-card/40 dark:bg-zinc-900/40 border border-border/50 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">
            Basic Information
          </h3>
          <p className="text-xs text-muted-foreground">
            Provide the name, tagline, category, and pricing model of your tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium mb-1.5"
            >
              Name
            </label>
            <Input
              id="product-name"
              type="text"
              placeholder="e.g. Linear"
              className="h-11 rounded-xl"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="product-tagline"
              className="block text-sm font-medium mb-1.5"
            >
              Tagline
            </label>
            <Input
              id="product-tagline"
              type="text"
              placeholder="A short one-line pitch"
              className="h-11 rounded-xl"
              {...register("tagline")}
            />
            {errors.tagline && (
              <p className="text-destructive text-sm mt-1">
                {errors.tagline.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-category"
              className="block text-sm font-medium mb-1.5"
            >
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <ComboboxFilter
                  id="product-category"
                  value={field.value}
                  onChange={field.onChange}
                  options={categories.map((c) => ({
                    value: c.slug,
                    label: c.name,
                  }))}
                  placeholder={
                    categoriesLoading
                      ? "Loading categories…"
                      : "Select a category"
                  }
                  searchPlaceholder="Search categories..."
                  showSearch
                  buttonClassName="h-11 rounded-xl text-left"
                />
              )}
            />
            {errors.category && (
              <p className="text-destructive text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="product-pricing"
              className="block text-sm font-medium mb-1.5"
            >
              Pricing
            </label>
            <Controller
              name="pricing"
              control={control}
              render={({ field }) => (
                <ComboboxFilter
                  id="product-pricing"
                  value={field.value}
                  onChange={field.onChange}
                  options={PRODUCT_PRICING_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  placeholder="Select pricing model"
                  buttonClassName="h-11 rounded-xl text-left"
                />
              )}
            />
            {errors.pricing && (
              <p className="text-destructive text-sm mt-1">
                {errors.pricing.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Detailed Description */}
      <div className="bg-card/40 dark:bg-zinc-900/40 border border-border/50 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">
            Details & Description
          </h3>
          <p className="text-xs text-muted-foreground">
            Describe what your tool does in detail and append search tags.
          </p>
        </div>

        <div>
          <label
            htmlFor="product-description"
            className="block text-sm font-medium mb-1.5"
          >
            Description
          </label>
          <Textarea
            id="product-description"
            placeholder="What does this tool do? (at least 50 characters)"
            rows={5}
            className="rounded-xl py-3 px-4 text-base min-h-30"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-destructive text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-tags"
            className="block text-sm font-medium mb-1.5"
          >
            Tags{" "}
            <span className="text-muted-foreground font-normal">
              (optional, comma-separated)
            </span>
          </label>
          <Input
            id="product-tags"
            type="text"
            placeholder="e.g. productivity, ai, open-source"
            className="h-11 rounded-xl"
            {...register("tags")}
          />
          {errors.tags && (
            <p className="text-destructive text-sm mt-1">
              {errors.tags.message}
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Links & Media */}
      <div className="bg-card/40 dark:bg-zinc-900/40 border border-border/50 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">
            Links & Media
          </h3>
          <p className="text-xs text-muted-foreground">
            Connect your tool&apos;s online presence, code repository, and
            documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label
                htmlFor="product-logo"
                className="block text-sm font-medium mb-1.5"
              >
                Logo URL{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                id="product-logo"
                type="url"
                placeholder="https://example.com/logo.png — leave blank to auto-generate one"
                className="h-11 rounded-xl"
                {...register("logo")}
              />
            </div>
            {logoUrl && /^https?:\/\/.+/i.test(logoUrl) && (
              <div className="size-11 shrink-0 rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-800 p-1 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="size-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="product-website"
              className="block text-sm font-medium mb-1.5"
            >
              Website URL
            </label>
            <Input
              id="product-website"
              type="url"
              placeholder="https://example.com"
              className="h-11 rounded-xl"
              {...register("website")}
            />
            {errors.website && (
              <p className="text-destructive text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-github"
              className="block text-sm font-medium mb-1.5"
            >
              GitHub URL{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="product-github"
              type="url"
              placeholder="https://github.com/org/repo"
              className="h-11 rounded-xl"
              {...register("github")}
            />
            {errors.github && (
              <p className="text-destructive text-sm mt-1">
                {errors.github.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="product-documentation"
              className="block text-sm font-medium mb-1.5"
            >
              Documentation URL{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="product-documentation"
              type="url"
              placeholder="https://docs.example.com"
              className="h-11 rounded-xl"
              {...register("documentation")}
            />
            {errors.documentation && (
              <p className="text-destructive text-sm mt-1">
                {errors.documentation.message}
              </p>
            )}
          </div>
        </div>
        {errors.logo && (
          <p className="text-destructive text-sm mt-1">{errors.logo.message}</p>
        )}
      </div>

      <Button
        id="product-form-submit"
        type="submit"
        disabled={submitting}
        className="w-full h-11 text-sm font-semibold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl active:translate-y-px duration-150"
      >
        {submitting
          ? mode === "create"
            ? "Submitting…"
            : "Saving…"
          : mode === "create"
            ? "Submit tool"
            : "Save changes"}
      </Button>
    </form>
  );
}
