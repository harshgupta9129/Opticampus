import { createClient } from '@supabase/supabase-js';

// These variables must be in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseKey);