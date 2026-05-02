import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotel_id = searchParams.get("hotel_id");
  if (!hotel_id) return NextResponse.json({ error: "hotel_id required" }, { status: 400 });
  const { data } = await getSupabase()
    .from("affiliate_links")
    .select("*")
    .eq("hotel_id", hotel_id);
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const { hotel_id, links } = await request.json();
    if (!hotel_id) return NextResponse.json({ error: "hotel_id required" }, { status: 400 });
    const supabase = getSupabase();
    const providers = ["traveloka", "tiketcom", "agoda"] as const;
    const results: any[] = [];

    for (const provider of providers) {
      const link = links[provider];
      if (!link?.url) continue;
      const { data, error } = await supabase
        .from("affiliate_links")
        .upsert(
          {
            hotel_id,
            provider,
            affiliate_url: link.url,
            deeplink_url: link.deeplink || "#",
            is_active: link.active ?? true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "hotel_id,provider" }
        )
        .select()
        .single();
      if (!error && data) results.push(data);
    }
    return NextResponse.json({ success: true, updated: results.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { hotel_ids, provider, is_active, affiliate_url, deeplink_url } = await request.json();
    if (!Array.isArray(hotel_ids) || hotel_ids.length === 0) {
      return NextResponse.json({ error: "hotel_ids required" }, { status: 400 });
    }
    if (!provider || provider === "all") {
      return NextResponse.json({ error: "provider required for bulk edit" }, { status: 400 });
    }
    const supabase = getSupabase();

    if (affiliate_url) {
      // Bulk upsert: insert/update URL for all selected hotels
      const rows = hotel_ids.map((hotel_id: string) => ({
        hotel_id,
        provider,
        affiliate_url,
        deeplink_url: deeplink_url || "#",
        is_active: is_active ?? true,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase
        .from("affiliate_links")
        .upsert(rows, { onConflict: "hotel_id,provider" });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, upserted: rows.length });
    }

    // Bulk toggle is_active only (update existing records)
    const { error } = await supabase
      .from("affiliate_links")
      .update({ is_active, updated_at: new Date().toISOString() })
      .in("hotel_id", hotel_ids)
      .eq("provider", provider);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { error } = await getSupabase().from("affiliate_links").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
