
import { createClient } from '@supabase/supabase-js';

// We'll use environment variables later for the URL and anon key
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://zajsujrzfuuyjbmdabca.supabase.co', 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphanN1anJ6ZnV1eWpibWRhYmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDIzNjgsImV4cCI6MjA2MDY3ODM2OH0.g_bUvQV-HKqtO49ZQnjgvNy0Ar2CdTw6zknFA3esF0k'
);
