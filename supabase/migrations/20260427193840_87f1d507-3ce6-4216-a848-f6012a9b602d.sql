CREATE TABLE public.seo_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT false,
  profile_url text,
  display_label text,
  icon_style text NOT NULL DEFAULT 'filled',
  open_in_new_tab boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read seo_social_links"
  ON public.seo_social_links FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated manage seo_social_links"
  ON public.seo_social_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER trg_seo_social_links_touch
  BEFORE UPDATE ON public.seo_social_links
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.seo_social_links (platform, sort_order) VALUES
  ('facebook', 0),
  ('instagram', 1),
  ('linkedin', 2),
  ('x', 3),
  ('youtube', 4),
  ('tiktok', 5),
  ('pinterest', 6),
  ('bluesky', 7);