
import { createClient } from '@supabase/supabase-js';

// Provide default values that work during development
// In production, these should be replaced with real values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.example';

// This check prevents the error "supabaseUrl is required"
if (!supabaseUrl || supabaseUrl === 'https://example.supabase.co') {
  console.warn('Warning: VITE_SUPABASE_URL is not set. Using a placeholder that will not work for actual API calls.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
