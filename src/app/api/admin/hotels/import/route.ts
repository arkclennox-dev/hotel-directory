import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Pemetaan nama kolom CSV/XLSX → field hotel di Supabase (case-insensitive, spasi/underscore diabaikan)
const FIELD_ALIASES: Record<string, string[]> = {
  name:              ["name", "nama", "namahotel", "hotelname"],
  slug:              ["slug", "urlslug", "url"],
  city_id:           ["cityid", "kotaid", "idkota", "city_id"],
  short_description: ["shortdescription", "shortdesc", "deskripssingkat", "deskripsipendek"],
  full_description:  ["fulldescription", "deskripsilengkap", "deskripsi", "description"],
  address:           ["address", "alamat"],
  latitude:          ["latitude", "lat"],
  longitude:         ["longitude", "lng", "lon", "long"],
  star_rating:       ["starrating", "bintang", "stars", "star"],
  guest_rating:      ["guestrating", "ratingtamu", "rating"],
  review_count:      ["reviewcount", "julahumasan", "ulasan", "reviews"],
  price_from:        ["pricefrom", "hargamulai", "hargadari", "hargamin", "pricefrom"],
  price_to:          ["priceto", "hargasampai", "hargamax", "hargamaksimal"],
  currency:          ["currency", "matauang"],
  property_type:     ["propertytype", "tipeproperti", "tipe", "type"],
  check_in_time:     ["checkintime", "checkin", "checkin_time", "waktumasuk"],
  check_out_time:    ["checkouttime", "checkout", "checkout_time", "waktukeluar"],
  phone:             ["phone", "telepon", "notelepon", "nohp"],
  website_url:       ["websiteurl", "website", "url_website"],
  hero_image_url:    ["heroimageurl", "imageurl", "heroimage", "foto", "gambar", "image"],
  is_featured:       ["isfeatured", "featured", "unggulan"],
  is_published:      ["ispublished", "published", "status", "aktif"],
  seo_title:         ["seotitle", "seo_title"],
  seo_description:   ["seodescription", "seo_description"],
};

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[\s\-_]+/g, "");
}

function buildAliasMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const alias of aliases) {
      map.set(normalizeKey(alias), field);
    }
  }
  return map;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseBool(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") {
    const v = val.toLowerCase().trim();
    return v === "true" || v === "1" || v === "yes" || v === "ya" || v === "aktif";
  }
  return true;
}

function parseNum(val: unknown): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: Record<string, unknown>[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Tidak ada data baris yang dikirim." }, { status: 400 });
    }

    const aliasMap = buildAliasMap();

    // Deteksi header dari baris pertama
    const headers = Object.keys(rows[0]);
    const colMap: Record<string, string> = {};
    for (const header of headers) {
      const field = aliasMap.get(normalizeKey(header));
      if (field) colMap[header] = field;
    }

    const supabase = getSupabase();

    // Ambil semua hotel yang sudah ada untuk deteksi duplikat
    const { data: existing } = await supabase.from("hotels").select("id, slug");
    const existingMap = new Map((existing || []).map((h) => [h.slug, h.id]));

    const toUpsert: Record<string, unknown>[] = [];
    const skipped: string[] = [];

    for (const row of rows) {
      // Map kolom CSV → field hotel
      const mapped: Record<string, unknown> = {};
      for (const [csvCol, field] of Object.entries(colMap)) {
        const val = row[csvCol];
        if (val !== undefined && val !== null && val !== "") {
          mapped[field] = val;
        }
      }

      // Wajib ada nama
      if (!mapped.name || String(mapped.name).trim() === "") {
        skipped.push(`Baris tanpa nama: ${JSON.stringify(row)}`);
        continue;
      }

      const name = String(mapped.name).trim();

      const slug = mapped.slug ? String(mapped.slug) : slugify(name);
      // Pakai ID lama jika slug sudah ada (update), atau generate UUID baru (insert)
      const existingId = existingMap.get(slug);
      const id = existingId ?? (mapped.id ? String(mapped.id) : crypto.randomUUID());

      // Bangun record akhir — kolom tidak ada di CSV → null/default
      const hotel: Record<string, unknown> = {
        id,
        name,
        slug,
        city_id:           mapped.city_id ?? null,
        short_description: mapped.short_description ? String(mapped.short_description) : "",
        full_description:  mapped.full_description ? String(mapped.full_description) : "",
        address:           mapped.address ? String(mapped.address) : "",
        latitude:          mapped.latitude !== undefined ? parseNum(mapped.latitude) : 0,
        longitude:         mapped.longitude !== undefined ? parseNum(mapped.longitude) : 0,
        star_rating:       mapped.star_rating !== undefined ? parseNum(mapped.star_rating) : 3,
        guest_rating:      mapped.guest_rating !== undefined ? parseNum(mapped.guest_rating) : 0,
        review_count:      mapped.review_count !== undefined ? parseNum(mapped.review_count) : 0,
        price_from:        mapped.price_from !== undefined ? parseNum(mapped.price_from) : 0,
        price_to:          mapped.price_to !== undefined ? parseNum(mapped.price_to) : 0,
        currency:          mapped.currency ? String(mapped.currency) : "IDR",
        property_type:     mapped.property_type ? String(mapped.property_type) : "Hotel",
        check_in_time:     mapped.check_in_time ? String(mapped.check_in_time) : "14:00",
        check_out_time:    mapped.check_out_time ? String(mapped.check_out_time) : "12:00",
        phone:             mapped.phone ? String(mapped.phone) : "",
        website_url:       mapped.website_url ? String(mapped.website_url) : "",
        hero_image_url:    mapped.hero_image_url ? String(mapped.hero_image_url) : "",
        is_featured:       mapped.is_featured !== undefined ? parseBool(mapped.is_featured) : false,
        is_published:      mapped.is_published !== undefined ? parseBool(mapped.is_published) : true,
        seo_title:         mapped.seo_title ? String(mapped.seo_title) : name,
        seo_description:   mapped.seo_description ? String(mapped.seo_description) : "",
        updated_at:        new Date().toISOString(),
      };

      // Tandai apakah ini insert baru atau update
      (hotel as any)._isNew = !existingId;

      toUpsert.push(hotel);
    }

    if (toUpsert.length === 0) {
      return NextResponse.json({
        success: true,
        inserted: 0,
        updated: 0,
        skipped: skipped.length,
        skipped_rows: skipped,
      });
    }

    const newCount = toUpsert.filter((h) => (h as any)._isNew).length;
    const updateCount = toUpsert.length - newCount;

    // Hapus flag internal sebelum upsert
    const cleanRows = toUpsert.map(({ _isNew, ...rest }) => rest);

    const { error } = await supabase
      .from("hotels")
      .upsert(cleanRows, { onConflict: "slug" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      inserted: newCount,
      updated: updateCount,
      skipped: skipped.length,
      skipped_rows: skipped,
      columns_detected: Object.values(colMap),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
