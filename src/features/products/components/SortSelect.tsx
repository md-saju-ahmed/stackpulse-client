"use client";
import { ComboboxFilter } from "@/components/ui/combobox-filter";
import type { ProductSortField } from "../types";

export type SortValue = {
  sort: ProductSortField;
  order: "asc" | "desc";
};

const SORT_OPTIONS: { key: string; label: string; value: SortValue }[] = [
  {
    key: "newest",
    label: "Newest",
    value: { sort: "createdAt", order: "desc" },
  },
  {
    key: "rating",
    label: "Highest rated",
    value: { sort: "averageRating", order: "desc" },
  },
  {
    key: "reviews",
    label: "Most reviewed",
    value: { sort: "reviewCount", order: "desc" },
  },
  {
    key: "bookmarks",
    label: "Most bookmarked",
    value: { sort: "bookmarkCount", order: "desc" },
  },
];

function keyFor(value: SortValue): string {
  const match = SORT_OPTIONS.find(
    (option) =>
      option.value.sort === value.sort && option.value.order === value.order,
  );
  return match?.key ?? SORT_OPTIONS[0].key;
}

type SortSelectProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export function SortSelect({ value, onChange }: SortSelectProps) {
  const options = SORT_OPTIONS.map((opt) => ({
    value: opt.key,
    label: opt.label,
  }));

  return (
    <ComboboxFilter
      id="products-sort-select"
      value={keyFor(value)}
      onChange={(key) => {
        const option = SORT_OPTIONS.find((o) => o.key === key);
        if (option) onChange(option.value);
      }}
      options={options}
      placeholder="Sort by"
      className="w-full sm:w-42.5"
      buttonClassName="h-11 rounded-xl text-left"
    />
  );
}
