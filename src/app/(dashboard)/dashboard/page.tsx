"use client";
import Link from "next/link";
import {
  BookmarkIcon,
  PackageIcon,
  StarIcon,
  UsersIcon,
  FolderIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import { useAdminOverview } from "@/features/dashboard/hooks/useAdminOverview";
import {
  StatCard,
  StatCardSkeleton,
} from "@/features/dashboard/components/StatCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Query 1: Personal dashboard overview
  const {
    data: userOverviewData,
    isLoading: userLoading,
    isError: userError,
  } = useDashboardOverview();
  const userOverview = userOverviewData?.data;

  // Query 2: Platform overview (runs only if user is admin)
  const {
    data: adminOverviewData,
    isLoading: adminLoading,
    isError: adminError,
  } = useAdminOverview();
  const adminOverview = adminOverviewData?.data;

  // Set up chart data for admin views
  const productChartData = adminOverview
    ? [
        {
          name: "Published",
          count: adminOverview.products.published,
          color: "var(--color-primary)",
        },
        {
          name: "Pending",
          count: adminOverview.products.pending,
          color: "oklch(0.645 0.246 16.439)",
        },
        {
          name: "Rejected",
          count: adminOverview.products.rejected,
          color: "var(--color-destructive)",
        },
      ]
    : [];

  const userChartData = adminOverview
    ? [
        {
          name: "Approved",
          count: adminOverview.users.approved,
          color: "var(--color-primary)",
        },
        {
          name: "Pending",
          count: adminOverview.users.pending,
          color: "oklch(0.645 0.246 16.439)",
        },
        {
          name: "Suspended",
          count: adminOverview.users.suspended,
          color: "oklch(0.556 0 0)",
        },
        {
          name: "Deleted",
          count: adminOverview.users.deleted,
          color: "var(--color-destructive)",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin
              ? "A summary of your personal activity and real-time platform statistics."
              : "A summary of your workspace activity and dashboard updates."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/products/submit">
            <Button id="dashboard-submit-product" size="sm" className="h-9">
              Submit a tool
            </Button>
          </Link>
        </div>
      </div>

      {/* USER STATS SECTION */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Your Stats
        </h2>
        {userError ? (
          <EmptyState
            title="Couldn't load your stats"
            description="Something went wrong fetching your dashboard. Please try again."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {userLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Products submitted"
                  value={userOverview?.totalProducts ?? 0}
                  icon={<PackageIcon className="size-4" />}
                />
                <StatCard
                  label="Reviews written"
                  value={userOverview?.totalReviews ?? 0}
                  icon={<StarIcon className="size-4" />}
                />
                <StatCard
                  label="Bookmarks saved"
                  value={userOverview?.totalBookmarks ?? 0}
                  icon={<BookmarkIcon className="size-4" />}
                />
              </>
            )}
          </div>
        )}
      </section>

      {/* ADMIN PLATFORM STATISTICS SECTION */}
      {isAdmin && (
        <>
          <Separator />

          <section className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Platform Overview
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time metrics and charts monitoring StackPulse assets,
                users, and content status.
              </p>
            </div>

            {adminError ? (
              <EmptyState
                title="Couldn't load platform stats"
                description="Something went wrong fetching the overview. Please try again."
              />
            ) : adminLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="h-64 rounded-xl border bg-muted animate-pulse" />
                  <div className="h-64 rounded-xl border bg-muted animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Stat Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Total users"
                    value={adminOverview?.users.total ?? 0}
                    icon={<UsersIcon className="size-4" />}
                  />
                  <StatCard
                    label="Total products"
                    value={adminOverview?.products.total ?? 0}
                    icon={<PackageIcon className="size-4" />}
                  />
                  <StatCard
                    label="Platform reviews"
                    value={adminOverview?.totalReviews ?? 0}
                    icon={<StarIcon className="size-4" />}
                  />
                  <StatCard
                    label="Total categories"
                    value={adminOverview?.totalCategories ?? 0}
                    icon={<FolderIcon className="size-4" />}
                  />
                </div>

                {/* Recharts Graphs */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Products Status Chart */}
                  <Card className="rounded-xl border bg-card">
                    <CardHeader className="p-5 pb-0">
                      <CardTitle className="text-base font-semibold">
                        Product Submissions
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Distribution by publication status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={productChartData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="oklch(0.922 0 0 / 40%)"
                            />
                            <XAxis
                              dataKey="name"
                              stroke="var(--color-muted-foreground)"
                              fontSize={11}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="var(--color-muted-foreground)"
                              fontSize={11}
                              tickLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "var(--color-popover)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {productChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Users Status Chart */}
                  <Card className="rounded-xl border bg-card">
                    <CardHeader className="p-5 pb-0">
                      <CardTitle className="text-base font-semibold">
                        User Account Status
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Distribution by account states
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <div className="h-60 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={userChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="count"
                            >
                              {userChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "var(--color-popover)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => (
                                <span className="text-xs text-muted-foreground">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* DASHBOARD BOTTOM INFO */}
      <div className="rounded-xl border border-dashed p-5 bg-muted/10">
        <p className="text-sm text-muted-foreground">
          Manage the developer tools you&apos;ve submitted from your{" "}
          <Link
            href="/dashboard/products"
            className="font-semibold text-primary hover:underline underline-offset-2"
          >
            My products
          </Link>{" "}
          tab.
        </p>
      </div>
    </div>
  );
}
