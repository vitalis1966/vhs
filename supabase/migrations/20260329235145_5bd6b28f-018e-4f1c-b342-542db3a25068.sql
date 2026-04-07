ALTER TABLE public.seo_global
ADD COLUMN IF NOT EXISTS google_tag_manager_head text,
ADD COLUMN IF NOT EXISTS google_tag_manager_body text;