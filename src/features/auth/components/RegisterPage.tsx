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
