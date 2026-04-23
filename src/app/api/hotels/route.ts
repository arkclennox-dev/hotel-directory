import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from("hotels")
      .insert([{
        name: body.name,
        slug: body.slug,
        city_id: body.city_id || null,
        short_description: body.short_description,
        full_description: body.full_description || "",
        address: body.address || "",
        star_rating: body.star_rating || 3,
        guest_rating: 0,
        review_count: 0,
        price_from: body.price_from || 0,
        price_to: body.price_to || 0,
        currency: "IDR",
        property_type: body.property_type || "Hotel",
        check_in_time: "14:00",
        check_out_time: "12:00",
        phone: body.phone || "",
        website_url: body.website_url || "",
        hero_image_url: body.hero_image_url || "",
        is_featured: body.is_featured || false,
        is_published: body.is_published ?? true,
        seo_title: body.seo_title || body.name,
        seo_description: body.seo_description || body.short_description,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("hotels")
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
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("hotels").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
