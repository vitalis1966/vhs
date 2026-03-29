-- 1. Restrict anon assessment reads to published only
DROP POLICY IF EXISTS "anon_read_assessments" ON public.assessments;
CREATE POLICY "anon_read_assessments"
ON public.assessments
FOR SELECT
TO anon
USING (is_published = true);

-- 2. Restrict anon section reads to published assessments only
DROP POLICY IF EXISTS "anon_read_sections" ON public.assessment_sections;
CREATE POLICY "anon_read_sections"
ON public.assessment_sections
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.assessments a
  WHERE a.id = assessment_sections.assessment_id
    AND a.is_published = true
));

-- 3. Restrict anon question reads to published assessments only
DROP POLICY IF EXISTS "anon_read_questions" ON public.assessment_questions;
CREATE POLICY "anon_read_questions"
ON public.assessment_questions
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.assessment_sections s
  JOIN public.assessments a ON a.id = s.assessment_id
  WHERE s.id = assessment_questions.section_id
    AND a.is_published = true
));

-- 4. Explicitly deny anon SELECT on assessment_sessions (no policy = no access, but be explicit)
-- There is currently no anon SELECT policy, which is correct. No action needed.
-- The anon INSERT policy already restricts to published assessments.