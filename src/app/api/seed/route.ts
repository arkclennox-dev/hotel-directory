import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import citiesData from "../../../../database/cities.json";
import categoriesData from "../../../../database/categories.json";
import hotelsData from "../../../../database/hotels.json";
import blogPostsData from "../../../../database/blog-posts.json";

export async function POST(request: NextRequest) {
  // Proteksi: hanya bisa dijalankan dengan secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const log: string[] = [];

  try {
    // 1. Seed cities
    const { error: citiesErr } = await supabase
      .from("cities")
      .upsert(
        citiesData.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          province: c.province,
          island: c.island,
          description: c.description,
          hero_image_url: c.hero_image_url,
          latitude: c.latitude,
          longitude: c.longitude,
          is_featured: c.is_featured,
          hotel_count: c.hotel_count,
          seo_title: c.seo_title,
          seo_description: c.seo_description,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })),
        { onConflict: "id" }
      );
    if (citiesErr) throw new Error(`Cities: ${citiesErr.message}`);
    log.push(`✓ ${citiesData.length} cities seeded`);

    // 2. Seed categories
    const { error: catErr } = await supabase
      .from("categories")
      .upsert(
        categoriesData.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          description: c.description,
          icon: c.icon,
          hero_image_url: c.hero_image_url,
          is_featured: c.is_featured,
          seo_title: c.seo_title,
          seo_description: c.seo_description,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })),
        { onConflict: "id" }
      );
    if (catErr) throw new Error(`Categories: ${catErr.message}`);
    log.push(`✓ ${categoriesData.length} categories seeded`);

    // 3. Seed hotels (tanpa affiliate_links dan images yang nested)
    const { error: hotelsErr } = await supabase
      .from("hotels")
      .upsert(
        hotelsData.map((h: any) => ({
          id: h.id,
          name: h.name,
          slug: h.slug,
          city_id: h.city_id,
          short_description: h.short_description,
          full_description: h.full_description,
          address: h.address,
          latitude: h.latitude,
          longitude: h.longitude,
          star_rating: h.star_rating,
          guest_rating: h.guest_rating,
          review_count: h.review_count,
          price_from: h.price_from,
          price_to: h.price_to,
          currency: h.currency,
          property_type: h.property_type,
          check_in_time: h.check_in_time,
          check_out_time: h.check_out_time,
          phone: h.phone,
          website_url: h.website_url,
          hero_image_url: h.hero_image_url,
          is_featured: h.is_featured,
          is_published: h.is_published,
          seo_title: h.seo_title,
          seo_description: h.seo_description,
          created_at: h.created_at,
          updated_at: h.updated_at,
        })),
        { onConflict: "id" }
      );
    if (hotelsErr) throw new Error(`Hotels: ${hotelsErr.message}`);
    log.push(`✓ ${hotelsData.length} hotels seeded`);

    // 4. Seed affiliate_links (dari nested data di hotels.json)
    const allAffiliateLinks: any[] = [];
    hotelsData.forEach((h: any) => {
      if (h.affiliate_links && Array.isArray(h.affiliate_links)) {
        h.affiliate_links.forEach((link: any) => {
          allAffiliateLinks.push({
            id: link.id,
            hotel_id: link.hotel_id,
            provider: link.provider,
            affiliate_url: link.affiliate_url,
            deeplink_url: link.deeplink_url,
            is_active: link.is_active,
            last_checked_at: link.last_checked_at,
            created_at: link.created_at,
            updated_at: link.updated_at,
          });
        });
      }
    });
    if (allAffiliateLinks.length > 0) {
      const { error: aflErr } = await supabase
        .from("affiliate_links")
        .upsert(allAffiliateLinks, { onConflict: "id" });
      if (aflErr) throw new Error(`Affiliate links: ${aflErr.message}`);
      log.push(`✓ ${allAffiliateLinks.length} affiliate links seeded`);
    }

    // 5. Seed blog posts
    const { error: blogErr } = await supabase
      .from("blog_posts")
      .upsert(
        blogPostsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content_html: p.content_html,
          featured_image_url: p.featured_image_url,
          author_name: p.author_name,
          is_published: p.is_published,
          published_at: p.published_at,
          seo_title: p.seo_title,
          seo_description: p.seo_description,
          created_at: p.created_at,
          updated_at: p.updated_at,
        })),
        { onConflict: "id" }
      );
    if (blogErr) throw new Error(`Blog posts: ${blogErr.message}`);
    log.push(`✓ ${blogPostsData.length} blog posts seeded`);

    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, log }, { status: 500 });
  }
}
