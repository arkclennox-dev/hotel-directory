import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkApiKey } from "@/lib/api-auth";
import { Hotel } from "@/lib/types";

export async function POST(request: Request) {
  const authResponse = checkApiKey(request);
  if (authResponse) return authResponse;

  try {
    const payload = await request.json();
    
    // Read current DB
    const dbPath = path.join(process.cwd(), "database", "hotels.json");
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const hotels: Hotel[] = JSON.parse(rawData);

    // AI Payload shape mapping
    const newHotel: Hotel = {
      id: "htl-" + Date.now().toString(),
      name: payload.name,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      city_id: payload.city_id || "city-001", // Default to Jakarta if unassigned
      short_description: payload.short_description || "",
      full_description: payload.full_description || "",
      address: payload.address || "",
      latitude: payload.latitude || 0,
      longitude: payload.longitude || 0,
      star_rating: payload.star_rating || 3,
      guest_rating: payload.guest_rating || 8.0,
      review_count: payload.review_count || 10,
      price_from: payload.price_from || 500000,
      price_to: payload.price_to || 1500000,
      currency: "IDR",
      property_type: payload.property_type || "Hotel",
      check_in_time: payload.check_in_time || "14:00",
      check_out_time: payload.check_out_time || "12:00",
      phone: payload.phone || "-",
      website_url: payload.website_url || "#",
      hero_image_url: payload.hero_image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop",
      is_featured: payload.is_featured || false,
      is_published: true,
      seo_title: payload.name + " — Harga Termurah",
      seo_description: payload.short_description || `Booking ${payload.name} dengan harga terbaik.`,
      categories: payload.categories || [],
      facilities: payload.facilities || [],
      images: payload.images || [],
      affiliate_links: payload.affiliate_links || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    hotels.push(newHotel); // Append to list

    // Serialize and Write Back
    fs.writeFileSync(dbPath, JSON.stringify(hotels, null, 2), "utf-8");

    return NextResponse.json({ success: true, hotel: newHotel }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid payload or internal error: " + error.message }, { status: 400 });
  }
}
