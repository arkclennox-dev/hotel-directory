import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { hotel_id, links } = await request.json();

    if (!hotel_id) return NextResponse.json({ error: "hotel_id is required" }, { status: 400 });

    const providers = ["traveloka", "tiketcom", "agoda"] as const;
    const results = [];

    for (const provider of providers) {
      const link = links[provider];
      if (!link?.url) continue;

      // Upsert: update if exists, insert if not
      const { data, error } = await supabase
        .from("affiliate_links")
        .upsert(
          {
            hotel_id,
            provider,
            affiliate_url: link.url,
            deeplink_url: link.deeplink || "",
            is_active: link.active ?? true,
          },
          { onConflict: "hotel_id,provider" }
        )
        .select()
        .single();

      if (error) {
        console.error(`Error upserting ${provider}:`, error);
      } else {
        results.push(data);
      }
    }

    return NextResponse.json({ success: true, updated: results.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("affiliate_links").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
