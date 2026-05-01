import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await getSupabase().from("cities").select("id, name, slug").order("name");
  return NextResponse.json(data || []);
}
