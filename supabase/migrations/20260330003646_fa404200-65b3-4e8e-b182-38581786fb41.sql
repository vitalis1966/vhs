ALTER TABLE public.portfolio_cases
  ADD COLUMN IF NOT EXISTS ext_situation      text,
  ADD COLUMN IF NOT EXISTS ext_challenge      text,
  ADD COLUMN IF NOT EXISTS ext_what_we_did    text,
  ADD COLUMN IF NOT EXISTS ext_results        text,
  ADD COLUMN IF NOT EXISTS ext_stat_1_value   text,
  ADD COLUMN IF NOT EXISTS ext_stat_1_label   text,
  ADD COLUMN IF NOT EXISTS ext_stat_2_value   text,
  ADD COLUMN IF NOT EXISTS ext_stat_2_label   text,
  ADD COLUMN IF NOT EXISTS ext_stat_3_value   text,
  ADD COLUMN IF NOT EXISTS ext_stat_3_label   text,
  ADD COLUMN IF NOT EXISTS ext_services       text[];