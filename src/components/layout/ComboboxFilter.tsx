"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxFilterProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: LucideIcon;
  width?: string;
  contentWidth?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export default function ComboboxFilter({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  width = "w-full sm:w-44",
  contentWidth = "w-[200px]",
  searchable = false,
  searchPlaceholder = "Search...",
}: ComboboxFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const isDefault = !selectedOption || selectedOption.value === "all";

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(width, "justify-between bg-muted/10 font-normal")}
        >
          <div className="flex items-center gap-2 truncate">
            {Icon && (
              <Icon size={16} className="shrink-0 text-muted-foreground" />
            )}

            <span className={cn(isDefault && "text-muted-foreground")}>
              {selectedOption?.label ?? placeholder}
            </span>
          </div>

          <ChevronsUpDown size={14} className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className={cn(contentWidth, "p-0")}>
        <Command>
          {searchable && <CommandInput placeholder={searchPlaceholder} />}

          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    size={16}
                    className={cn(
                      "mr-2 transition-opacity",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />

                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
