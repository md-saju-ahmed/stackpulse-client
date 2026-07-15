import { LoginPage } from "@/features/auth/components/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — StackPulse",
  description: "Sign in to your StackPulse account.",
};

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPageRoute({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams.callbackUrl || "/dashboard";

  return <LoginPage callbackUrl={callbackUrl} />;
}
