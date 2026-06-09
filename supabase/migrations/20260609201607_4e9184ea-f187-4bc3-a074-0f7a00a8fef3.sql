
CREATE OR REPLACE FUNCTION public.sync_gantt_from_meeting()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.summary_sent_at IS NOT NULL AND OLD.summary_sent_at IS NULL THEN
    UPDATE public.gantt_items
       SET is_complete = true, progress = 100, status = 'complete'
     WHERE linked_meeting_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;
