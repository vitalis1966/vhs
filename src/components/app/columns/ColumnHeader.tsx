import { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FilterValue, SortState } from "./useTableFilters";
import { isFilterActive } from "./useTableFilters";

interface Props {
  label: string;
  columnKey: string;
  sort: SortState;
  onToggleSort?: (key: string) => void;
  sortable?: boolean;
  filterValue?: FilterValue;
  renderFilter?: (value: FilterValue | undefined, onChange: (v: FilterValue | undefined) => void) => ReactNode;
  onFilterChange?: (key: string, value: FilterValue | undefined) => void;
  align?: "left" | "right" | "center";
  className?: string;
}

export function ColumnHeader({
  label,
  columnKey,
  sort,
  onToggleSort,
  sortable = true,
  filterValue,
  renderFilter,
  onFilterChange,
  align = "left",
  className,
}: Props) {
  const active = sort && sort.key === columnKey;
  const Icon = active ? (sort!.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  const filterActive = isFilterActive(filterValue);

  const justify = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={cn("inline-flex items-center gap-0.5", justify, className)}>
      {sortable && onToggleSort ? (
        <button
          type="button"
          onClick={() => onToggleSort(columnKey)}
          className={cn(
            "inline-flex items-center gap-1 px-1 py-0.5 -mx-1 rounded text-xs font-medium uppercase tracking-wide hover:bg-muted transition-colors",
            active ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span>{label}</span>
          <Icon className={cn("h-3 w-3", active ? "opacity-100" : "opacity-50")} />
        </button>
      ) : (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground px-1">{label}</span>
      )}

      {renderFilter && onFilterChange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-6 w-6 relative", filterActive && "text-primary")}
              aria-label={`Filter ${label}`}
            >
              <Filter className="h-3 w-3" />
              {filterActive && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-2 w-auto">
            {renderFilter(filterValue, (v) => onFilterChange(columnKey, v))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
