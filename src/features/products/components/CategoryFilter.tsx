"use client";
import { ComboboxFilter } from "@/components/ui/combobox-filter";
import { useCategories } from "@/features/categories/hooks/useCategories";

const ALL_CATEGORIES = "all";

type CategoryFilterProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data } = useCategories({ limit: 100, sort: "name", order: "asc" });
  const categories = data?.data ?? [];

  const options = [
    { value: ALL_CATEGORIES, label: "All categories" },
    ...categories.map((category) => ({
      value: category.slug,
      label: category.name,
    })),
  ];

  return (
    <ComboboxFilter
      id="products-category-filter"
      value={value ?? ALL_CATEGORIES}
      onChange={(next) => onChange(next === ALL_CATEGORIES ? undefined : next)}
      options={options}
      placeholder="All categories"
      searchPlaceholder="Search categories..."
      showSearch
      className="w-full sm:w-45"
      buttonClassName="h-11 rounded-xl text-left"
    />
  );
}
