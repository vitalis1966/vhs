
create table public.portfolio_cases (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  slug            text not null unique,
  specialty       text not null,
  location        text not null default 'Canada',
  metric          text not null,
  description     text not null,
  tags            text[] not null default '{}',
  case_type       text not null default 'case_study',
  body            text,
  sort_order      int default 0,
  status          text not null default 'published',
  created_at      timestamp with time zone default now(),
  updated_at      timestamp with time zone default now()
);

create index portfolio_cases_slug_idx on public.portfolio_cases(slug);
create index portfolio_cases_status_idx on public.portfolio_cases(status);
create index portfolio_cases_sort_order_idx on public.portfolio_cases(sort_order);

create trigger portfolio_cases_updated_at
  before update on public.portfolio_cases
  for each row execute function update_updated_at_column();

alter table public.portfolio_cases enable row level security;

create policy "Public can read published portfolio_cases"
  on public.portfolio_cases for select
  to anon
  using (status = 'published');

create policy "Authenticated full access portfolio_cases"
  on public.portfolio_cases for all
  to authenticated
  using (true)
  with check (true);
