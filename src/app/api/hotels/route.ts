import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "database", "hotels.json");

function readHotels(): any[] {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}
function writeHotels(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET single hotel by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const hotels = readHotels();
  if (id) {
    const hotel = hotels.find((h) => h.id === id);
    if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hotel);
  }
  return NextResponse.json(hotels);
}

// POST — tambah hotel baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotels = readHotels();
    const newHotel = {
      id: `htl-${Date.now()}`,
      name: body.name,
      slug: body.slug,
      city_id: body.city_id || "",
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
      categories: [], facilities: [], images: [],
      affiliate_links: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    hotels.push(newHotel);
    writeHotels(hotels);
    return NextResponse.json(newHotel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update hotel
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const hotels = readHotels();
    const idx = hotels.findIndex((h) => h.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    hotels[idx] = { ...hotels[idx], ...updates, updated_at: new Date().toISOString() };
    writeHotels(hotels);
    return NextResponse.json(hotels[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — hapus hotel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    let hotels = readHotels();
    hotels = hotels.filter((h) => h.id !== id);
    writeHotels(hotels);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
