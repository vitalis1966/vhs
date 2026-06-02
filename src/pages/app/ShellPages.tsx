import { ReactNode } from "react";

export function PagePlaceholder({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{children ?? "Coming soon."}</p>
    </div>
  );
}

export const AppHome = () => <PagePlaceholder title="Home">Workspace overview coming soon.</PagePlaceholder>;
export const AppMyTasks = () => <PagePlaceholder title="My Tasks">Your assigned tasks will appear here.</PagePlaceholder>;
export const AppClients = () => <PagePlaceholder title="Clients">Client list coming soon.</PagePlaceholder>;
export const AppClientDetail = () => <PagePlaceholder title="Client">Client detail coming soon.</PagePlaceholder>;
export const AppProjects = () => <PagePlaceholder title="Projects">Project list coming soon.</PagePlaceholder>;
export const AppTasks = () => <PagePlaceholder title="Tasks">Workspace task board coming soon.</PagePlaceholder>;
export const AppDashboards = () => <PagePlaceholder title="Dashboards">Dashboards coming soon.</PagePlaceholder>;
