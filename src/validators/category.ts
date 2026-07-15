import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  icon: z
    .string()
    .trim()
    .max(50, "Icon must be at most 50 characters")
    .optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
