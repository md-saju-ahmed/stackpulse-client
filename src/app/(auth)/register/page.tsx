import { RegisterPage } from "@/features/auth/components/RegisterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — StackPulse",
  description: "Create a free StackPulse account.",
};

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function RegisterPageRoute({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams.callbackUrl || "/dashboard";

  return <RegisterPage callbackUrl={callbackUrl} />;
}
