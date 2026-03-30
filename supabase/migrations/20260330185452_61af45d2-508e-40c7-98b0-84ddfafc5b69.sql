create table public.contact_submissions (
  id               uuid default gen_random_uuid() primary key,
  name             text not null,
  email            text not null,
  phone            text,
  organization     text,
  area_of_interest text,
  message          text not null,
  status           text default 'new',
  submitted_at     timestamp with time zone default now()
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  to anon
  with check (true);

create policy "Authenticated can read contact submissions"
  on public.contact_submissions for select
  to authenticated
  using (true);

create policy "Authenticated can update contact submissions"
  on public.contact_submissions for update
  to authenticated
  using (true);