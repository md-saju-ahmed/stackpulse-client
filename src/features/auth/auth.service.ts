"use client";
import { signIn, signUp, signOut, authClient } from "@/lib/auth";
import type { LoginInput, RegisterInput } from "./types";

export const authService = {
  async login(input: LoginInput) {
    const result = await signIn.email({
      email: input.email,
      password: input.password,
    });
    return result;
  },

  async register(input: RegisterInput) {
    const result = await signUp.email({
      email: input.email,
      password: input.password,
      name: input.name,
      image: input.image || undefined,
    });
    return result;
  },

  async logout() {
    await signOut();
  },

  async getToken() {
    return authClient.token();
  },
};
