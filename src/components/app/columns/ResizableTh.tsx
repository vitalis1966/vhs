import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

/**
 * Persists per-column widths in localStorage and renders a drag handle
 * on the right edge of each <th>. Drop into any table header cell.
 */
export function useColumnWidths(storageKey: string, defaults: Record<string, number>) {
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch {}
    return defaults;
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(widths)); } catch {}
  }, [storageKey, widths]);

  const setWidth = useCallback((key: string, w: number) => {
    setWidths((p) => ({ ...p, [key]: Math.max(60, Math.round(w)) }));
  }, []);

  return { widths, setWidth };
}

interface Props {
  columnKey: string;
  width: number;
  onResize: (key: string, w: number) => void;
  children: ReactNode;
  className?: string;
}

export function ResizableTh({ columnKey, width, onResize, children, className }: Props) {
  const ref = useRef<HTMLTableCellElement>(null);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startW: width };
    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      onResize(columnKey, dragRef.current.startW + dx);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <th
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ width, minWidth: width, maxWidth: width }}
    >
      <div className="pr-2">{children}</div>
      <div
        onPointerDown={onPointerDown}
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 select-none"
        aria-label="Resize column"
        role="separator"
      />
    </th>
  );
}
