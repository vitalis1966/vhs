import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskBoard } from "./TaskBoard";
import { TaskTable } from "./TaskTable";
import { TaskFormDialog } from "./TaskFormDialog";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { TasksFilters, TaskFilterState } from "./TasksFilters";

interface Props { clientId: string; }

export function TasksTab({ clientId }: Props) {
  const [view, setView] = useState<"board" | "table">("board");
  const [filters, setFilters] = useState<TaskFilterState>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Task</Button>
      </div>
      <TasksFilters value={filters} onChange={setFilters} hideClient scopeClientId={clientId} />
      {view === "board" ? (
        <TaskBoard clientId={clientId} filters={filters} reloadKey={reload} onOpenTask={setOpenTaskId} />
      ) : (
        <TaskTable clientId={clientId} filters={filters} reloadKey={reload} onOpenTask={setOpenTaskId} />
      )}
      <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} defaultClientId={clientId} onCreated={() => setReload((r) => r + 1)} />
      <TaskDetailPanel
        taskId={openTaskId} open={!!openTaskId}
        onOpenChange={(o) => !o && setOpenTaskId(null)}
        onChanged={() => setReload((r) => r + 1)}
      />
    </div>
  );
}
