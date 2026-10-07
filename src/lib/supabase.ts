import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables.');
}

// Service role key / Secret key bypasses RLS for administrative server operations
export const supabase = createClient(supabaseUrl, supabaseSecretKey);