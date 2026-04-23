import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = getSupabase();
  if (id) {
    const { data, error } = await supabase
      .from("hotels")
      .select("*, city:cities(*), affiliate_links(*)")
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }
  const { data } = await supabase.from("hotels").select("*, city:cities(*)").order("name");
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("hotels")
      .insert([{
        name: body.name,
        slug: body.slug,
        city_id: body.city_id || null,
        short_description: body.short_description || "",
        full_description: body.full_description || "",
        address: body.address || "",
        latitude: 0, longitude: 0,
        star_rating: Number(body.star_rating) || 3,
        guest_rating: 0, review_count: 0,
        price_from: Number(body.price_from) || 0,
        price_to: Number(body.price_to) || 0,
        currency: "IDR",
        property_type: body.property_type || "Hotel",
        check_in_time: "14:00", check_out_time: "12:00",
        phone: body.phone || "", website_url: body.website_url || "",
        hero_image_url: body.hero_image_url || "",
        is_featured: Boolean(body.is_featured),
        is_published: body.is_published ?? true,
        seo_title: body.seo_title || body.name,
        seo_description: body.seo_description || body.short_description || "",
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
    const body = await request.json();
    const { id, city, affiliate_links, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("hotels")
      .update({ ...updates, updated_at: new Date().toISOString() })
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("hotels").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
