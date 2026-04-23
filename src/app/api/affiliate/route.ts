import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "database", "hotels.json");

function readHotels(): any[] {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function writeHotels(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET affiliate links untuk satu hotel
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotel_id = searchParams.get("hotel_id");
  if (!hotel_id) return NextResponse.json({ error: "hotel_id required" }, { status: 400 });
  const hotels = readHotels();
  const hotel = hotels.find((h) => h.id === hotel_id);
  if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  return NextResponse.json(hotel.affiliate_links || []);
}

// POST — upsert affiliate links untuk satu hotel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotel_id, links } = body;
    if (!hotel_id) return NextResponse.json({ error: "hotel_id required" }, { status: 400 });

    const hotels = readHotels();
    const idx = hotels.findIndex((h) => h.id === hotel_id);
    if (idx === -1) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    const providers = ["traveloka", "tiketcom", "agoda"] as const;
    const existing: any[] = hotels[idx].affiliate_links || [];

    for (const provider of providers) {
      const linkData = links[provider];
      if (!linkData?.url) continue;

      const existingIdx = existing.findIndex((l: any) => l.provider === provider);
      const updated = {
        id: existingIdx >= 0 ? existing[existingIdx].id : `afl-${Date.now()}-${provider}`,
        hotel_id,
        provider,
        affiliate_url: linkData.url,
        deeplink_url: linkData.deeplink || "#",
        is_active: linkData.active ?? true,
        last_checked_at: new Date().toISOString(),
        created_at: existingIdx >= 0 ? existing[existingIdx].created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        existing[existingIdx] = updated;
      } else {
        existing.push(updated);
      }
    }

    hotels[idx].affiliate_links = existing;
    hotels[idx].updated_at = new Date().toISOString();
    writeHotels(hotels);

    return NextResponse.json({ success: true, affiliate_links: existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
