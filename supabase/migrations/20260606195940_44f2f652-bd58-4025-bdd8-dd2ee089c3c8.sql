
-- 1. Table
create table public.client_submission_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  source_type text not null check (source_type in ('assessment','submission')),
  source_id uuid not null,
  assigned_by text not null check (assigned_by in ('auto','manual')),
  assigned_at timestamptz not null default now(),
  assigned_by_user_id uuid references auth.users(id) on delete set null,
  hidden_in_client boolean not null default false,
  metadata jsonb,
  constraint client_submission_assignments_unique unique (client_id, source_type, source_id)
);

create index idx_csa_source on public.client_submission_assignments (source_type, source_id);
create index idx_csa_client on public.client_submission_assignments (client_id, source_type);

-- 2. Grants
grant select, insert, update, delete on public.client_submission_assignments to service_role;
grant select, insert on public.client_submission_assignments to authenticated;
grant update (hidden_in_client) on public.client_submission_assignments to authenticated;

-- 3. RLS
alter table public.client_submission_assignments enable row level security;

create policy csa_admin_all on public.client_submission_assignments
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy csa_member_select on public.client_submission_assignments
  for select to authenticated
  using (public.can_access_client(client_id) and hidden_in_client = false);

create policy csa_member_update on public.client_submission_assignments
  for update to authenticated
  using (public.can_access_client(client_id))
  with check (public.can_access_client(client_id));

create policy csa_admin_insert_manual on public.client_submission_assignments
  for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

