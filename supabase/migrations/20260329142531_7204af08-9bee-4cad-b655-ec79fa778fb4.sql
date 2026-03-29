-- Harden anonymous response access and session creation policies
DROP POLICY IF EXISTS "anon_update_responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "anon_insert_responses" ON public.assessment_responses;

DROP POLICY IF EXISTS "anon_insert_sessions" ON public.assessment_sessions;
CREATE POLICY "anon_insert_sessions"
ON public.assessment_sessions
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.assessments a
    WHERE a.id = assessment_id
      AND COALESCE(a.is_published, false) = true
  )
  AND (
    intake_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.assessment_intakes i
      WHERE i.id = intake_id
    )
  )
);

-- Secure response upsert through access token validation
CREATE OR REPLACE FUNCTION public.upsert_response_by_token(
  p_token text,
  p_question_id uuid,
  p_response_value text DEFAULT NULL,
  p_response_json jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_assessment_id uuid;
  v_response_id uuid;
  v_session_status text;
BEGIN
  SELECT s.id, s.assessment_id, s.status
  INTO v_session_id, v_assessment_id, v_session_status
  FROM public.assessment_sessions s
  WHERE s.access_token = p_token
  LIMIT 1;

  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  IF v_session_status = 'submitted' THEN
    RAISE EXCEPTION 'Session already submitted';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.assessment_questions q
    INNER JOIN public.assessment_sections sec ON sec.id = q.section_id
    WHERE q.id = p_question_id
      AND sec.assessment_id = v_assessment_id
  ) THEN
    RAISE EXCEPTION 'Question does not belong to session assessment';
  END IF;

  INSERT INTO public.assessment_responses (
    session_id,
    question_id,
    response_value,
    response_json,
    updated_at
  )
  VALUES (
    v_session_id,
    p_question_id,
    p_response_value,
    p_response_json,
    now()
  )
  ON CONFLICT (session_id, question_id)
  DO UPDATE SET
    response_value = EXCLUDED.response_value,
    response_json = EXCLUDED.response_json,
    updated_at = now()
  RETURNING id INTO v_response_id;

  RETURN v_response_id;
END;
$$;