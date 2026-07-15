import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-16 md:py-24">
      <div className="max-w-lg space-y-8 text-center">
        {/* Status code */}
        <div className="space-y-6">
          <span className="text-8xl font-bold tracking-tighter text-muted-foreground/30 sm:text-9xl lg:text-[12rem] select-none">
            404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page not found
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="sm"
              className="w-full h-11 rounded-lg px-4 py-2 text-sm font-medium gap-2"
            >
              <Home className="size-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-11 rounded-lg px-4 py-2 text-sm font-medium gap-2"
            >
              <Search className="size-4" />
              Explore Tools
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
