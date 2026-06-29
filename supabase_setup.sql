create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content
for select
to anon
using (true);

drop policy if exists "public can update site content" on public.site_content;
create policy "public can update site content"
on public.site_content
for insert
to anon
with check (id = 'main');

drop policy if exists "public can upsert site content" on public.site_content;
create policy "public can upsert site content"
on public.site_content
for update
to anon
using (id = 'main')
with check (id = 'main');
