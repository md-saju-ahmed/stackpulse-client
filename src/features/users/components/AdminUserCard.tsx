import { formatDistanceToNow } from "date-fns";
import { CheckIcon, BanIcon, Trash2Icon, RotateCcwIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdminUser } from "@/lib/auth-utils";
import type { AdminUser } from "../types";

type AdminUserCardProps = {
  user: AdminUser;
  isSelf: boolean;
  onApprove: () => void;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onDelete: () => void;
  isBusy?: boolean;
};

const STATUS_BADGE_VARIANT: Record<
  AdminUser["accountStatus"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  SUSPENDED: "secondary",
  DELETED: "destructive",
};

export function AdminUserCard({
  user,
  isSelf,
  onApprove,
  onSuspend,
  onUnsuspend,
  onDelete,
  isBusy,
}: AdminUserCardProps) {
  const initials = (user.name ?? user.email ?? "?").slice(0, 2).toUpperCase();
  const isDeleted = user.accountStatus === "DELETED";

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <div
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-medium">
            {user.name ?? "Unnamed user"}
            {isSelf && (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (you)
              </span>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={STATUS_BADGE_VARIANT[user.accountStatus]}>
            {user.accountStatus}
          </Badge>
          {isAdminUser(user) && <Badge variant="outline">Admin</Badge>}
          <span className="text-xs text-muted-foreground">
            Joined{" "}
            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
          </span>
        </div>

        {!isDeleted && !isSelf && (
          <div className="flex items-center gap-2">
            {(user.accountStatus === "PENDING" ||
              user.accountStatus === "SUSPENDED") && (
              <Button
                id={`admin-user-approve-${user.id}`}
                variant="default"
                size="sm"
                disabled={isBusy}
                onClick={onApprove}
              >
                <CheckIcon />
                Approve
              </Button>
            )}
            {user.accountStatus === "APPROVED" && (
              <Button
                id={`admin-user-suspend-${user.id}`}
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={onSuspend}
              >
                <BanIcon />
                Suspend
              </Button>
            )}
            {user.accountStatus === "SUSPENDED" && (
              <Button
                id={`admin-user-unsuspend-${user.id}`}
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={onUnsuspend}
              >
                <RotateCcwIcon />
                Unsuspend
              </Button>
            )}
            <Button
              id={`admin-user-delete-${user.id}`}
              variant="destructive"
              size="sm"
              disabled={isBusy}
              onClick={onDelete}
            >
              <Trash2Icon />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type AdminUserCardSkeletonProps = {
  count?: number;
};

export function AdminUserCardSkeleton({
  count = 4,
}: AdminUserCardSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
