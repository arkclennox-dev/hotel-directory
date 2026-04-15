import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility ini digunakan oleh queries jika sudah beralih dari Mock JSON
// Contoh: 
// const { data } = await supabase.from('hotels').select('*')
