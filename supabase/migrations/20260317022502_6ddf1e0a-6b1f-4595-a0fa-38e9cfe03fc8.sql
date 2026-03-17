
CREATE TABLE public.client_report_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  section_key text NOT NULL,
  item_index integer NOT NULL DEFAULT 0,
  original_text text NOT NULL,
  edited_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, section_key, item_index)
);

ALTER TABLE public.client_report_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select_client_report_edits" ON public.client_report_edits FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_client_report_edits" ON public.client_report_edits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_client_report_edits" ON public.client_report_edits FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_delete_client_report_edits" ON public.client_report_edits FOR DELETE TO authenticated USING (true);
