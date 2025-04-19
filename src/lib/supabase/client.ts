
import { createClient } from '@supabase/supabase-js';

// We'll use environment variables later for the URL and anon key
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '', 
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);
