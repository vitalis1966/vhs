import { ReactNode, useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (row: T) => any;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface Props<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onFilteredChange?: (rows: T[]) => void;
}

export function SortableFilterableTable<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "No records found.",
  onFilteredChange,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const accessorFor = (col: ColumnDef<T>) => col.accessor || ((row: any) => row[col.key]);

  const filtered = useMemo(() => {
    let rows = [...data];
    for (const col of columns) {
      const f = filters[col.key]?.toLowerCase().trim();
      if (!f) continue;
      rows = rows.filter((r) => {
        const v = accessorFor(col)(r);
        return String(v ?? "").toLowerCase().includes(f);
      });
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col) {
        const acc = accessorFor(col);
        rows.sort((a, b) => {
          const av = acc(a);
          const bv = acc(b);
          if (av == null && bv == null) return 0;
          if (av == null) return 1;
          if (bv == null) return -1;
          if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
          if (av instanceof Date && bv instanceof Date) {
            return sortDir === "asc" ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();
          }
          const as = String(av);
          const bs = String(bv);
          return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
        });
      }
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, filters, sortKey, sortDir]);

  useMemo(() => { onFilteredChange?.(filtered); }, [filtered, onFilteredChange]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={cn("align-top", col.headerClassName)}>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => col.sortable !== false && toggleSort(col.key)}
                      className={cn(
                        "flex items-center gap-1 text-left font-semibold text-foreground",
                        col.sortable !== false && "hover:text-primary cursor-pointer"
                      )}
                      disabled={col.sortable === false}
                    >
                      {col.header}
                      {col.sortable !== false && (
                        sortKey === col.key
                          ? sortDir === "asc"
                            ? <ArrowUp className="h-3 w-3" />
                            : <ArrowDown className="h-3 w-3" />
                          : <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                    {col.filterable !== false ? (
                      <Input
                        value={filters[col.key] || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, [col.key]: e.target.value }))}
                        placeholder="Filter…"
                        className="h-7 text-xs font-normal"
                      />
                    ) : (
                      <div className="h-7" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell ? col.cell(row) : String(accessorFor(col)(row) ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
