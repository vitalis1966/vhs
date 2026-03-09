
-- Assessments (templates)
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sections within assessments
CREATE TABLE public.assessment_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions within sections
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.assessment_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  helper_text TEXT,
  field_type TEXT NOT NULL DEFAULT 'short_text',
  options JSONB,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client assessment sessions (linked to intake)
CREATE TABLE public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID REFERENCES public.assessment_intakes(id),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id),
  access_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  current_section_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

-- Individual question responses
CREATE TABLE public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id),
  response_value TEXT,
  response_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, question_id)
);

-- RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Assessments/sections/questions: public read needed for client, write for admin builder
CREATE POLICY "anon_read_assessments" ON public.assessments FOR SELECT TO anon USING (true);
CREATE POLICY "anon_manage_assessments" ON public.assessments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_assessments" ON public.assessments FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_assessments" ON public.assessments FOR DELETE TO anon USING (true);

CREATE POLICY "anon_read_sections" ON public.assessment_sections FOR SELECT TO anon USING (true);
CREATE POLICY "anon_manage_sections" ON public.assessment_sections FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_sections" ON public.assessment_sections FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_sections" ON public.assessment_sections FOR DELETE TO anon USING (true);

CREATE POLICY "anon_read_questions" ON public.assessment_questions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_manage_questions" ON public.assessment_questions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_questions" ON public.assessment_questions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_questions" ON public.assessment_questions FOR DELETE TO anon USING (true);

-- Sessions: client creates and reads/updates own session
CREATE POLICY "anon_insert_sessions" ON public.assessment_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_sessions" ON public.assessment_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_sessions" ON public.assessment_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Responses: client creates and reads/updates own responses
CREATE POLICY "anon_insert_responses" ON public.assessment_responses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_responses" ON public.assessment_responses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_responses" ON public.assessment_responses FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Seed two assessment templates
INSERT INTO public.assessments (title, slug, description, is_published) VALUES
  ('New Clinic / Build Assessment', 'new-clinic', 'Strategic assessment for physicians and healthcare organizations planning a new clinic, healthcare space, or practice launch.', false),
  ('Existing Clinic Assessment', 'existing-clinic', 'Strategic assessment for clinic owners looking to evaluate performance, optimize operations, or plan strategic growth.', false);

-- Seed sample sections for New Clinic assessment
INSERT INTO public.assessment_sections (assessment_id, title, description, sort_order)
SELECT a.id, s.title, s.description, s.sort_order
FROM public.assessments a
CROSS JOIN (VALUES
  ('Practice Vision & Goals', 'Tell us about your vision for the new clinic and what you hope to achieve.', 0),
  ('Location & Facility Planning', 'Questions about your facility plans, location preferences, and space requirements.', 1),
  ('Financial Planning', 'Help us understand your financial situation and planning for the new venture.', 2),
  ('Operations & Staffing', 'Questions about your operational model and staffing plans.', 3),
  ('Technology & Systems', 'Technology infrastructure and systems planning for your new clinic.', 4)
) AS s(title, description, sort_order)
WHERE a.slug = 'new-clinic';

-- Seed sample sections for Existing Clinic assessment
INSERT INTO public.assessment_sections (assessment_id, title, description, sort_order)
SELECT a.id, s.title, s.description, s.sort_order
FROM public.assessments a
CROSS JOIN (VALUES
  ('Current Operations Overview', 'Help us understand your current clinic operations and structure.', 0),
  ('Performance & Efficiency', 'Questions about your operational performance and efficiency.', 1),
  ('Revenue & Financial Health', 'Financial performance and revenue cycle management.', 2),
  ('Staffing & Workflow', 'Staff management, workflows, and organizational structure.', 3),
  ('Technology & Digital Systems', 'Current technology systems and digital transformation needs.', 4)
) AS s(title, description, sort_order)
WHERE a.slug = 'existing-clinic';

-- Seed sample questions for New Clinic - first section
INSERT INTO public.assessment_questions (section_id, question_text, helper_text, field_type, options, is_required, sort_order)
SELECT sec.id, q.question_text, q.helper_text, q.field_type, q.options::jsonb, q.is_required, q.sort_order
FROM public.assessment_sections sec
JOIN public.assessments a ON a.id = sec.assessment_id
CROSS JOIN (VALUES
  ('What type of healthcare practice are you planning?', 'Select the option that best describes your planned practice.', 'dropdown', '["Family Medicine","Specialist Practice","Walk-In / Urgent Care","Multidisciplinary","Diagnostic / Imaging","Other"]', true, 0),
  ('Describe your vision for this new practice.', 'What does success look like for you in the first 1-3 years?', 'long_text', NULL, true, 1),
  ('What is your target patient population?', NULL, 'short_text', NULL, false, 2)
) AS q(question_text, helper_text, field_type, options, is_required, sort_order)
WHERE a.slug = 'new-clinic' AND sec.sort_order = 0;

-- Seed sample questions for Existing Clinic - first section
INSERT INTO public.assessment_questions (section_id, question_text, helper_text, field_type, options, is_required, sort_order)
SELECT sec.id, q.question_text, q.helper_text, q.field_type, q.options::jsonb, q.is_required, q.sort_order
FROM public.assessment_sections sec
JOIN public.assessments a ON a.id = sec.assessment_id
CROSS JOIN (VALUES
  ('How long has your clinic been operating?', NULL, 'dropdown', '["Less than 1 year","1-3 years","3-5 years","5-10 years","10+ years"]', true, 0),
  ('How many providers currently work at your clinic?', NULL, 'number', NULL, true, 1),
  ('Describe the primary services your clinic offers.', NULL, 'long_text', NULL, false, 2)
) AS q(question_text, helper_text, field_type, options, is_required, sort_order)
WHERE a.slug = 'existing-clinic' AND sec.sort_order = 0;
