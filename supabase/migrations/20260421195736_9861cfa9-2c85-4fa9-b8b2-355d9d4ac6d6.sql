
-- ============================================================================
-- ROLES SYSTEM
-- ============================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'client');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins manage user_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- updated_at helper
-- ============================================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- ADMINISTRATORS
-- ============================================================================

CREATE TABLE public.administrators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  is_builtin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_administrators_updated_at
BEFORE UPDATE ON public.administrators
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.protect_builtin_administrator()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.is_builtin = true THEN
    RAISE EXCEPTION 'Cannot delete built-in administrator';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_administrators_protect_builtin
BEFORE DELETE ON public.administrators
FOR EACH ROW EXECUTE FUNCTION public.protect_builtin_administrator();

CREATE POLICY "Admins manage administrators"
ON public.administrators
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed built-in admin row (matched on email)
INSERT INTO public.administrators (name, email, is_active, is_builtin)
VALUES ('Built-in Administrator', 'admin@vitalisstrategies.com', true, true)
ON CONFLICT (email) DO UPDATE SET is_builtin = true;

-- Seed admin role for any existing auth user with that email (prevent lockout)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'admin@vitalisstrategies.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- ACTIVITY LOGS
-- ============================================================================

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('Login', 'File Upload', 'File Deletion', 'Password Reset', 'Password Changed')),
  status text NOT NULL CHECK (status IN ('Success', 'Failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at DESC);

CREATE POLICY "Admins read activity_logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete activity_logs"
ON public.activity_logs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can insert activity_logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anon can insert activity_logs (login attempts)"
ON public.activity_logs
FOR INSERT
TO anon
WITH CHECK (action = 'Login');

-- ============================================================================
-- CLIENT USERS
-- ============================================================================

CREATE TABLE public.client_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  phone text,
  business_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_client_users_updated_at
BEFORE UPDATE ON public.client_users
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Admins manage client_users"
ON public.client_users
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients read own client_users row"
ON public.client_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- ============================================================================
-- DOCUMENTS
-- ============================================================================

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES public.client_users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 52428800),
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_documents_client_user_id ON public.documents (client_user_id);
CREATE INDEX idx_documents_created_at ON public.documents (created_at DESC);

CREATE TRIGGER trg_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Admins manage all documents"
ON public.documents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients read own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (auth.uid() = client_user_id);

CREATE POLICY "Clients insert own documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Clients update own documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (auth.uid() = client_user_id)
WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Clients delete own documents"
ON public.documents
FOR DELETE
TO authenticated
USING (auth.uid() = client_user_id);

-- ============================================================================
-- STORAGE BUCKET: client-documents (private, 50MB cap)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('client-documents', 'client-documents', false, 52428800)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800, public = false;

-- Storage policies: user folder is auth.uid()
CREATE POLICY "Clients read own folder"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Clients upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Clients update own folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Clients delete own folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins manage all client-documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'client-documents'
  AND public.has_role(auth.uid(), 'admin')
);
