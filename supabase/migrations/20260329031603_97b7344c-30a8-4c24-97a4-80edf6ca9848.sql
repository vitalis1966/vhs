
-- 1. Remove open anon SELECT on assessment_reminders (exposes session IDs)
DROP POLICY IF EXISTS "anon_select_reminders" ON public.assessment_reminders;

-- 2. Remove open anon UPDATE on assessment_reminders
DROP POLICY IF EXISTS "anon_update_reminders" ON public.assessment_reminders;

-- 3. Remove open anon INSERT on assessment_reminders (will use RPC instead)
DROP POLICY IF EXISTS "anon_insert_reminders" ON public.assessment_reminders;

-- 4. Remove open anon UPDATE on assessment_sessions (allows tampering with any session)
DROP POLICY IF EXISTS "anon_update_sessions" ON public.assessment_sessions;

-- 5. Create secure RPC to update session progress (scoped by access token)
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
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  SELECT id INTO v_session_id FROM public.assessment_sessions WHERE access_token = p_token;
  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'Invalid session token';
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
$$;

GRANT EXECUTE ON FUNCTION public.update_session_by_token(text, integer, text, timestamptz, boolean, text) TO anon, authenticated;

-- 6. Create secure RPC to schedule reminders (scoped by access token)
CREATE OR REPLACE FUNCTION public.schedule_reminder_by_token(
  p_token text,
  p_reminder_number integer,
  p_scheduled_at timestamptz,
  p_reminder_type text DEFAULT 'incomplete_assessment'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_reminder_id uuid;
BEGIN
  SELECT id INTO v_session_id FROM public.assessment_sessions WHERE access_token = p_token;
  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  INSERT INTO public.assessment_reminders (session_id, reminder_type, reminder_number, scheduled_at, status)
  VALUES (v_session_id, p_reminder_type, p_reminder_number, p_scheduled_at, 'pending')
  RETURNING id INTO v_reminder_id;

  RETURN v_reminder_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.schedule_reminder_by_token(text, integer, timestamptz, text) TO anon, authenticated;

-- 7. Create secure RPC to cancel pending reminders (scoped by access token)
CREATE OR REPLACE FUNCTION public.cancel_reminders_by_token(p_token text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
  v_count integer;
BEGIN
  SELECT id INTO v_session_id FROM public.assessment_sessions WHERE access_token = p_token;
  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'Invalid session token';
  END IF;

  UPDATE public.assessment_reminders
  SET status = 'cancelled'
  WHERE session_id = v_session_id AND status = 'pending';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_reminders_by_token(text) TO anon, authenticated;
