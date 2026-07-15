"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Option {
  value: string;
  label: string;
}

interface ComboboxFilterProps {
  id?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  className?: string;
  buttonClassName?: string;
}

export function ComboboxFilter({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  showSearch = false,
  className,
  buttonClassName,
}: ComboboxFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = showSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left w-full", className)}>
      <Button
        id={id}
        type="button"
        variant="outline"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
          buttonClassName
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-full min-w-[200px] rounded-lg border border-border bg-popover text-popover-foreground shadow-md outline-hidden animate-in fade-in-0 slide-in-from-top-1 duration-100">
          {showSearch && (
            <div className="flex items-center border-b px-2.5 py-2">
              <Search className="mr-2 size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-muted-foreground outline-hidden"
              />
            </div>
          )}

          <ul className="max-h-60 overflow-y-auto p-1 text-sm">
            {filteredOptions.length === 0 ? (
              <li className="px-2.5 py-1.5 text-xs text-muted-foreground">No options found.</li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground",
                      isSelected && "font-medium text-foreground bg-accent/50"
                    )}
                  >
                    <span className="absolute left-2.5 flex size-3.5 items-center justify-center">
                      {isSelected && <Check className="size-3.5" />}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
