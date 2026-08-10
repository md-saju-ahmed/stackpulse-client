"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Zap } from "lucide-react";
import { loginSchema, type LoginSchema } from "@/validators/auth";
import { authService } from "../auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import { env } from "@/env";

export interface LoginPageProps {
  callbackUrl?: string;
}

export function LoginPage({ callbackUrl = "/dashboard" }: LoginPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    const result = await authService.login(values);

    if (result.error) {
      toast.error(result.error.message ?? "Login failed");
      return;
    }

    queryClient.clear();

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  async function handleDemoLogin() {
    setValue("email", env.NEXT_PUBLIC_DEMO_EMAIL);
    setValue("password", env.NEXT_PUBLIC_DEMO_PASSWORD);
    setIsDemoLoading(true);
    try {
      await onSubmit({
        email: env.NEXT_PUBLIC_DEMO_EMAIL,
        password: env.NEXT_PUBLIC_DEMO_PASSWORD,
      });
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-md w-full">
          <div className="bg-card border border-border rounded-xl p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-5 fill-primary-foreground" />
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to your StackPulse account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Mail size={16} />
                  </span>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="pl-10 h-11"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock size={16} />
                  </span>
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-11"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                id="login-submit"
                type="submit"
                disabled={isSubmitting || isDemoLoading}
                className="w-full h-11"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <Button
              id="login-demo"
              type="button"
              variant="secondary"
              disabled={isSubmitting || isDemoLoading}
              onClick={handleDemoLogin}
              className="w-full h-11 mt-3"
            >
              {isDemoLoading ? "Signing in…" : "Try demo account"}
            </Button>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
