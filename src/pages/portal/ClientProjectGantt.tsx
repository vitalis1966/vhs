import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientGuard } from "@/components/ClientGuard";
import { supabase } from "@/integrations/supabase/client";
import { ClientGanttView } from "@/components/app/gantt/ClientGanttView";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProjectRow { project_id: string; project_name: string; client_id: string; client_name: string; }

function Inner() {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any).rpc("get_portal_projects_for_user");
      setProjects((data ?? []) as ProjectRow[]);
      setLoading(false);
    })();
  }, []);

  const current = projects.find((p) => p.project_id === projectId);

  return (
    <main className="container max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/portal/documents" className="text-sm text-muted-foreground hover:underline">← Documents portal</Link>
        <h1 className="text-3xl font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Project plans</h1>
        <p className="text-sm text-muted-foreground mt-1">Read-only view of your active project timelines.</p>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : !projects.length ? (
        <div className="border rounded-lg p-8 text-center text-sm text-muted-foreground">No project plans available yet.</div>
      ) : !projectId ? (
        <div className="grid gap-3">
          {projects.map((p) => (
            <Link key={p.project_id} to={`/portal/projects/${p.project_id}/gantt`} className="block border rounded-lg p-4 hover:bg-muted/30 transition">
              <div className="font-semibold">{p.project_name}</div>
              <div className="text-xs text-muted-foreground">{p.client_name}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          {current && (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{current.client_name}</div>
                <div className="text-xl font-semibold">{current.project_name}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/portal/projects")}><ArrowLeft className="h-4 w-4 mr-1" />All projects</Button>
            </div>
          )}
          <ClientGanttView projectId={projectId!} />
        </div>
      )}
    </main>
  );
}

export default function ClientProjectGantt() {
  return (
    <ClientGuard>
      <Navbar />
      <Inner />
      <Footer />
    </ClientGuard>
  );
}
