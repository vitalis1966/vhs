import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type InboxStatus = "not_assigned" | "assigned" | "waiting";

const META: Record<InboxStatus, { label: string; dot: string }> = {
  not_assigned: { label: "Not Assigned", dot: "bg-red-500" },
  assigned: { label: "Assigned", dot: "bg-green-500" },
  waiting: { label: "Waiting", dot: "bg-amber-500" },
};

interface Props {
  value: InboxStatus;
  onChange: (v: InboxStatus) => void;
  className?: string;
}

export function StatusDropdown({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as InboxStatus)}>
      <SelectTrigger className={`h-8 w-[150px] ${className ?? ""}`} onClick={(e) => e.stopPropagation()}>
        <SelectValue>
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${META[value].dot}`} />
            <span className="text-sm">{META[value].label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(META) as InboxStatus[]).map((k) => (
          <SelectItem key={k} value={k}>
            <span className="inline-flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${META[k].dot}`} />
              {META[k].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
