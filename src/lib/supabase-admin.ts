// src/lib/supabase-admin.ts (New File or modify existing)
import { createClient } from '@supabase/supabase-js';

// Check for server-side variables first
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Fallback to public keys if server keys aren't available (less secure for inserts/updates)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;


if (!supabaseUrl || !(supabaseServiceKey || supabaseAnonKey)) {
  console.error('Missing Supabase environment variables for server/admin client');
  // Decide how to handle this - throw error or try to proceed with limited functionality
}

// Prefer Service Key for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl || publicUrl!, // Use server URL first
  // Use service key if available, otherwise fall back VERY carefully to anon key
  // It's generally better practice to ensure the service key is always used in API routes.
  supabaseServiceKey || supabaseAnonKey!
);

// Keep the original export if needed for client-side/less privileged server actions
export const supabase = createClient(
 publicUrl!,
 supabaseAnonKey!
);