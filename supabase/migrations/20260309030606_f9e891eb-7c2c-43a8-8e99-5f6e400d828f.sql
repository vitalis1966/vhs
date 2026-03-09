
CREATE TABLE public.assessment_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  organization_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  province_state TEXT,
  country TEXT DEFAULT 'Canada',
  specialty TEXT,
  practice_type TEXT,
  assessment_purpose TEXT NOT NULL,
  currently_operating BOOLEAN,
  planning_new_facility BOOLEAN,
  approximate_timeline TEXT,
  additional_notes TEXT,
  preferred_followup TEXT,
  looking_for TEXT,
  assigned_track TEXT NOT NULL DEFAULT 'unknown',
  lead_source TEXT NOT NULL DEFAULT 'Strategic Assessment',
  status TEXT NOT NULL DEFAULT 'Intake Submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (public intake form, no auth required)
ALTER TABLE public.assessment_intakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on assessment_intakes"
  ON public.assessment_intakes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No select/update/delete for anon — only backend/admin can read
