ALTER TABLE public.gantt_items
  ADD COLUMN IF NOT EXISTS baseline_start date,
  ADD COLUMN IF NOT EXISTS baseline_end date,
  ADD COLUMN IF NOT EXISTS baseline_set_at timestamp with time zone;