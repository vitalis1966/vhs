import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useState } from "react";
import { TaskFormDialog } from "./TaskFormDialog";
import { ComposeEmailDialog } from "./email/ComposeEmailDialog";
import { BroadcastEmailDialog } from "./email/BroadcastEmailDialog";
import { PasteEmailDialog } from "./email/PasteEmailDialog";
import { Search, Plus, LogOut, User as UserIcon, Bell as BellIcon, CheckSquare, Mail, Megaphone, ChevronDown, ClipboardPaste } from "lucide-react";
import { useEffect } from "react";
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
  const [composeOpen, setComposeOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);

  // Cmd/Ctrl + Shift + V opens the paste-email modal globally
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "v" || e.key === "V")) {
        const target = e.target as HTMLElement | null;
        const inField = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (inField) return;
        e.preventDefault();
        setPasteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clientMatch = matchPath("/app/clients/:clientId/*", location.pathname)
    ?? matchPath("/app/clients/:clientId", location.pathname);
  const projectMatch = matchPath("/app/clients/:clientId/projects/:projectId", location.pathname);
  const ctxClientId = (clientMatch?.params as any)?.clientId ?? null;
  const ctxProjectId = (projectMatch?.params as any)?.projectId ?? null;

  const canBroadcast = role === "admin" || role === "manager";

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
      <Button size="sm" variant="secondary" className="gap-1" onClick={() => setPasteOpen(true)} title="Quick Import Email (⌘⇧V)">
        <ClipboardPaste className="h-4 w-4" /> <span className="hidden md:inline">Paste Email</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="default" className="gap-1">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setNewTaskOpen(true)}>
            <CheckSquare className="h-4 w-4 mr-2" /> New Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setComposeOpen(true)}>
            <Mail className="h-4 w-4 mr-2" /> Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPasteOpen(true)}>
            <ClipboardPaste className="h-4 w-4 mr-2" /> Paste Email
          </DropdownMenuItem>
          {canBroadcast && (
            <DropdownMenuItem onClick={() => setBroadcastOpen(true)}>
              <Megaphone className="h-4 w-4 mr-2" /> Broadcast Email
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <TaskFormDialog
        open={newTaskOpen} onOpenChange={setNewTaskOpen}
        defaultClientId={ctxClientId} defaultProjectId={ctxProjectId}
      />
      <ComposeEmailDialog open={composeOpen} onOpenChange={setComposeOpen} clientId={ctxClientId} />
      <BroadcastEmailDialog open={broadcastOpen} onOpenChange={setBroadcastOpen} />
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
          <DropdownMenuItem onClick={() => navigate("/app/settings/notifications")}>
            <BellIcon className="h-4 w-4 mr-2" /> Notification Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CommandPalette />
    </header>
  );
}
