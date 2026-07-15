"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  BookmarkIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Zap,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/auth.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container from "@/components/layout/Container";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    href: "/products",
    label: "Explore",
  },
  {
    href: "/categories",
    label: "Categories",
  },
];

export function Navbar() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await authService.logout();
    queryClient.clear();
    setMobileOpen(false);
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getAvatarUrl(name: string) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Container className="flex h-18 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />

            <SheetContent side="left" className="flex flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-bold text-lg"
                  >
                    <Zap className="size-5" />
                    <span>StackPulse</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <Separator />

              {/* Navigation links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center",
                      pathname.startsWith(link.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Separator />

              <div className="flex-1">
                {isLoading ? null : isAuthenticated && user ? (
                  <div className="flex flex-col gap-2">
                    {/* Dashboard link */}
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname.startsWith("/dashboard")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <LayoutDashboard className="size-4" />
                      My Dashboard
                    </Link>

                    {/* Submit a tool */}
                    <Link
                      href="/products/submit"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 h-11 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Plus className="size-4" />
                      Submit a tool
                    </Link>

                    {/* Bookmarks */}
                    <Link
                      href="/dashboard/bookmarks"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname.startsWith("/dashboard/bookmarks")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <BookmarkIcon className="size-4" />
                      Bookmarks
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 h-11 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 w-full text-left cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-lg px-3 py-2 text-sm font-medium"
                        size="sm"
                      >
                        Sign in
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full"
                    >
                      <Button
                        className="w-full h-11 rounded-lg px-3 py-2 text-sm font-medium"
                        size="sm"
                      >
                        Get started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="size-5" />
            <span className="hidden sm:inline">StackPulse</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center",
                  pathname.startsWith(link.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="size-11 animate-pulse rounded-full bg-muted" />
              <div className="hidden h-4 w-20 animate-pulse rounded bg-muted sm:block" />
            </div>
          ) : isAuthenticated && user ? (
            <>
              {/* Dashboard link */}
              <Link
                href="/dashboard"
                className={cn(
                  "hidden h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:inline-flex items-center",
                  pathname.startsWith("/dashboard")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                Dashboard
              </Link>

              {/* Submit button */}
              <Link href="/products/submit" className="hidden sm:block">
                <Button
                  id="navbar-submit-product"
                  variant="default"
                  size="sm"
                  className="h-11 rounded-lg px-3 py-2 text-sm font-medium border-0"
                >
                  Submit a tool
                </Button>
              </Link>

              {/* User dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="flex items-center gap-2 h-11 rounded-lg px-3 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar size="sm">
                    <AvatarImage
                      src={user.image || getAvatarUrl(user.name)}
                      alt={user.name}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56"
                >
                  {/* User info header with avatar */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="shrink-0">
                          <AvatarImage
                            src={user.image || getAvatarUrl(user.name)}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5 min-w-0">
                          <p className="text-sm font-medium leading-none truncate">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  {/* Navigation items */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      render={<Link href="/dashboard" />}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/dashboard/bookmarks" />}
                      className="cursor-pointer"
                    >
                      <BookmarkIcon className="mr-2 size-4" />
                      Bookmarks
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  {/* Logout */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block">
                <Button
                  id="navbar-login"
                  variant="outline"
                  size="sm"
                  className="h-11 rounded-lg px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button
                  id="navbar-register"
                  size="sm"
                  className="h-11 rounded-lg px-3 py-2 text-sm font-medium"
                >
                  Get started
                </Button>
              </Link>
              {/* Mobile-only compact register */}
              <Link href="/register" className="sm:hidden">
                <Button
                  id="navbar-register-mobile"
                  size="sm"
                  className="h-11 rounded-lg px-3 py-2 text-sm font-medium"
                >
                  Start
                </Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
}
