import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_DEMO_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_DEMO_EMAIL must be set to a valid email address"),
  NEXT_PUBLIC_DEMO_PASSWORD: z
    .string()
    .min(1, "NEXT_PUBLIC_DEMO_PASSWORD must be set (no default is provided)"),
});

function loadEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_DEMO_EMAIL: process.env.NEXT_PUBLIC_DEMO_EMAIL,
    NEXT_PUBLIC_DEMO_PASSWORD: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
  });

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid/missing environment variables:\n${details}\n\n` +
        `Set these in your environment before starting the app.`,
    );
  }

  return result.data;
}

export const env = loadEnv();
