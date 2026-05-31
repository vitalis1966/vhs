import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import {
  Building2, Users, Shield, KeyRound, Bell, ListChecks, Lock, CreditCard, MessageSquare,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { WorkspaceSection } from "@/components/app/settings/WorkspaceSection";
import { UsersSection } from "@/components/app/settings/UsersSection";
import { RolesSection } from "@/components/app/settings/RolesSection";
import { ClientAccessSection } from "@/components/app/settings/ClientAccessSection";
import { NotificationsSection } from "@/components/app/settings/NotificationsSection";
import { TaskConfigSection } from "@/components/app/settings/TaskConfigSection";
import { SecuritySection } from "@/components/app/settings/SecuritySection";
import { BillingSection } from "@/components/app/settings/BillingSection";

const SECTIONS = [
  { id: "workspace",     label: "Workspace",            icon: Building2,   render: () => <WorkspaceSection /> },
  { id: "users",         label: "Users & Permissions",  icon: Users,       render: () => <UsersSection /> },
  { id: "roles",         label: "Roles",                icon: Shield,      render: () => <RolesSection /> },
  { id: "access",        label: "Client Access",        icon: KeyRound,    render: () => <ClientAccessSection /> },
  { id: "notifications", label: "Notifications",        icon: Bell,        render: () => <NotificationsSection /> },
  { id: "tasks",         label: "Task Configuration",   icon: ListChecks,  render: () => <TaskConfigSection /> },
  { id: "security",      label: "Security",             icon: Lock,        render: () => <SecuritySection /> },
  { id: "billing",       label: "Billing",              icon: CreditCard,  render: () => <BillingSection /> },
];

export default function Settings() {
  const { role, loading } = useWorkspace();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const active = params.get("s") ?? "workspace";

  if (!loading && role !== "admin") {
    navigate("/app/home", { replace: true });
    return null;
  }

  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  const setActive = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("s", id);
    setParams(next, { replace: true });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Company Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace, team, permissions, and platform configuration.
        </p>
      </div>

      {/* Mobile selector */}
      <div className="md:hidden mb-4">
        <Select value={active} onValueChange={setActive}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SECTIONS.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Desktop nav */}
        <nav className="hidden md:flex flex-col gap-1 border-r border-border pr-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
                active === s.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {current.render()}
        </div>
      </div>
    </div>
  );
}
