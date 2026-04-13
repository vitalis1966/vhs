import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://ilbhphreyvaoomhpvaxi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmhwaHJleXZhb29taHB2YXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDQwODAsImV4cCI6MjA4ODU4MDA4MH0.XWJxYAndKB_Xs2DE1BkN_7t7YU94JPMEepMYTvQMK_c";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
export {
  supabase as s
};
