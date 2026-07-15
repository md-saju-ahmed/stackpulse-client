import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/features/products/types";

const STATUS_STYLES: Record<ProductStatus, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  PUBLISHED:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  REJECTED: "bg-destructive/10 text-destructive dark:bg-destructive/20",
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  PENDING: "Pending",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

type StatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
