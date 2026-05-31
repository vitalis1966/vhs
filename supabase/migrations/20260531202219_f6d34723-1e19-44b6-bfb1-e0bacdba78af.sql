
-- GIN FTS indexes
CREATE INDEX IF NOT EXISTS idx_clients_fts ON public.clients
  USING gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(summary,'')));
CREATE INDEX IF NOT EXISTS idx_projects_fts ON public.projects
  USING gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));
CREATE INDEX IF NOT EXISTS idx_tasks_fts ON public.tasks
  USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description_text,'')));
CREATE INDEX IF NOT EXISTS idx_notes_fts ON public.notes
  USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(body_text,'')));

-- Global search RPC. SECURITY INVOKER so existing RLS policies filter results.
CREATE OR REPLACE FUNCTION public.global_search(p_workspace_id uuid, p_query text)
RETURNS TABLE (
  kind text,
  id uuid,
  title text,
  subtitle text,
  client_id uuid,
  project_id uuid,
  rank real
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_tsq tsquery;
BEGIN
  IF p_query IS NULL OR length(trim(p_query)) = 0 THEN
    RETURN;
  END IF;

  v_tsq := websearch_to_tsquery('simple', p_query);

  RETURN QUERY
  (
    SELECT 'client'::text, c.id, c.name, c.summary, c.id AS client_id, NULL::uuid AS project_id,
           ts_rank(to_tsvector('simple', coalesce(c.name,'') || ' ' || coalesce(c.summary,'')), v_tsq) AS rank
    FROM public.clients c
    WHERE c.workspace_id = p_workspace_id
      AND to_tsvector('simple', coalesce(c.name,'') || ' ' || coalesce(c.summary,'')) @@ v_tsq
    ORDER BY rank DESC
    LIMIT 8
  )
  UNION ALL
  (
    SELECT 'project'::text, p.id, p.name, c.name, p.client_id, p.id,
           ts_rank(to_tsvector('simple', coalesce(p.name,'') || ' ' || coalesce(p.description,'')), v_tsq) AS rank
    FROM public.projects p
    JOIN public.clients c ON c.id = p.client_id
    WHERE p.workspace_id = p_workspace_id
      AND to_tsvector('simple', coalesce(p.name,'') || ' ' || coalesce(p.description,'')) @@ v_tsq
    ORDER BY rank DESC
    LIMIT 8
  )
  UNION ALL
  (
    SELECT 'task'::text, t.id, t.title, c.name, t.client_id, t.project_id,
           ts_rank(to_tsvector('simple', coalesce(t.title,'') || ' ' || coalesce(t.description_text,'')), v_tsq) AS rank
    FROM public.tasks t
    JOIN public.clients c ON c.id = t.client_id
    WHERE t.workspace_id = p_workspace_id
      AND to_tsvector('simple', coalesce(t.title,'') || ' ' || coalesce(t.description_text,'')) @@ v_tsq
    ORDER BY rank DESC
    LIMIT 10
  )
  UNION ALL
  (
    SELECT 'note'::text, n.id, coalesce(n.title, 'Untitled note'), c.name, n.client_id, n.project_id,
           ts_rank(to_tsvector('simple', coalesce(n.title,'') || ' ' || coalesce(n.body_text,'')), v_tsq) AS rank
    FROM public.notes n
    JOIN public.clients c ON c.id = n.client_id
    WHERE n.workspace_id = p_workspace_id
      AND to_tsvector('simple', coalesce(n.title,'') || ' ' || coalesce(n.body_text,'')) @@ v_tsq
    ORDER BY rank DESC
    LIMIT 10
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.global_search(uuid, text) TO authenticated;
