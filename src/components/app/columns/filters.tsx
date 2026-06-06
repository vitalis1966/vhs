import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { FilterValue } from "./useTableFilters";

export function TextFilter({
  value,
  onChange,
  placeholder = "Filter…",
}: {
  value?: FilterValue;
  onChange: (v: FilterValue | undefined) => void;
  placeholder?: string;
}) {
  const text = value?.kind === "text" ? value.value : "";
  return (
    <div className="space-y-2 w-56">
      <Input
        autoFocus
        className="h-8"
        placeholder={placeholder}
        value={text}
        onChange={(e) => onChange({ kind: "text", value: e.target.value })}
      />
      {text && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onChange(undefined)}>
          Clear
        </Button>
      )}
    </div>
  );
}

export function MultiSelectFilter({
  value,
  onChange,
  options,
}: {
  value?: FilterValue;
  onChange: (v: FilterValue | undefined) => void;
  options: { value: string; label: string }[];
}) {
  const selected = value?.kind === "multi" ? value.values : [];
  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
    onChange(next.length ? { kind: "multi", values: next } : undefined);
  };
  return (
    <div className="w-60 space-y-2">
      <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
        {options.length === 0 ? (
          <div className="text-xs text-muted-foreground italic px-1">No options</div>
        ) : (
          options.map((o) => {
            const checked = selected.includes(o.value);
            return (
              <label
                key={o.value}
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-muted cursor-pointer ${checked ? "bg-muted" : ""}`}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(o.value)} />
                <span className="truncate">{o.label}</span>
              </label>
            );
          })
        )}
      </div>
      {selected.length > 0 && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs w-full justify-start" onClick={() => onChange(undefined)}>
          Clear ({selected.length})
        </Button>
      )}
    </div>
  );
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value?: FilterValue;
  onChange: (v: FilterValue | undefined) => void;
}) {
  const from = value?.kind === "dateRange" ? value.from : "";
  const to = value?.kind === "dateRange" ? value.to : "";
  const update = (next: { from: string; to: string }) => {
    if (!next.from && !next.to) onChange(undefined);
    else onChange({ kind: "dateRange", from: next.from, to: next.to });
  };
  return (
    <div className="w-60 space-y-2">
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">From</label>
        <Input type="date" className="h-8" value={from} onChange={(e) => update({ from: e.target.value, to })} />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">To</label>
        <Input type="date" className="h-8" value={to} onChange={(e) => update({ from, to: e.target.value })} />
      </div>
      {(from || to) && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs w-full justify-start" onClick={() => onChange(undefined)}>
          Clear
        </Button>
      )}
    </div>
  );
}

export function NumberRangeFilter({
  value,
  onChange,
  unit = "",
  scale = 1,
}: {
  value?: FilterValue;
  onChange: (v: FilterValue | undefined) => void;
  unit?: string;
  // Multiplier applied to UI numbers to produce storage values (e.g. minutes → seconds = 60)
  scale?: number;
}) {
  const cur = value?.kind === "numberRange" ? value : { min: null as number | null, max: null as number | null };
  const minUi = cur.min != null ? String(cur.min / scale) : "";
  const maxUi = cur.max != null ? String(cur.max / scale) : "";
  const update = (minStr: string, maxStr: string) => {
    const min = minStr === "" ? null : Number(minStr) * scale;
    const max = maxStr === "" ? null : Number(maxStr) * scale;
    if (min == null && max == null) onChange(undefined);
    else onChange({ kind: "numberRange", min, max });
  };
  return (
    <div className="w-60 space-y-2">
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Min {unit}</label>
        <Input type="number" className="h-8" value={minUi} onChange={(e) => update(e.target.value, maxUi)} />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Max {unit}</label>
        <Input type="number" className="h-8" value={maxUi} onChange={(e) => update(minUi, e.target.value)} />
      </div>
      {(minUi || maxUi) && (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs w-full justify-start" onClick={() => onChange(undefined)}>
          Clear
        </Button>
      )}
    </div>
  );
}
