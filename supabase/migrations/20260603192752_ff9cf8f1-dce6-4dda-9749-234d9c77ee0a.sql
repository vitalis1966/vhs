CREATE TYPE public.platform_kind AS ENUM ('vhs', 'vitalis_os');

CREATE TABLE public.platform_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform public.platform_kind NOT NULL,
  role text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform)
);

GRANT SELECT ON public.platform_roles TO authenticated;
GRANT ALL ON public.platform_roles TO service_role;

ALTER TABLE public.platform_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY pr_self_select ON public.platform_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER platform_roles_touch
  BEFORE UPDATE ON public.platform_roles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.has_platform_access(_user uuid, _platform public.platform_kind)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_roles
    WHERE user_id = _user AND platform = _platform AND is_active = true
  )
$$;

-- Backfill VHS admins
INSERT INTO public.platform_roles (user_id, platform, role, is_active)
SELECT ur.user_id, 'vhs'::public.platform_kind, 'admin', true
FROM public.user_roles ur WHERE ur.role = 'admin'
ON CONFLICT (user_id, platform) DO NOTHING;

-- Backfill Vitalis OS users (one row per user, taking any active membership role)
INSERT INTO public.platform_roles (user_id, platform, role, is_active)
SELECT DISTINCT ON (wm.user_id) wm.user_id, 'vitalis_os'::public.platform_kind, wm.role, true
FROM public.workspace_members wm
WHERE wm.status = 'active' AND wm.user_id IS NOT NULL
ON CONFLICT (user_id, platform) DO NOTHING;