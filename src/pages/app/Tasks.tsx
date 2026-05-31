import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskBoard } from "@/components/app/TaskBoard";
import { TaskTable } from "@/components/app/TaskTable";
import { TaskFormDialog } from "@/components/app/TaskFormDialog";
import { TaskDetailPanel } from "@/components/app/TaskDetailPanel";
import { TasksFilters, TaskFilterState } from "@/components/app/TasksFilters";

export default function Tasks() {
  const [view, setView] = useState<"board" | "table">("board");
  const [filters, setFilters] = useState<TaskFilterState>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("task");
    if (id) setOpenTaskId(id);
  }, [searchParams]);

  const closeTask = (open: boolean) => {
    if (!open) {
      setOpenTaskId(null);
      if (searchParams.get("task")) {
        searchParams.delete("task");
        setSearchParams(searchParams, { replace: true });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Tasks</h1>
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Task</Button>
        </div>
      </div>
      <TasksFilters value={filters} onChange={setFilters} />
      {view === "board" ? (
        <TaskBoard filters={filters} reloadKey={reload} onOpenTask={setOpenTaskId} />
      ) : (
        <TaskTable filters={filters} reloadKey={reload} onOpenTask={setOpenTaskId} />
      )}
      <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => setReload((r) => r + 1)} />
      <TaskDetailPanel taskId={openTaskId} open={!!openTaskId} onOpenChange={closeTask} onChanged={() => setReload((r) => r + 1)} />
    </div>
  );
}
