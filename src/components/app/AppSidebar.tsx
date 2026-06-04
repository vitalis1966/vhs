import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ListTodo, Users, FolderKanban, CheckSquare, LayoutDashboard, Pin, Settings as SettingsIcon, Clock, Inbox } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { usePinnedClients } from "@/hooks/usePinnedClients";
import { useInboxUnreadCount } from "@/hooks/useInboxUnreadCount";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Home", url: "/app/home", icon: Home },
  { title: "Inbox", url: "/app/inbox", icon: Inbox },
  { title: "My Tasks", url: "/app/my-tasks", icon: ListTodo },
  { title: "Clients", url: "/app/clients", icon: Users },
  { title: "Projects", url: "/app/projects", icon: FolderKanban },
  { title: "Tasks", url: "/app/tasks", icon: CheckSquare },
  { title: "Time Tracking", url: "/app/time", icon: Clock },
  { title: "Dashboards", url: "/app/dashboards", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { workspaceName, userId, workspaceId, role } = useWorkspace();
  const { pinned } = usePinnedClients(userId, workspaceId);
  const [pinnedClients, setPinnedClients] = useState<Array<{ id: string; name: string }>>([]);

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  useEffect(() => {
    if (!pinned.length || !workspaceId) { setPinnedClients([]); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("clients").select("id, name").in("id", pinned);
      setPinnedClients(data ?? []);
    })();
  }, [pinned, workspaceId]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        {!collapsed ? (
          <div>
            <div className="font-display text-base font-bold text-sidebar-primary leading-tight">
              {workspaceName ?? "Workspace"}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Vitalis OS
            </div>
          </div>
        ) : (
          <div className="h-6 w-6 rounded bg-sidebar-primary/10" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === "/app/home"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Pin className="h-3 w-3" /> Pinned Clients
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {pinnedClients.length === 0 ? (
              !collapsed && (
                <p className="px-3 py-2 text-xs text-muted-foreground italic">
                  No pinned clients yet
                </p>
              )
            ) : (
              <SidebarMenu>
                {pinnedClients.map((c) => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild isActive={pathname === `/app/clients/${c.id}`} tooltip={c.name}>
                      <NavLink to={`/app/clients/${c.id}`}>
                        <Pin className="h-3 w-3" />
                        <span className="truncate">{c.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {role === "admin" && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/app/settings")} tooltip="Company Settings">
                      <NavLink to="/app/settings">
                        <SettingsIcon className="h-4 w-4" />
                        <span>Company Settings</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
