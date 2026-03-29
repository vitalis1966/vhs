
-- ============================================================
-- 1. ASSESSMENTS: Remove anon write (admin-only content)
-- ============================================================
DROP POLICY IF EXISTS "anon_manage_assessments" ON public.assessments;
DROP POLICY IF EXISTS "anon_update_assessments" ON public.assessments;
DROP POLICY IF EXISTS "anon_delete_assessments" ON public.assessments;

-- ============================================================
-- 2. ASSESSMENT_SECTIONS: Remove anon write (admin-only content)
-- ============================================================
DROP POLICY IF EXISTS "anon_manage_sections" ON public.assessment_sections;
DROP POLICY IF EXISTS "anon_update_sections" ON public.assessment_sections;
DROP POLICY IF EXISTS "anon_delete_sections" ON public.assessment_sections;

-- ============================================================
-- 3. ASSESSMENT_QUESTIONS: Remove anon write (admin-only content)
-- ============================================================
DROP POLICY IF EXISTS "anon_manage_questions" ON public.assessment_questions;
DROP POLICY IF EXISTS "anon_update_questions" ON public.assessment_questions;
DROP POLICY IF EXISTS "anon_delete_questions" ON public.assessment_questions;

-- ============================================================
-- 4. INTERNAL_ASSESSMENT_REPORTS: Remove ALL anon policies (admin + edge function only)
-- ============================================================
DROP POLICY IF EXISTS "anon_select_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "anon_insert_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "anon_update_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "anon_delete_internal_reports" ON public.internal_assessment_reports;

-- ============================================================
-- 5. EMAIL_EVENTS: Remove all anon policies (edge function uses service_role)
-- ============================================================
DROP POLICY IF EXISTS "anon_select_email_events" ON public.email_events;
DROP POLICY IF EXISTS "anon_insert_email_events" ON public.email_events;
DROP POLICY IF EXISTS "anon_update_email_events" ON public.email_events;

-- ============================================================
-- 6. ASSESSMENT_INTAKES: Remove anon SELECT (PII exposure)
--    Keep anon INSERT (intake form needs it)
-- ============================================================
DROP POLICY IF EXISTS "anon_select_intakes" ON public.assessment_intakes;

-- ============================================================
-- 7. ASSESSMENT_SESSIONS: Replace open anon SELECT with token-scoped RPC
-- ============================================================
DROP POLICY IF EXISTS "anon_select_sessions" ON public.assessment_sessions;

-- Create a secure RPC function to look up session by access token
-- Returns session data WITHOUT the access_token column
CREATE OR REPLACE FUNCTION public.get_session_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  intake_id uuid,
  assessment_id uuid,
  current_section_index integer,
  created_at timestamptz,
  updated_at timestamptz,
  submitted_at timestamptz,
  meeting_booked boolean,
  status text,
  meeting_booked_by text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id, s.intake_id, s.assessment_id, s.current_section_index,
    s.created_at, s.updated_at, s.submitted_at, s.meeting_booked,
    s.status, s.meeting_booked_by
  FROM public.assessment_sessions s
  WHERE s.access_token = p_token
  LIMIT 1;
$$;

-- Create a secure RPC to get intake info for a session (avoids exposing full intakes table)
CREATE OR REPLACE FUNCTION public.get_intake_for_session(p_token text)
RETURNS TABLE (
  full_name text,
  email text,
  organization_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.full_name, i.email, i.organization_name
  FROM public.assessment_intakes i
  INNER JOIN public.assessment_sessions s ON s.intake_id = i.id
  WHERE s.access_token = p_token
  LIMIT 1;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_session_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_intake_for_session(text) TO anon, authenticated;
