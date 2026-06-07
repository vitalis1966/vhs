CREATE OR REPLACE FUNCTION public.get_internal_report_for_assignment(p_assignment_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_row public.client_submission_assignments;
  v_session record;
  v_intake record;
  v_assessment record;
  v_report record;
  v_sections json;
  v_responses json;
begin
  select * into v_row from public.client_submission_assignments where id = p_assignment_id;
  if v_row.id is null then raise exception 'Assignment not found'; end if;
  if v_row.source_type <> 'assessment' then raise exception 'Wrong assignment type'; end if;
  if not public.can_access_client(v_row.client_id) then raise exception 'Not authorized'; end if;

  select id, intake_id, assessment_id, submitted_at, status, meeting_booked, meeting_booked_by
    into v_session
  from public.assessment_sessions where id = v_row.source_id;

  if v_session.intake_id is not null then
    select * into v_intake from public.assessment_intakes where id = v_session.intake_id;
  end if;

  select * into v_assessment from public.assessments where id = v_session.assessment_id;
  select * into v_report from public.internal_assessment_reports where session_id = v_session.id;

  -- Sections with nested questions
  select coalesce(json_agg(sec_json order by (sec_json->>'sort_order')::int), '[]'::json)
    into v_sections
  from (
    select json_build_object(
      'id', s.id,
      'title', s.title,
      'sort_order', s.sort_order,
      'questions', (
        select coalesce(json_agg(row_to_json(q) order by q.sort_order), '[]'::json)
        from public.assessment_questions q
        where q.section_id = s.id
      )
    ) as sec_json
    from public.assessment_sections s
    where s.assessment_id = v_session.assessment_id
  ) t;

  select coalesce(json_agg(row_to_json(r)), '[]'::json) into v_responses
  from public.assessment_responses r
  where r.session_id = v_session.id;

  return json_build_object(
    'session', row_to_json(v_session),
    'intake', case when v_intake.id is not null then row_to_json(v_intake) else null end,
    'assessment', case when v_assessment.id is not null then row_to_json(v_assessment) else null end,
    'report', case when v_report.id is not null then row_to_json(v_report) else null end,
    'sections', v_sections,
    'responses', v_responses
  );
end;
$function$;