CREATE OR REPLACE FUNCTION public.get_report_by_token(p_token text)
RETURNS json
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_record record;
  v_session record;
  v_intake record;
  v_report record;
  v_assessment record;
  v_edits json;
BEGIN
  -- Look up the token
  SELECT id, session_id, expires_at, is_revoked, access_count, token
  INTO v_token_record
  FROM public.client_report_tokens
  WHERE token = p_token
  LIMIT 1;

  IF v_token_record IS NULL THEN
    RAISE LOG 'get_report_by_token: token not found: %', p_token;
    RETURN json_build_object('error', 'invalid');
  END IF;

  IF v_token_record.is_revoked THEN
    RAISE LOG 'get_report_by_token: token revoked: %', p_token;
    RETURN json_build_object('error', 'revoked');
  END IF;

  IF v_token_record.expires_at < now() THEN
    RAISE LOG 'get_report_by_token: token expired: %, expires_at: %', p_token, v_token_record.expires_at;
    RETURN json_build_object('error', 'expired');
  END IF;

  -- Look up the session
  SELECT * INTO v_session
  FROM public.assessment_sessions
  WHERE id = v_token_record.session_id
  LIMIT 1;

  IF v_session IS NULL THEN
    RAISE LOG 'get_report_by_token: session not found for session_id: %', v_token_record.session_id;
    RETURN json_build_object('error', 'invalid');
  END IF;

  -- Look up the report
  SELECT * INTO v_report
  FROM public.internal_assessment_reports
  WHERE session_id = v_token_record.session_id
  LIMIT 1;

  IF v_report IS NULL OR v_report.analysis_status <> 'complete' THEN
    RAISE LOG 'get_report_by_token: report pending for session_id: %', v_token_record.session_id;
    RETURN json_build_object('status', 'pending');
  END IF;

  -- Report is ready — track the access
  BEGIN
    UPDATE public.client_report_tokens
    SET accessed_at = now(),
        access_count = COALESCE(access_count, 0) + 1
    WHERE id = v_token_record.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'get_report_by_token: access tracking update failed for token %: %', p_token, SQLERRM;
  END;

  -- Fetch supporting data
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
$$;