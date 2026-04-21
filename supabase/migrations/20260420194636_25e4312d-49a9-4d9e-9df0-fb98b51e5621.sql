
-- 1. Lock down assessment-uploads storage bucket (remove anon access)
DROP POLICY IF EXISTS "anon_read_assessment_pdfs" ON storage.objects;
DROP POLICY IF EXISTS "anon_upload_assessment_pdfs" ON storage.objects;

CREATE POLICY "authenticated_read_assessment_pdfs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'assessment-uploads');

CREATE POLICY "authenticated_upload_assessment_pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assessment-uploads');

CREATE POLICY "authenticated_update_assessment_pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'assessment-uploads')
  WITH CHECK (bucket_id = 'assessment-uploads');

CREATE POLICY "authenticated_delete_assessment_pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'assessment-uploads');

-- 2. Strip access_token from get_report_by_token payload
CREATE OR REPLACE FUNCTION public.get_report_by_token(p_token text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_token_record record;
  v_session record;
  v_intake record;
  v_report record;
  v_assessment record;
  v_edits json;
BEGIN
  SELECT id, session_id, expires_at, is_revoked, access_count, token
  INTO v_token_record
  FROM public.client_report_tokens
  WHERE token = p_token
  LIMIT 1;

  IF v_token_record IS NULL THEN
    RAISE LOG 'get_report_by_token: token not found';
    RETURN json_build_object('error', 'invalid');
  END IF;

  IF v_token_record.is_revoked THEN
    RETURN json_build_object('error', 'revoked');
  END IF;

  IF v_token_record.expires_at < now() THEN
    RETURN json_build_object('error', 'expired');
  END IF;

  -- Explicit columns — exclude access_token
  SELECT id, intake_id, assessment_id, current_section_index,
         created_at, updated_at, submitted_at, meeting_booked,
         status, meeting_booked_by
  INTO v_session
  FROM public.assessment_sessions
  WHERE id = v_token_record.session_id
  LIMIT 1;

  IF v_session IS NULL THEN
    RETURN json_build_object('error', 'invalid');
  END IF;

  SELECT * INTO v_report
  FROM public.internal_assessment_reports
  WHERE session_id = v_token_record.session_id
  LIMIT 1;

  IF v_report IS NULL OR v_report.analysis_status <> 'complete' THEN
    RETURN json_build_object('status', 'pending');
  END IF;

  BEGIN
    UPDATE public.client_report_tokens
    SET accessed_at = now(),
        access_count = COALESCE(access_count, 0) + 1
    WHERE id = v_token_record.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'get_report_by_token: access tracking update failed: %', SQLERRM;
  END;

  SELECT * INTO v_assessment
  FROM public.assessments
  WHERE id = v_session.assessment_id
  LIMIT 1;

  IF v_session.intake_id IS NOT NULL THEN
    SELECT * INTO v_intake
    FROM public.assessment_intakes
    WHERE id = v_session.intake_id
    LIMIT 1;
  END IF;

  SELECT COALESCE(json_agg(row_to_json(e)), '[]'::json)
  INTO v_edits
  FROM public.client_report_edits e
  WHERE e.session_id = v_token_record.session_id;

  RETURN json_build_object(
    'session', row_to_json(v_session),
    'assessment', CASE WHEN v_assessment.id IS NOT NULL THEN row_to_json(v_assessment) ELSE NULL END,
    'intake', CASE WHEN v_intake.id IS NOT NULL THEN row_to_json(v_intake) ELSE NULL END,
    'report', CASE WHEN v_report.id IS NOT NULL THEN row_to_json(v_report) ELSE NULL END,
    'edits', v_edits
  );
END;
$function$;

-- 3. Add submitted-status guard to update_session_by_token
CREATE OR REPLACE FUNCTION public.update_session_by_token(
  p_token text,
  p_current_section_index integer DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_submitted_at timestamptz DEFAULT NULL,
  p_meeting_booked boolean DEFAULT NULL,
  p_meeting_booked_by text DEFAULT NULL
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_session_id uuid;
  v_current_status text;
BEGIN
  SELECT id, status INTO v_session_id, v_current_status
  FROM public.assessment_sessions
  WHERE access_token = p_token;

  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  -- Block all mutations once submitted, except allowing meeting_booked tracking
  IF v_current_status = 'submitted' THEN
    -- Only permit meeting_booked / meeting_booked_by updates after submission
    IF p_current_section_index IS NOT NULL
       OR p_status IS NOT NULL
       OR p_submitted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Session already submitted';
    END IF;
  END IF;

  UPDATE public.assessment_sessions SET
    current_section_index = COALESCE(p_current_section_index, current_section_index),
    status = COALESCE(p_status, status),
    submitted_at = COALESCE(p_submitted_at, submitted_at),
    meeting_booked = COALESCE(p_meeting_booked, meeting_booked),
    meeting_booked_by = COALESCE(p_meeting_booked_by, meeting_booked_by),
    updated_at = now()
  WHERE id = v_session_id;

  RETURN v_session_id;
END;
$function$;

-- 4. Set fixed search_path on pgmq helper functions (linter warning)
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
