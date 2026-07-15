import type { Metadata } from "next";
import { AdminGuard } from "@/components/AdminGuard";

export const metadata: Metadata = {
  title: "Admin — StackPulse",
};

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
