"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  UsersIcon,
  CheckIcon,
  BanIcon,
  Trash2Icon,
  RotateCcwIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdminUser } from "@/lib/auth-utils";
import { useAdminUsers } from "@/features/users/hooks/useAdminUsers";
import {
  useApproveUserAccount,
  useSuspendUserAccount,
  useUnsuspendUserAccount,
  useDeleteUserAccount,
} from "@/features/users/hooks/useUserModeration";
import type { AccountStatus, AdminUser } from "@/features/users/types";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";

const PAGE_LIMIT = 10;

const STATUS_FILTERS: { label: string; value: AccountStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Deleted", value: "DELETED" },
];

type PendingAction = {
  user: AdminUser;
  kind: "approve" | "suspend" | "unsuspend" | "delete";
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

const ACTION_COPY: Record<
  PendingAction["kind"],
  { title: (name: string) => string; description: string; confirmLabel: string }
> = {
  approve: {
    title: (name) => `Approve ${name}?`,
    description: "They'll be able to submit products once approved.",
    confirmLabel: "Approve",
  },
  suspend: {
    title: (name) => `Suspend ${name}?`,
    description:
      "They can still log in, but won't be able to submit or edit products until reinstated.",
    confirmLabel: "Suspend",
  },
  unsuspend: {
    title: (name) => `Unsuspend ${name}?`,
    description: "Restores full approved access.",
    confirmLabel: "Unsuspend",
  },
  delete: {
    title: (name) => `Delete ${name}?`,
    description:
      'Their account is deactivated and personal info is scrubbed. Their existing products and reviews stay up, shown as posted by an anonymous "Deleted User". This can\'t be undone.',
    confirmLabel: "Delete",
  },
};

const STATUS_BADGE_VARIANT: Record<
  AccountStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  SUSPENDED: "secondary",
  DELETED: "destructive",
};

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-3 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-7 w-24 ml-auto" />
      </TableCell>
    </TableRow>
  );
}

type UserRowProps = {
  user: AdminUser;
  isSelf: boolean;
  isBusy: boolean;
  onApprove: () => void;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onDelete: () => void;
};

function UserRow({
  user,
  isSelf,
  isBusy,
  onApprove,
  onSuspend,
  onUnsuspend,
  onDelete,
}: UserRowProps) {
  const initials = (user.name ?? user.email ?? "?").slice(0, 2).toUpperCase();
  const isDeleted = user.accountStatus === "DELETED";

  return (
    <TableRow>
      {/* Name / Email */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name ?? "Unnamed user"}
              {isSelf && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (you)
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Status + role */}
      <TableCell>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={STATUS_BADGE_VARIANT[user.accountStatus]}
            className="capitalize"
          >
            {user.accountStatus}
          </Badge>
          {isAdminUser(user) && (
            <Badge variant="outline" className="text-xs">
              Admin
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Joined — hidden on small screens */}
      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        {!isDeleted && !isSelf && (
          <div className="flex items-center justify-end gap-1.5">
            {user.accountStatus === "PENDING" && (
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
      </TableCell>
    </TableRow>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AccountStatus | undefined>(undefined);
  const [keyword, setKeyword] = useState("");
  const [action, setAction] = useState<PendingAction | null>(null);

  const { data, isLoading, isError } = useAdminUsers({
    page,
    limit: PAGE_LIMIT,
    accountStatus: status,
    keyword: keyword || undefined,
  });

  const approveUser = useApproveUserAccount();
  const suspendUser = useSuspendUserAccount();
  const unsuspendUser = useUnsuspendUserAccount();
  const deleteUser = useDeleteUserAccount();

  const users = data?.data ?? [];
  const meta = data?.meta;
  const isMutating =
    approveUser.isPending ||
    suspendUser.isPending ||
    unsuspendUser.isPending ||
    deleteUser.isPending;

  async function handleConfirm() {
    if (!action) return;

    const mutation =
      action.kind === "approve"
        ? approveUser
        : action.kind === "suspend"
          ? suspendUser
          : action.kind === "unsuspend"
            ? unsuspendUser
            : deleteUser;

    try {
      await mutation.mutateAsync(action.user.id ?? "");
      toast.success(`${action.user.name ?? "User"} ${pastTense(action.kind)}`);
      setAction(null);
    } catch (error) {
      toast.error(
        errorMessage(error, "Something went wrong. Please try again."),
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          New sign-ups start as pending — approve them before they can submit
          products. Suspend or delete accounts as needed.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.label}
              id={`admin-users-filter-${filter.label.toLowerCase()}`}
              type="button"
              size="sm"
              variant={status === filter.value ? "default" : "outline"}
              onClick={() => {
                setStatus(filter.value);
                setPage(1);
              }}
              className={cn(status === filter.value && "pointer-events-none")}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Input
          id="admin-users-search"
          placeholder="Search name or email…"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      {isError ? (
        <EmptyState
          title="Couldn't load users"
          description="Something went wrong fetching the user list. Please try again."
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                  <UserRowSkeleton key={i} />
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="py-8">
                      <EmptyState
                        icon={<UsersIcon className="size-8" />}
                        title="No users found"
                        description="Try a different filter or search term."
                        className="border-none py-6"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isSelf={u.id === currentUser?.id}
                    isBusy={isMutating}
                    onApprove={() => setAction({ user: u, kind: "approve" })}
                    onSuspend={() => setAction({ user: u, kind: "suspend" })}
                    onUnsuspend={() =>
                      setAction({ user: u, kind: "unsuspend" })
                    }
                    onDelete={() => setAction({ user: u, kind: "delete" })}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      <ConfirmDialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
        title={
          action
            ? ACTION_COPY[action.kind].title(action.user.name ?? "this user")
            : ""
        }
        description={action ? ACTION_COPY[action.kind].description : undefined}
        confirmLabel={
          action ? ACTION_COPY[action.kind].confirmLabel : "Confirm"
        }
        isLoading={isMutating}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function pastTense(kind: PendingAction["kind"]): string {
  switch (kind) {
    case "approve":
      return "approved";
    case "suspend":
      return "suspended";
    case "unsuspend":
      return "unsuspended";
    case "delete":
      return "deleted";
  }
}
