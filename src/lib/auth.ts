"use client";

export const AUTH_CHANGE_EVENT = "stackpulse_auth_changed";

export function dispatchAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}
