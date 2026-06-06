
-- Soft delete columns
ALTER TABLE public.inbound_emails
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE INDEX IF NOT EXISTS idx_inbound_emails_live
  ON public.inbound_emails(workspace_id, received_at DESC)
  WHERE deleted_at IS NULL;

-- Audit table for deletions
CREATE TABLE IF NOT EXISTS public.inbound_email_deletions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL,
  workspace_id uuid,
  from_email text,
  subject text,
  deleted_by uuid,
  deleted_at timestamptz NOT NULL DEFAULT now(),
  mode text NOT NULL CHECK (mode IN ('soft','hard'))
);

GRANT SELECT ON public.inbound_email_deletions TO authenticated;
GRANT ALL ON public.inbound_email_deletions TO service_role;

ALTER TABLE public.inbound_email_deletions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inbound_email_deletions_select" ON public.inbound_email_deletions;
CREATE POLICY "inbound_email_deletions_select"
  ON public.inbound_email_deletions FOR SELECT TO authenticated
  USING (workspace_id IS NOT NULL AND public.is_workspace_admin_or_manager(workspace_id));

-- Capture any hard delete (even direct SQL) into the audit table
CREATE OR REPLACE FUNCTION public.audit_inbound_email_hard_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.inbound_email_deletions
    (email_id, workspace_id, from_email, subject, deleted_by, mode)
  VALUES
    (OLD.id, OLD.workspace_id, OLD.from_email, OLD.subject, auth.uid(), 'hard');
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_inbound_emails_audit_delete ON public.inbound_emails;
CREATE TRIGGER trg_inbound_emails_audit_delete
  BEFORE DELETE ON public.inbound_emails
  FOR EACH ROW EXECUTE FUNCTION public.audit_inbound_email_hard_delete();

-- Permission helper used by RPCs
CREATE OR REPLACE FUNCTION public.can_manage_inbound_email(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = p_id
      AND (
        e.assigned_to = auth.uid()
        OR public.is_workspace_admin_or_manager(e.workspace_id)
      )
  );
$$;

-- Soft delete (single)
CREATE OR REPLACE FUNCTION public.soft_delete_inbound_email(p_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_row public.inbound_emails;
BEGIN
  IF NOT public.can_manage_inbound_email(p_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.inbound_emails
     SET deleted_at = now(), deleted_by = auth.uid()
   WHERE id = p_id AND deleted_at IS NULL
   RETURNING * INTO v_row;

  IF v_row.id IS NOT NULL THEN
    INSERT INTO public.inbound_email_deletions
      (email_id, workspace_id, from_email, subject, deleted_by, mode)
    VALUES
      (v_row.id, v_row.workspace_id, v_row.from_email, v_row.subject, auth.uid(), 'soft');
  END IF;

  RETURN p_id;
END;
$$;

-- Soft delete (batch)
CREATE OR REPLACE FUNCTION public.soft_delete_inbound_emails(p_ids uuid[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid; v_count integer := 0;
BEGIN
  FOREACH v_id IN ARRAY p_ids LOOP
    BEGIN
      PERFORM public.soft_delete_inbound_email(v_id);
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      -- skip unauthorized rows silently
      NULL;
    END;
  END LOOP;
  RETURN v_count;
END;
$$;

-- Restore
CREATE OR REPLACE FUNCTION public.restore_inbound_email(p_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.can_manage_inbound_email(p_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.inbound_emails
     SET deleted_at = NULL, deleted_by = NULL
   WHERE id = p_id;
  RETURN p_id;
END;
$$;

-- Permanent delete (admins/managers only, must already be trashed)
CREATE OR REPLACE FUNCTION public.hard_delete_inbound_email(p_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_wid uuid; v_deleted timestamptz;
BEGIN
  SELECT workspace_id, deleted_at INTO v_wid, v_deleted
    FROM public.inbound_emails WHERE id = p_id;
  IF v_wid IS NULL THEN
    RAISE EXCEPTION 'Not found';
  END IF;
  IF NOT public.is_workspace_admin_or_manager(v_wid) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF v_deleted IS NULL THEN
    RAISE EXCEPTION 'Email must be in trash before it can be permanently deleted';
  END IF;
  DELETE FROM public.inbound_emails WHERE id = p_id;
  RETURN p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_inbound_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.soft_delete_inbound_emails(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_inbound_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hard_delete_inbound_email(uuid) TO authenticated;
