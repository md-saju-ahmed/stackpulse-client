import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Select a rating").max(5, "Select a rating"),
  title: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (val.length >= 2 && val.length <= 120), {
      message: "Title must be between 2 and 120 characters",
    }),
  body: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review must be at most 2000 characters"),
});

export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;
