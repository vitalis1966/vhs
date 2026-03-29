
-- Remove open anon SELECT on assessment_responses (exposes all client data)
DROP POLICY IF EXISTS "anon_select_responses" ON public.assessment_responses;

-- Create secure RPC to get responses scoped by access token
CREATE OR REPLACE FUNCTION public.get_responses_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  session_id uuid,
  question_id uuid,
  response_value text,
  response_json jsonb,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.session_id, r.question_id, r.response_value, r.response_json, r.updated_at
  FROM public.assessment_responses r
  INNER JOIN public.assessment_sessions s ON s.id = r.session_id
  WHERE s.access_token = p_token;
$$;

GRANT EXECUTE ON FUNCTION public.get_responses_by_token(text) TO anon, authenticated;
