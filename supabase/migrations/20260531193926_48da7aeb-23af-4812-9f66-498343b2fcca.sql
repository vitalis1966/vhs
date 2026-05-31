
-- Meetings module

CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  summary JSONB,
  summary_text TEXT,
  external_attendees TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_meetings_client_id ON public.meetings(client_id);
CREATE INDEX idx_meetings_meeting_date ON public.meetings(meeting_date DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY meetings_select ON public.meetings FOR SELECT TO authenticated
  USING (public.can_access_client(client_id));
CREATE POLICY meetings_write ON public.meetings FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE TRIGGER trg_meetings_updated_at BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Attendees (internal workspace members)
CREATE TABLE public.meeting_attendees (
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  PRIMARY KEY (meeting_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_attendees TO authenticated;
GRANT ALL ON public.meeting_attendees TO service_role;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY ma_all ON public.meeting_attendees FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.can_access_client(m.client_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.is_workspace_member(m.workspace_id)));

-- Decisions
CREATE TABLE public.meeting_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_decisions TO authenticated;
GRANT ALL ON public.meeting_decisions TO service_role;
ALTER TABLE public.meeting_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY md_all ON public.meeting_decisions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.can_access_client(m.client_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.is_workspace_member(m.workspace_id)));

-- Action items with converted_task_id
CREATE TABLE public.meeting_action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id),
  due_date DATE,
  converted_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  position INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_action_items TO authenticated;
GRANT ALL ON public.meeting_action_items TO service_role;
ALTER TABLE public.meeting_action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY mai_all ON public.meeting_action_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.can_access_client(m.client_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_id AND public.is_workspace_member(m.workspace_id)));
