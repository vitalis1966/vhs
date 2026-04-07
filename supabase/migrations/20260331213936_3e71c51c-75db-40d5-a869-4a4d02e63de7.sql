
CREATE TABLE public.client_report_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '90 days'),
  accessed_at timestamptz,
  access_count int DEFAULT 0,
  is_revoked boolean DEFAULT false
);

ALTER TABLE public.client_report_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read report tokens"
  ON public.client_report_tokens FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage tokens"
  ON public.client_report_tokens FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage tokens"
  ON public.client_report_tokens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
