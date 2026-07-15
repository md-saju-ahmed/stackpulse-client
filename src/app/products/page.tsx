"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearchIcon } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/features/products/components/ProductGrid";
import { SearchBar } from "@/features/products/components/SearchBar";
import { CategoryFilter } from "@/features/products/components/CategoryFilter";
import { PricingFilter } from "@/features/products/components/PricingFilter";
import {
  SortSelect,
  type SortValue,
} from "@/features/products/components/SortSelect";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProductPricing } from "@/features/products/types";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";

const PAGE_LIMIT = 12;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  // Supports deep links from the Categories page (/products?category=<slug>).
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | undefined>(
    searchParams.get("category") ?? undefined,
  );
  const [pricing, setPricing] = useState<ProductPricing | undefined>(undefined);
  const [sortValue, setSortValue] = useState<SortValue>({
    sort: "createdAt",
    order: "desc",
  });
  const [page, setPage] = useState(1);
  const debouncedKeyword = useDebounce(keyword, 400);

  const { data, isLoading, isError } = useProducts({
    page,
    limit: PAGE_LIMIT,
    keyword: debouncedKeyword || undefined,
    category,
    pricing,
    sort: sortValue.sort,
    order: sortValue.order,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <Container className="py-10 space-y-8">
      <SectionTitle
        title="Explore tools"
        description="Browse developer tools, libraries, and frameworks from the community."
        align="left"
        className="mb-6"
      />

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full">
        <SearchBar
          value={keyword}
          onChange={(value) => {
            setKeyword(value);
            resetToFirstPage();
          }}
        />
        <CategoryFilter
          value={category}
          onChange={(value) => {
            setCategory(value);
            resetToFirstPage();
          }}
        />
        <PricingFilter
          value={pricing}
          onChange={(value) => {
            setPricing(value);
            resetToFirstPage();
          }}
        />
        <SortSelect
          value={sortValue}
          onChange={(value) => {
            setSortValue(value);
            resetToFirstPage();
          }}
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={PAGE_LIMIT} />
      ) : isError ? (
        <EmptyState
          title="Couldn't load tools"
          description="Something went wrong fetching products. Please try again."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<PackageSearchIcon className="size-8" />}
          title="No tools found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <ProductGrid products={products} />
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={PAGE_LIMIT} />}>
      <ProductsPageContent />
    </Suspense>
  );
}
