import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkApiKey } from "@/lib/api-auth";
import { Hotel, AffiliateLink } from "@/lib/types";

export async function POST(request: Request) {
  const authResponse = checkApiKey(request);
  if (authResponse) return authResponse;

  try {
    const payload = await request.json();
    
    if (!payload.hotel_id || !payload.provider || !payload.affiliate_url) {
      return NextResponse.json({ error: "Missing required fields: hotel_id, provider, affiliate_url" }, { status: 400 });
    }

    // Read current DB
    const dbPath = path.join(process.cwd(), "database", "hotels.json");
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const hotels: Hotel[] = JSON.parse(rawData);

    const hotelIndex = hotels.findIndex(h => h.id === payload.hotel_id);
    if (hotelIndex === -1) {
      return NextResponse.json({ error: "Hotel ID not found" }, { status: 404 });
    }

    const newLink: AffiliateLink = {
      id: "afl-" + Date.now().toString(),
      hotel_id: payload.hotel_id,
      provider: payload.provider, // traveloka | tiketcom | agoda
      affiliate_url: payload.affiliate_url,
      deeplink_url: payload.deeplink_url || "#",
      is_active: true,
      last_checked_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Ensure array exists
    if (!hotels[hotelIndex].affiliate_links) {
      hotels[hotelIndex].affiliate_links = [];
    }

    // Replace if provider already exists, else push
    const existingProviderIndex = hotels[hotelIndex].affiliate_links!.findIndex(l => l.provider === payload.provider);
    if (existingProviderIndex !== -1) {
      hotels[hotelIndex].affiliate_links![existingProviderIndex] = newLink;
    } else {
      hotels[hotelIndex].affiliate_links!.push(newLink);
    }

    // Serialize and Write Back
    fs.writeFileSync(dbPath, JSON.stringify(hotels, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Affiliate link added/updated", affiliate_link: newLink }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid payload or internal error: " + error.message }, { status: 400 });
  }
}
