import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization — client hanya dibuat saat pertama kali dibutuhkan,
// bukan saat module di-import (mencegah crash saat build time jika env belum diset)
let _supabase: SupabaseClient | null = null;
let _supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
      );
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
      );
    }
    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

// Shorthand — untuk backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});
