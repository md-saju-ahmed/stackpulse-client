"use client";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardNav } from "@/features/dashboard/components/DashboardNav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Container from "@/components/layout/Container";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Container className="min-h-screen flex flex-col lg:flex-row px-0 md:px-0">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 border-r border-border/60 bg-card/30 min-h-screen sticky top-0 self-start h-screen overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 pt-6 h-full">
          <div>
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Dashboard
            </p>
            <DashboardNav />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center gap-3 border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40 px-4 py-3">
        <Button
          id="dashboard-mobile-menu"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </Button>
        <span className="font-heading text-sm font-semibold text-foreground">
          Dashboard
        </span>
      </header>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-4 pt-5 pb-3 border-b border-border/60">
            <SheetTitle>Dashboard</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <DashboardNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 max-w-4xl">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </Container>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
}
