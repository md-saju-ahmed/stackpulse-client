"use client";
import { api } from "@/lib/api";
import { dispatchAuthChange } from "@/lib/auth";
import type { AuthUser, LoginInput, RegisterInput } from "./types";

type AuthResponse = {
  user: AuthUser;
};

export const authService = {
  async login(input: LoginInput) {
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", input);
      dispatchAuthChange();
      return { data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      return { data: null, error: { message } };
    }
  },

  async register(input: RegisterInput) {
    try {
      const { data } = await api.post<AuthResponse>(
        "/api/auth/register",
        input,
      );
      dispatchAuthChange();
      return { data, error: null };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      return { data: null, error: { message } };
    }
  },

  async logout() {
    try {
      await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      dispatchAuthChange();
    }
  },
};
