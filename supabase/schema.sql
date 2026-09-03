create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('pothole', 'garbage', 'traffic', 'accident', 'construction')),
  description text not null,
  image text,
  location jsonb not null check (
    jsonb_typeof(location) = 'object'
    and (location ->> 'lat') ~ '^-?[0-9]+(\\.[0-9]+)?$'
    and (location ->> 'lng') ~ '^-?[0-9]+(\\.[0-9]+)?$'
    and (location ->> 'lat')::double precision between -90 and 90
    and (location ->> 'lng')::double precision between -180 and 180
  ),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  severity text not null default 'low' check (severity in ('low', 'medium', 'high')),
  report_count integer not null default 1 check (report_count > 0),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists issues_created_at_idx on public.issues (created_at desc);
create index if not exists issues_category_idx on public.issues (category);
alter table public.issues enable row level security;

drop policy if exists "Anyone can read issues" on public.issues;
create policy "Anyone can read issues" on public.issues for select to anon, authenticated using (true);
drop policy if exists "Authenticated users can create issues" on public.issues;
create policy "Authenticated users can create issues" on public.issues for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update issues" on public.issues;
create policy "Users can update issues" on public.issues for update to authenticated using (true) with check (true);

alter table public.issues replica identity full;
do $$
begin
  alter publication supabase_realtime add table public.issues;
exception
  when duplicate_object then null;
end $$;

create or replace function public.report_issue(
  p_category text,
  p_description text,
  p_image text,
  p_location jsonb,
  p_severity text,
  p_user_id uuid
)
returns public.issues
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_issue public.issues;
  latitude double precision := (p_location ->> 'lat')::double precision;
  longitude double precision := (p_location ->> 'lng')::double precision;
begin
  if auth.uid() is null or p_user_id is null or auth.uid() <> p_user_id then
    raise exception 'Authentication required';
  end if;

  perform pg_advisory_xact_lock(hashtext('issues:' || p_category));

  select * into existing_issue
  from public.issues
  where category = p_category
    and 6371000 * 2 * asin(sqrt(
      sin(radians(((location ->> 'lat')::double precision - latitude) / 2)) ^ 2
      + cos(radians(latitude)) * cos(radians((location ->> 'lat')::double precision))
      * sin(radians(((location ->> 'lng')::double precision - longitude) / 2)) ^ 2
    )) < 100
  order by created_at desc
  limit 1
  for update;

  if existing_issue.id is not null then
    update public.issues
    set report_count = report_count + 1
    where id = existing_issue.id
    returning * into existing_issue;
    return existing_issue;
  end if;

  insert into public.issues (category, description, image, location, severity, user_id)
  values (p_category, p_description, p_image, p_location, p_severity, p_user_id)
  returning * into existing_issue;
  return existing_issue;
end;
$$;

revoke all on function public.report_issue(text, text, text, jsonb, text, uuid) from public;
grant execute on function public.report_issue(text, text, text, jsonb, text, uuid) to authenticated;