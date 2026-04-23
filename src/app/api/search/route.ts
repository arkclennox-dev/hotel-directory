import { NextRequest, NextResponse } from "next/server";
import { searchHotels } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "20");
  const city_slug = searchParams.get("city_slug") || undefined;
  const sort_by = (searchParams.get("sort_by") || "popular") as any;

  const result = await searchHotels({
    query,
    page,
    per_page,
    city_slug,
    sort_by,
  });

  return NextResponse.json(result);
}
