"use client";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { BookmarkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggleBookmark } from "../hooks/useToggleBookmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  slug: string;
  size?: "sm" | "default";
  className?: string;
};

export function BookmarkButton({
  slug,
  size = "default",
  className,
}: BookmarkButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isBookmarked, isPending, toggle } = useToggleBookmark(slug);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Sign in to bookmark tools");
      router.push(`/login?callbackUrl=/products/${slug}`);
      return;
    }

    toggle();
  }

  return (
    <Button
      id={`bookmark-toggle-${slug}`}
      type="button"
      variant={isBookmarked ? "secondary" : "outline"}
      size={size === "sm" ? "icon-sm" : "icon"}
      disabled={isPending}
      onClick={handleClick}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(className)}
    >
      <BookmarkIcon className={cn(isBookmarked && "fill-current")} />
    </Button>
  );
}
