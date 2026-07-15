import { z } from "zod";

export const profileFormSchema = z
  .object({
    name: z.union([z.literal(""), z.string().trim().min(2).max(60)]).optional(),
    bio: z.union([z.literal(""), z.string().trim().max(500)]).optional(),
    image: z
      .union([z.literal(""), z.string().trim().url("Must be a valid URL")])
      .optional(),
    websiteUrl: z
      .union([z.literal(""), z.string().trim().url("Must be a valid URL")])
      .optional(),
    location: z.union([z.literal(""), z.string().trim().max(100)]).optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value && value.length > 0),
    { message: "Fill in at least one field before saving", path: ["name"] },
  );

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
