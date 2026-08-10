import { PencilIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "../types";

type CategoryTableProps = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex-row items-center gap-3">
            {category.icon && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                {category.icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-medium">
                {category.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {category.description}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary">
              {category.productCount} tool
              {category.productCount === 1 ? "" : "s"}
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                id={`category-edit-${category.slug}`}
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <PencilIcon />
                Edit
              </Button>
              <Button
                id={`category-delete-${category.slug}`}
                variant="destructive"
                size="sm"
                onClick={() => onDelete(category)}
              >
                <TrashIcon />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type CategoryTableSkeletonProps = {
  count?: number;
};

export function CategoryTableSkeleton({
  count = 4,
}: CategoryTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
