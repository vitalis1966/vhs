
-- Create a security definer function to check intake existence (bypasses RLS)
CREATE OR REPLACE FUNCTION public.intake_exists(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.assessment_intakes WHERE id = p_id);
$$;

-- Drop and recreate the anon insert policy using the security definer function
DROP POLICY IF EXISTS "anon_insert_sessions" ON public.assessment_sessions;

CREATE POLICY "anon_insert_sessions"
ON public.assessment_sessions
FOR INSERT
TO anon
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM assessments a
    WHERE a.id = assessment_sessions.assessment_id
      AND COALESCE(a.is_published, false) = true
  ))
  AND (
    intake_id IS NULL
    OR public.intake_exists(intake_id)
  )
);
