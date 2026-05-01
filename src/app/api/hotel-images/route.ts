import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotel_id = searchParams.get("hotel_id");
  if (!hotel_id) return NextResponse.json({ error: "hotel_id required" }, { status: 400 });
  const { data, error } = await getSupabase()
    .from("hotel_images")
    .select("*")
    .eq("hotel_id", hotel_id)
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.hotel_id || !body.image_url) {
      return NextResponse.json({ error: "hotel_id and image_url required" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("hotel_images")
      .select("sort_order")
      .eq("hotel_id", body.hotel_id)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 1;
    const { data, error } = await supabase
      .from("hotel_images")
      .insert([{
        id: crypto.randomUUID(),
        hotel_id: body.hotel_id,
        image_url: body.image_url,
        alt_text: body.alt_text || "",
        sort_order: body.sort_order ?? nextOrder,
      }])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { data, error } = await getSupabase()
      .from("hotel_images")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { error } = await getSupabase().from("hotel_images").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
