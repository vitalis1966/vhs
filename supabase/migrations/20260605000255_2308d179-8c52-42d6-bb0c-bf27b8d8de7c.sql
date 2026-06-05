CREATE OR REPLACE FUNCTION public.admin_update_member_name(p_member_id uuid, p_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wid uuid;
  v_uid uuid;
BEGIN
  SELECT workspace_id, user_id INTO v_wid, v_uid
  FROM public.workspace_members WHERE id = p_member_id;
  IF v_wid IS NULL THEN
    RAISE EXCEPTION 'Member not found';
  END IF;
  IF NOT public.is_workspace_admin(v_wid) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.workspace_members
    SET invited_name = p_name
    WHERE id = p_member_id;
  IF v_uid IS NOT NULL THEN
    UPDATE public.profiles SET full_name = p_name WHERE id = v_uid;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_member_name(uuid, text) TO authenticated;