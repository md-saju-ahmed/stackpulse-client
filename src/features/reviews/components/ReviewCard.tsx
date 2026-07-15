import type { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@/features/users/hooks/useUser";
import type { Review } from "../types";

type ReviewCardProps = {
  review: Review;
  actions?: ReactNode;
};

export function ReviewCard({ review, actions }: ReviewCardProps) {
  const { data, isLoading } = useUser(review.userId);
  const user = data?.data;

  const displayName = isLoading ? "Loading..." : user?.name || "Anonymous User";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : review.userId.slice(0, 2).toUpperCase();

  const avatarUrl = user?.image;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="size-8 rounded-full object-cover shrink-0 border border-border"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
            >
              {initials}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {displayName}
              </span>
              <StarRating value={review.rating} readOnly size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        {actions}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {review.title && (
          <p className="font-heading text-sm font-medium">{review.title}</p>
        )}
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {review.body}
        </p>
      </CardContent>
    </Card>
  );
}
