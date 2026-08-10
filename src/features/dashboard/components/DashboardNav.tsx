"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  PackageIcon,
  StarIcon,
  BookmarkIcon,
  SettingsIcon,
  PackageSearchIcon,
  UsersIcon,
  FolderIcon,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdminUser } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  hideForAdmin?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboardIcon className="size-4 shrink-0" />,
  },
  {
    href: "/dashboard/products",
    label: "My Products",
    icon: <PackageIcon className="size-4 shrink-0" />,
    hideForAdmin: true,
  },
  {
    href: "/dashboard/reviews",
    label: "My Reviews",
    icon: <StarIcon className="size-4 shrink-0" />,
  },
  {
    href: "/dashboard/bookmarks",
    label: "My Bookmarks",
    icon: <BookmarkIcon className="size-4 shrink-0" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <SettingsIcon className="size-4 shrink-0" />,
  },
  // Admin-only
  {
    href: "/dashboard/pending",
    label: "Products",
    icon: <PackageSearchIcon className="size-4 shrink-0" />,
    adminOnly: true,
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: <UsersIcon className="size-4 shrink-0" />,
    adminOnly: true,
  },
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: <FolderIcon className="size-4 shrink-0" />,
    adminOnly: true,
  },
] as const;

type DashboardNavProps = {
  onNavigate?: () => void;
};

export function DashboardNav({ onNavigate }: DashboardNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = isAdminUser(user);

  const items = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.hideForAdmin && isAdmin) return false;
    return true;
  });

  const userItems = items.filter((i) => !i.adminOnly);
  const adminItems = items.filter((i) => i.adminOnly);

  function renderItem(item: NavItem) {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <nav className="flex flex-col gap-1 w-full">
      {userItems.map(renderItem)}

      {isAdmin && adminItems.length > 0 && (
        <>
          <div className="my-2 border-t border-border/60" />
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Admin
          </p>
          {adminItems.map(renderItem)}
        </>
      )}
    </nav>
  );
}
