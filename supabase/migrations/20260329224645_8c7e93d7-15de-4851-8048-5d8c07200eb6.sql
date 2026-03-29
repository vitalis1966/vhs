
-- Create updated_at trigger function (idempotent)
create or replace function update_updated_at_column()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- TABLE 1: seo_pages
create table public.seo_pages (
  id                    uuid default gen_random_uuid() primary key,
  route                 text not null unique,
  page_label            text not null,
  title                 text,
  description           text,
  keywords              text,
  robots                text default 'index, follow',
  noindex               boolean default false,
  og_title              text,
  og_description        text,
  og_image              text,
  og_image_alt          text,
  og_image_width        text default '1200',
  og_image_height       text default '630',
  og_type               text default 'website',
  twitter_title         text,
  twitter_description   text,
  twitter_image         text,
  twitter_image_alt     text,
  twitter_card          text default 'summary_large_image',
  canonical_override    text,
  article_author        text,
  article_published     timestamp with time zone,
  article_modified      timestamp with time zone,
  article_section       text,
  article_tags          text[],
  schema_type           text default 'WebPage',
  schema_json           jsonb,
  breadcrumbs           jsonb,
  is_active             boolean default true,
  created_at            timestamp with time zone default now(),
  updated_at            timestamp with time zone default now()
);

create index seo_pages_route_idx on public.seo_pages(route);

create trigger seo_pages_updated_at
  before update on public.seo_pages
  for each row execute function update_updated_at_column();

-- TABLE 2: seo_global
create table public.seo_global (
  id                    int primary key default 1,
  site_name             text default 'Vitalis Health Strategies',
  site_url              text default 'https://www.vitalisstrategies.com',
  site_locale           text default 'en_CA',
  default_og_image      text default '/og-default.jpg',
  theme_color           text default '#1C3D2E',
  default_title         text,
  default_description   text,
  default_robots        text default 'index, follow',
  twitter_handle        text,
  facebook_page_url     text,
  facebook_app_id       text,
  linkedin_url          text,
  instagram_url         text,
  google_analytics_id          text,
  google_tag_manager_id        text,
  google_search_console        text,
  google_ads_id                text,
  google_ads_conversion_label  text,
  bing_verification     text,
  pinterest_verification text,
  meta_pixel_id         text,
  linkedin_partner_id   text,
  hotjar_id             text,
  intercom_app_id       text,
  crisp_website_id      text,
  custom_head_script    text,
  custom_body_script    text,
  updated_at            timestamp with time zone default now()
);

insert into public.seo_global (id) values (1) on conflict (id) do nothing;

create trigger seo_global_updated_at
  before update on public.seo_global
  for each row execute function update_updated_at_column();

-- TABLE 3: seo_schema_global
create table public.seo_schema_global (
  id            text primary key,
  label         text not null,
  schema_json   jsonb not null,
  is_active     boolean default true,
  updated_at    timestamp with time zone default now()
);

create trigger seo_schema_global_updated_at
  before update on public.seo_schema_global
  for each row execute function update_updated_at_column();

insert into public.seo_schema_global (id, label, schema_json) values
('organization', 'Organization Schema (every page)', '{"@context":"https://schema.org","@type":"ProfessionalService","@id":"https://www.vitalisstrategies.com/#organization","name":"Vitalis Health Strategies","legalName":"Vitalis Health Strategies Inc.","url":"https://www.vitalisstrategies.com","logo":{"@type":"ImageObject","url":"https://www.vitalisstrategies.com/vitalis-logo.webp","width":400,"height":120},"description":"Clinician-led healthcare consulting firm helping medical, dental, and veterinary practices plan, build, grow, and optimize across Canada.","address":{"@type":"PostalAddress","addressLocality":"Calgary","addressRegion":"AB","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":"51.0447","longitude":"-114.0719"},"areaServed":{"@type":"Country","name":"Canada"},"email":"info@vitalisstrategies.com","sameAs":[]}'::jsonb),
('website', 'WebSite Schema (every page)', '{"@context":"https://schema.org","@type":"WebSite","@id":"https://www.vitalisstrategies.com/#website","name":"Vitalis Health Strategies","url":"https://www.vitalisstrategies.com","inLanguage":"en-CA","publisher":{"@id":"https://www.vitalisstrategies.com/#organization"}}'::jsonb);

-- TABLE 4: seo_redirects
create table public.seo_redirects (
  id            uuid default gen_random_uuid() primary key,
  from_path     text not null unique,
  to_path       text not null,
  redirect_type int default 301,
  is_active     boolean default true,
  note          text,
  created_at    timestamp with time zone default now()
);

create index seo_redirects_from_path_idx on public.seo_redirects(from_path);

-- RLS
alter table public.seo_pages enable row level security;
create policy "Public can read seo_pages" on public.seo_pages for select using (true);
create policy "Authenticated can insert seo_pages" on public.seo_pages for insert to authenticated with check (true);
create policy "Authenticated can update seo_pages" on public.seo_pages for update to authenticated using (true) with check (true);
create policy "Authenticated can delete seo_pages" on public.seo_pages for delete to authenticated using (true);

alter table public.seo_global enable row level security;
create policy "Public can read seo_global" on public.seo_global for select using (true);
create policy "Authenticated can insert seo_global" on public.seo_global for insert to authenticated with check (true);
create policy "Authenticated can update seo_global" on public.seo_global for update to authenticated using (true) with check (true);
create policy "Authenticated can delete seo_global" on public.seo_global for delete to authenticated using (true);

alter table public.seo_schema_global enable row level security;
create policy "Public can read seo_schema_global" on public.seo_schema_global for select using (true);
create policy "Authenticated can insert seo_schema_global" on public.seo_schema_global for insert to authenticated with check (true);
create policy "Authenticated can update seo_schema_global" on public.seo_schema_global for update to authenticated using (true) with check (true);
create policy "Authenticated can delete seo_schema_global" on public.seo_schema_global for delete to authenticated using (true);

alter table public.seo_redirects enable row level security;
create policy "Public can read seo_redirects" on public.seo_redirects for select using (true);
create policy "Authenticated can insert seo_redirects" on public.seo_redirects for insert to authenticated with check (true);
create policy "Authenticated can update seo_redirects" on public.seo_redirects for update to authenticated using (true) with check (true);
create policy "Authenticated can delete seo_redirects" on public.seo_redirects for delete to authenticated using (true);
