import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search clients, projects, tasks…" />
      <CommandList>
        <CommandEmpty>Search is coming soon.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
