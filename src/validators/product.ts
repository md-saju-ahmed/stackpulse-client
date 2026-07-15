import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: "Enter a valid URL",
  });

export const PRODUCT_PRICING_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Paid" },
  { value: "OPEN_SOURCE", label: "Open source" },
] as const;

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  tagline: z
    .string()
    .trim()
    .min(10, "Tagline must be at least 10 characters")
    .max(120, "Tagline must be at most 120 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters"),
  logo: optionalUrl,
  website: z.string().trim().url("Website must be a valid URL"),
  github: optionalUrl,
  documentation: optionalUrl,
  category: z.string().trim().min(1, "Select a category"),
  tags: z.string().trim().optional(),
  pricing: z.enum(["FREE", "FREEMIUM", "PAID", "OPEN_SOURCE"], {
    message: "Select a pricing model",
  }),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
