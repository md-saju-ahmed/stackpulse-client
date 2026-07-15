import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "../types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`} className="block">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader className="flex-row items-center gap-3">
          {category.icon && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
              {category.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle>{category.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {category.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">
            {category.productCount} tool{category.productCount === 1 ? "" : "s"}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
