import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 md:px-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
