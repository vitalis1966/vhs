
CREATE TABLE public.insights_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Practice Operations',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamp with time zone,
  scheduled_at timestamp with time zone,
  date date NOT NULL DEFAULT CURRENT_DATE,
  estimated_read_time integer DEFAULT 5,
  excerpt text,
  body text,
  featured_image_url text,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.insights_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_published_articles" ON public.insights_articles
  FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "authenticated_select_articles" ON public.insights_articles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_insert_articles" ON public.insights_articles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated_update_articles" ON public.insights_articles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_articles" ON public.insights_articles
  FOR DELETE TO authenticated USING (true);
