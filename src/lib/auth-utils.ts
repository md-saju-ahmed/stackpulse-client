export function isAdminUser(
  user: { role?: string | null } | null | undefined,
): boolean {
  return user?.role?.toUpperCase() === "ADMIN";
}

export function isAdminRole(role: string | null | undefined): boolean {
  return role?.toUpperCase() === "ADMIN";
}
