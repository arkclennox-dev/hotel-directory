import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = getSupabase();
  if (id) {
    const { data, error } = await supabase
      .from("landmarks")
      .select("*, city:cities(name, slug)")
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }
  const { data } = await supabase
    .from("landmarks")
    .select("*, city:cities(name, slug)")
    .order("name");
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("landmarks")
      .insert([{
        id: crypto.randomUUID(),
        city_id: body.city_id || null,
        name: body.name,
        slug: body.slug,
        type: body.type || "wisata",
        description: body.description || "",
        address: body.address || "",
        latitude: Number(body.latitude) || 0,
        longitude: Number(body.longitude) || 0,
        is_featured: Boolean(body.is_featured),
        seo_title: body.seo_title || body.name,
        seo_description: body.seo_description || "",
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
    const { id, city, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { data, error } = await getSupabase()
      .from("landmarks")
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
    const { error } = await getSupabase().from("landmarks").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
