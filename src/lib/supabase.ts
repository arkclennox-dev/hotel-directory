import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client: uses service role key (bypasses RLS)
// Only used in server components and API routes
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Browser-safe client: uses anon key (respects RLS)
// Use this in client components if direct Supabase access is needed
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
