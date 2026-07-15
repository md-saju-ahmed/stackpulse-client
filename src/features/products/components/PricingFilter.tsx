"use client";
import { ComboboxFilter } from "@/components/ui/combobox-filter";
import type { ProductPricing } from "../types";

const ALL_PRICING = "all";

const PRICING_OPTIONS: { value: ProductPricing; label: string }[] = [
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Paid" },
  { value: "OPEN_SOURCE", label: "Open source" },
];

type PricingFilterProps = {
  value: ProductPricing | undefined;
  onChange: (value: ProductPricing | undefined) => void;
};

export function PricingFilter({ value, onChange }: PricingFilterProps) {
  const options = [
    { value: ALL_PRICING, label: "All pricing" },
    ...PRICING_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  return (
    <ComboboxFilter
      id="products-pricing-filter"
      value={value ?? ALL_PRICING}
      onChange={(next) =>
        onChange(next === ALL_PRICING ? undefined : (next as ProductPricing))
      }
      options={options}
      placeholder="All pricing"
      className="w-full sm:w-40"
      buttonClassName="h-11 rounded-xl text-left"
    />
  );
}
