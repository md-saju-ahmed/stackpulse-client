"use client";
import { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "default";
  className?: string;
};

export function StarRating({
  value,
  onChange,
  readOnly = true,
  size = "default",
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;
  const starSize = size === "sm" ? "size-3.5" : "size-4.5";

  return (
    <div
      data-slot="star-rating"
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue);

        if (readOnly) {
          return (
            <StarIcon
              key={star}
              className={cn(
                starSize,
                filled
                  ? "fill-current text-foreground"
                  : "text-muted-foreground/40",
              )}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange?.(star)}
            className="outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
          >
            <StarIcon
              className={cn(
                starSize,
                filled
                  ? "fill-current text-foreground"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