-- 4. Auto-assign: assessment on submit
create or replace function public.auto_assign_assessment_to_client(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org text;
  v_client_id uuid;
begin
  select btrim(i.organization_name)
    into v_org
  from public.assessment_sessions s
  join public.assessment_intakes i on i.id = s.intake_id
  where s.id = p_session_id
  limit 1;

  if v_org is null or length(v_org) = 0 then
    return;
  end if;

  select c.id
    into v_client_id
  from public.clients c
  where lower(btrim(c.name)) = lower(v_org)
  order by c.created_at asc
  limit 1;

  if v_client_id is null then
    return;
  end if;

  insert into public.client_submission_assignments
    (client_id, source_type, source_id, assigned_by)
  values
    (v_client_id, 'assessment', p_session_id, 'auto')
  on conflict (client_id, source_type, source_id) do nothing;
end;
$$;

grant execute on function public.auto_assign_assessment_to_client(uuid) to anon, authenticated;

-- 5. Auto-assign: document on upload
create or replace function public.auto_assign_document_to_client(p_document_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_biz text;
  v_client_id uuid;
begin
  select btrim(cu.business_name)
    into v_biz
  from public.documents d
  join public.client_users cu on cu.id = d.client_user_id
  where d.id = p_document_id
  limit 1;

  if v_biz is null or length(v_biz) = 0 then
    return;
  end if;

  select c.id
    into v_client_id
  from public.clients c
  where lower(btrim(c.name)) = lower(v_biz)
  order by c.created_at asc
  limit 1;

  if v_client_id is null then
    return;
  end if;

  insert into public.client_submission_assignments
    (client_id, source_type, source_id, assigned_by)
  values
    (v_client_id, 'submission', p_document_id, 'auto')
  on conflict (client_id, source_type, source_id) do nothing;
end;
$$;

grant execute on function public.auto_assign_document_to_client(uuid) to authenticated;

-- 6. Hide assignment with role-permission gate
create or replace function public.set_assignment_hidden(p_id uuid, p_hidden boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.client_submission_assignments;
  v_workspace_id uuid;
  v_role text;
  v_perms jsonb;
  v_required text;
  v_allowed boolean;
begin
  select * into v_row from public.client_submission_assignments where id = p_id;
  if v_row.id is null then
    raise exception 'Assignment not found';
  end if;

  if not public.can_access_client(v_row.client_id) then
    raise exception 'Not authorized';
  end if;

  -- VHS admins are always allowed
  if public.has_role(auth.uid(), 'admin') then
    update public.client_submission_assignments
       set hidden_in_client = p_hidden
     where id = p_id;
    return;
  end if;

  select c.workspace_id into v_workspace_id
  from public.clients c where c.id = v_row.client_id;

  select wm.role into v_role
  from public.workspace_members wm
  where wm.workspace_id = v_workspace_id
    and wm.user_id = auth.uid()
    and wm.status = 'active'
  limit 1;

  if v_role is null then
    raise exception 'Not authorized';
  end if;

  select w.role_permissions into v_perms from public.workspaces w where w.id = v_workspace_id;

  if v_row.source_type = 'submission' then
    v_required := 'documents.delete';
  else
    v_required := 'reports.delete_internal';
  end if;

  v_allowed := coalesce((v_perms -> v_required ->> v_role)::boolean, v_role = 'admin');
  -- For assessment rows, accept either delete_internal OR delete_client
  if not v_allowed and v_row.source_type = 'assessment' then
    v_allowed := coalesce((v_perms -> 'reports.delete_client' ->> v_role)::boolean, false);
  end if;

  if not v_allowed then
    raise exception 'Permission denied';
  end if;

  update public.client_submission_assignments
     set hidden_in_client = p_hidden
   where id = p_id;
end;
$$;

grant execute on function public.set_assignment_hidden(uuid, boolean) to authenticated;

-- 7. List assessments assigned to a client (with joined display data)
create or replace function public.list_client_assessment_assignments(p_client_id uuid)
returns table(
  assignment_id uuid,
  assigned_at timestamptz,
  session_id uuid,
  submitted_at timestamptz,
  status text,
  client_name text,
  client_email text,
  organization text,
  assessment_purpose text,
  assessment_title text,
  assessment_slug text,
  analysis_status text,
  has_internal_report boolean,
  has_client_report boolean,
  meeting_booked boolean,
  meeting_booked_by text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.can_access_client(p_client_id) then
    raise exception 'Not authorized';
  end if;

  return query
  select
    a.id,
    a.assigned_at,
    s.id,
    s.submitted_at,
    s.status,
    i.full_name,
    i.email,
    i.organization_name,
    i.assessment_purpose,
    ass.title,
    ass.slug,
    r.analysis_status,
    (r.id is not null),
    (r.analysis_status = 'complete'),
    coalesce(s.meeting_booked, false),
    s.meeting_booked_by
  from public.client_submission_assignments a
  join public.assessment_sessions s on s.id = a.source_id
  left join public.assessment_intakes i on i.id = s.intake_id
  left join public.assessments ass on ass.id = s.assessment_id
  left join public.internal_assessment_reports r on r.session_id = s.id
  where a.client_id = p_client_id
    and a.source_type = 'assessment'
    and a.hidden_in_client = false
  order by s.submitted_at desc nulls last, a.assigned_at desc;
end;
$$;

grant execute on function public.list_client_assessment_assignments(uuid) to authenticated;

-- 8. List submissions assigned to a client
create or replace function public.list_client_submission_assignments(p_client_id uuid)
returns table(
  assignment_id uuid,
  assigned_at timestamptz,
  document_id uuid,
  file_name text,
  file_type text,
  file_size bigint,
  storage_path text,
  created_at timestamptz,
  updated_at timestamptz,
  business_name text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.can_access_client(p_client_id) then
    raise exception 'Not authorized';
  end if;

  return query
  select
    a.id,
    a.assigned_at,
    d.id,
    d.file_name,
    d.file_type,
    d.file_size,
    d.storage_path,
    d.created_at,
    d.updated_at,
    cu.business_name
  from public.client_submission_assignments a
  join public.documents d on d.id = a.source_id
  left join public.client_users cu on cu.id = d.client_user_id
  where a.client_id = p_client_id
    and a.source_type = 'submission'
    and a.hidden_in_client = false
  order by d.created_at desc, a.assigned_at desc;
end;
$$;

grant execute on function public.list_client_submission_assignments(uuid) to authenticated;

-- 9. Fetch internal report for an assignment (workspace member-safe)
create or replace function public.get_internal_report_for_assignment(p_assignment_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.client_submission_assignments;
  v_session record;
  v_intake record;
  v_assessment record;
  v_report record;
begin
  select * into v_row from public.client_submission_assignments where id = p_assignment_id;
  if v_row.id is null then
    raise exception 'Assignment not found';
  end if;
  if v_row.source_type <> 'assessment' then
    raise exception 'Wrong assignment type';
  end if;
  if not public.can_access_client(v_row.client_id) then
    raise exception 'Not authorized';
  end if;

  select id, intake_id, assessment_id, submitted_at, status, meeting_booked, meeting_booked_by
    into v_session
  from public.assessment_sessions where id = v_row.source_id;

  if v_session.intake_id is not null then
    select * into v_intake from public.assessment_intakes where id = v_session.intake_id;
  end if;

  select * into v_assessment from public.assessments where id = v_session.assessment_id;
  select * into v_report from public.internal_assessment_reports where session_id = v_session.id;

  return json_build_object(
    'session', row_to_json(v_session),
    'intake', case when v_intake.id is not null then row_to_json(v_intake) else null end,
    'assessment', case when v_assessment.id is not null then row_to_json(v_assessment) else null end,
    'report', case when v_report.id is not null then row_to_json(v_report) else null end
  );
end;
$$;

grant execute on function public.get_internal_report_for_assignment(uuid) to authenticated;

-- 10. Fetch client-facing report for an assignment
create or replace function public.get_client_report_for_assignment(p_assignment_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.client_submission_assignments;
  v_session record;
  v_intake record;
  v_assessment record;
  v_report record;
  v_edits json;
begin
  select * into v_row from public.client_submission_assignments where id = p_assignment_id;
  if v_row.id is null then
    raise exception 'Assignment not found';
  end if;
  if v_row.source_type <> 'assessment' then
    raise exception 'Wrong assignment type';
  end if;
  if not public.can_access_client(v_row.client_id) then
    raise exception 'Not authorized';
  end if;

  select id, intake_id, assessment_id, submitted_at, status
    into v_session
  from public.assessment_sessions where id = v_row.source_id;

  if v_session.intake_id is not null then
    select * into v_intake from public.assessment_intakes where id = v_session.intake_id;
  end if;

  select * into v_assessment from public.assessments where id = v_session.assessment_id;
  select * into v_report from public.internal_assessment_reports where session_id = v_session.id;

  select coalesce(json_agg(row_to_json(e)), '[]'::json) into v_edits
  from public.client_report_edits e
  where e.session_id = v_session.id;

  return json_build_object(
    'session', row_to_json(v_session),
    'intake', case when v_intake.id is not null then row_to_json(v_intake) else null end,
    'assessment', case when v_assessment.id is not null then row_to_json(v_assessment) else null end,
    'report', case when v_report.id is not null then row_to_json(v_report) else null end,
    'edits', v_edits
  );
end;
$$;

grant execute on function public.get_client_report_for_assignment(uuid) to authenticated;
