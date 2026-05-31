import { NavLink, useLocation } from "react-router-dom";
import { Home, ListTodo, Users, FolderKanban, CheckSquare, LayoutDashboard, Pin } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const navItems = [
  { title: "Home", url: "/app/home", icon: Home },
  { title: "My Tasks", url: "/app/my-tasks", icon: ListTodo },
  { title: "Clients", url: "/app/clients", icon: Users },
  { title: "Projects", url: "/app/projects", icon: FolderKanban },
  { title: "Tasks", url: "/app/tasks", icon: CheckSquare },
  { title: "Dashboards", url: "/app/dashboards", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { workspaceName } = useWorkspace();

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        {!collapsed ? (
          <div>
            <div className="font-display text-base font-bold text-sidebar-primary leading-tight">
              {workspaceName ?? "Workspace"}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Internal Platform
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
            {!collapsed && (
              <p className="px-3 py-2 text-xs text-muted-foreground italic">
                No pinned clients yet
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
