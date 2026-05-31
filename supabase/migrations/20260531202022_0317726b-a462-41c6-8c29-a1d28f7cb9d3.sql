
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_client_name text;
  v_old_status text;
  v_new_status text;
  v_actor uuid := auth.uid();
BEGIN
  IF NEW.status_id IS NOT DISTINCT FROM OLD.status_id THEN
    RETURN NEW;
  END IF;

  SELECT account_owner_id, name INTO v_owner, v_client_name
  FROM public.clients WHERE id = NEW.client_id;

  IF v_owner IS NULL OR v_owner = v_actor THEN
    RETURN NEW;
  END IF;

  SELECT name INTO v_old_status FROM public.task_statuses WHERE id = OLD.status_id;
  SELECT name INTO v_new_status FROM public.task_statuses WHERE id = NEW.status_id;

  INSERT INTO public.notifications (user_id, workspace_id, type, title, body, link_url, entity_type, entity_id, actor_id)
  VALUES (
    v_owner,
    NEW.workspace_id,
    'status_changed',
    'Task status changed: ' || COALESCE(NEW.title, 'Untitled'),
    'Status moved from ' || COALESCE(v_old_status, 'None') || ' to ' || COALESCE(v_new_status, 'None') || ' on ' || COALESCE(v_client_name, 'client') || '.',
    '/app/tasks?task=' || NEW.id::text,
    'task',
    NEW.id,
    v_actor
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_task_status_change ON public.tasks;
CREATE TRIGGER trg_notify_task_status_change
AFTER UPDATE OF status_id ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_task_status_change();
