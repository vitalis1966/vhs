import { useCallback, useMemo, useState } from "react";

export type SortDir = "asc" | "desc";
export type SortState<K extends string = string> = { key: K; dir: SortDir } | null;

export type FilterValue =
  | { kind: "text"; value: string }
  | { kind: "multi"; values: string[] }
  | { kind: "dateRange"; from: string; to: string }
  | { kind: "numberRange"; min: number | null; max: number | null };

export function isFilterActive(v: FilterValue | undefined): boolean {
  if (!v) return false;
  if (v.kind === "text") return v.value.trim().length > 0;
  if (v.kind === "multi") return v.values.length > 0;
  if (v.kind === "dateRange") return !!(v.from || v.to);
  if (v.kind === "numberRange") return v.min != null || v.max != null;
  return false;
}

export interface ColumnGetter<T> {
  // returns the value(s) to test against the filter
  filterValue?: (row: T) => string | string[] | number | Date | null | undefined;
  // returns value for sorting
  sortValue?: (row: T) => string | number | Date | null | undefined;
}

export type ColumnConfig<T, K extends string = string> = Partial<Record<K, ColumnGetter<T>>>;

export interface UseTableFiltersOptions<K extends string> {
  defaultSort?: SortState<K>;
}

export function useTableFilters<K extends string = string>(opts: UseTableFiltersOptions<K> = {}) {
  const [sort, setSort] = useState<SortState<K>>(opts.defaultSort ?? null);
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});

  const toggleSort = useCallback((key: K) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }, []);

  const setFilter = useCallback((key: K, value: FilterValue | undefined) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (!value || !isFilterActive(value)) delete next[key as string];
      else next[key as string] = value;
      return next;
    });
  }, []);

  const clearFilter = useCallback((key: K) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const apply = useCallback(
    <T,>(rows: T[], columns: ColumnConfig<T, K>): T[] => {
      let out = rows;

      // Filter
      const fEntries = Object.entries(filters);
      if (fEntries.length) {
        out = out.filter((row) => {
          for (const [key, fv] of fEntries) {
            const col = columns[key as K];
            const getter = col?.filterValue;
            if (!getter) continue;
            const raw = getter(row);
            if (fv.kind === "text") {
              const needle = fv.value.trim().toLowerCase();
              if (!needle) continue;
              const hay = String(raw ?? "").toLowerCase();
              if (!hay.includes(needle)) return false;
            } else if (fv.kind === "multi") {
              if (!fv.values.length) continue;
              if (Array.isArray(raw)) {
                if (!raw.some((v) => fv.values.includes(String(v)))) return false;
              } else {
                if (!fv.values.includes(String(raw ?? ""))) return false;
              }
            } else if (fv.kind === "dateRange") {
              if (!fv.from && !fv.to) continue;
              if (raw == null) return false;
              const t = raw instanceof Date ? raw.getTime() : new Date(String(raw)).getTime();
              if (Number.isNaN(t)) return false;
              if (fv.from) {
                const f = new Date(`${fv.from}T00:00:00`).getTime();
                if (t < f) return false;
              }
              if (fv.to) {
                const to = new Date(`${fv.to}T23:59:59`).getTime();
                if (t > to) return false;
              }
            } else if (fv.kind === "numberRange") {
              const n = typeof raw === "number" ? raw : Number(raw);
              if (Number.isNaN(n)) return false;
              if (fv.min != null && n < fv.min) return false;
              if (fv.max != null && n > fv.max) return false;
            }
          }
          return true;
        });
      }

      // Sort
      if (sort) {
        const col = columns[sort.key];
        const getter = col?.sortValue ?? col?.filterValue;
        if (getter) {
          const dir = sort.dir === "asc" ? 1 : -1;
          out = [...out].sort((a, b) => {
            const va = getter(a as any);
            const vb = getter(b as any);
            const aNull = va == null || va === "";
            const bNull = vb == null || vb === "";
            if (aNull && bNull) return 0;
            if (aNull) return 1; // nulls last
            if (bNull) return -1;
            let av: number | string = va as any;
            let bv: number | string = vb as any;
            if (va instanceof Date) av = va.getTime();
            if (vb instanceof Date) bv = vb.getTime();
            if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
            return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
          });
        }
      }

      return out;
    },
    [filters, sort],
  );

  const state = useMemo(() => ({ sort, filters }), [sort, filters]);

  return { sort, filters, toggleSort, setFilter, clearFilter, apply, state };
}
