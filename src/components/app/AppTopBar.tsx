import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useState } from "react";
import { TaskFormDialog } from "./TaskFormDialog";
import { Search, Plus, LogOut, User as UserIcon, Bell as BellIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { NotificationsBell } from "./NotificationsBell";
import { CommandPalette } from "./CommandPalette";

export function AppTopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userFullName, userEmail, role } = useWorkspace();
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // Detect current client/project context from URL
  const clientMatch = matchPath("/app/clients/:clientId/*", location.pathname)
    ?? matchPath("/app/clients/:clientId", location.pathname);
  const projectMatch = matchPath("/app/clients/:clientId/projects/:projectId", location.pathname);
  const ctxClientId = (clientMatch?.params as any)?.clientId ?? null;
  const ctxProjectId = (projectMatch?.params as any)?.projectId ?? null;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const initials = (userFullName || userEmail || "?")
    .split(/[\s@]/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur flex items-center gap-3 px-3 sm:px-4">
      <SidebarTrigger />
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search… (⌘K)"
          className="pl-9 h-9 bg-background"
          onFocus={(e) => { e.currentTarget.blur(); window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true })); }}
          readOnly
        />
      </div>
      <div className="flex-1 sm:hidden" />
      <Button size="sm" variant="default" className="gap-1.5" onClick={() => setNewTaskOpen(true)}>
        <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span>
      </Button>
      <TaskFormDialog
        open={newTaskOpen} onOpenChange={setNewTaskOpen}
        defaultClientId={ctxClientId} defaultProjectId={ctxProjectId}
      />
      <NotificationsBell />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials || "?"}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="font-medium text-sm">{userFullName ?? "User"}</div>
            <div className="text-xs text-muted-foreground font-normal">{userEmail}</div>
            {role && <Badge variant="secondary" className="mt-2 capitalize">{role.replace("_", " ")}</Badge>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><UserIcon className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CommandPalette />
    </header>
  );
}
