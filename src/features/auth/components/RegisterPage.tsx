"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ImageIcon, Zap } from "lucide-react";
import { registerSchema, type RegisterSchema } from "@/validators/auth";
import { authService } from "../auth.service";
import { authClient } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

export interface RegisterPageProps {
  callbackUrl?: string;
}

export function RegisterPage({
  callbackUrl = "/dashboard",
}: RegisterPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
    },
  });

  async function onSubmit(values: RegisterSchema) {
    const result = await authService.register({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image || undefined,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Registration failed");
      return;
    }

    queryClient.clear();

    toast.success("Account created! Welcome to StackPulse.");
    router.push(callbackUrl);
    router.refresh();
  }

  const handleGoogleSignin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign in with Google");
    }
  };

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
                Create an account
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Join StackPulse developer directory
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User size={16} />
                  </span>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="pl-10 h-11"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Mail size={16} />
                  </span>
                  <Input
                    id="register-email"
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
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock size={16} />
                  </span>
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

              {/* Profile Photo URL */}
              <div>
                <label
                  htmlFor="register-image"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Profile Photo URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <ImageIcon size={16} />
                  </span>
                  <Input
                    id="register-image"
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-10 h-11"
                    {...register("image")}
                  />
                </div>
                {errors.image && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <Button
                id="register-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleGoogleSignin}
              className="w-full h-11"
            >
              <svg
                className="mr-2 size-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
