
CREATE OR REPLACE FUNCTION public.get_portal_projects_for_user()
RETURNS TABLE(project_id uuid, project_name text, client_id uuid, client_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.name, c.id, c.name
    FROM public.client_users cu
    JOIN public.clients c ON lower(btrim(c.name)) = lower(btrim(cu.business_name))
    JOIN public.projects p ON p.client_id = c.id
   WHERE cu.id = auth.uid()
   ORDER BY p.created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.get_portal_projects_for_user() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_portal_gantt_for_project(p_project_id uuid)
RETURNS TABLE(
  id uuid, type text, title text, parent_id uuid, "position" int,
  start_date date, end_date date, progress int, is_complete boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT g.id, g.type::text, g.title, g.parent_id, g.position,
         g.start_date, g.end_date, g.progress, g.is_complete
    FROM public.gantt_items g
    JOIN public.projects p ON p.id = g.project_id
    JOIN public.clients c ON c.id = p.client_id
   WHERE g.project_id = p_project_id
     AND g.is_internal = false
     AND EXISTS (
       SELECT 1 FROM public.client_users cu
       WHERE cu.id = auth.uid()
         AND lower(btrim(cu.business_name)) = lower(btrim(c.name))
     )
   ORDER BY g.position;
$$;
GRANT EXECUTE ON FUNCTION public.get_portal_gantt_for_project(uuid) TO authenticated;
