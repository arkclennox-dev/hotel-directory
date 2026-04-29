/**
 * queries.ts
 * Semua data bersumber dari Supabase.
 * Jalankan /api/seed?secret=... sekali untuk mengisi database dari JSON lokal.
 */

import { getSupabase } from "@/lib/supabase";
import { Hotel, City, Category, Landmark, BlogPost, SearchFilters, PaginatedResult } from "@/lib/types";

// =====================================================================
// CITIES
// =====================================================================
export async function getCities(): Promise<City[]> {
  const { data } = await getSupabase().from("cities").select("*").order("name");
  return (data as unknown || []) as City[];
}
export async function getFeaturedCities(): Promise<City[]> {
  const { data } = await getSupabase().from("cities").select("*").eq("is_featured", true).order("name");
  return (data as unknown || []) as City[];
}
export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const { data } = await getSupabase().from("cities").select("*").eq("slug", slug).single();
  return data as unknown as City | undefined;
}

// =====================================================================
// CATEGORIES
// =====================================================================
export async function getCategories(): Promise<Category[]> {
  const { data } = await getSupabase().from("categories").select("*").order("name");
  return (data as unknown || []) as Category[];
}
export async function getFeaturedCategories(): Promise<Category[]> {
  const { data } = await getSupabase().from("categories").select("*").eq("is_featured", true);
  return (data as unknown || []) as Category[];
}
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const { data } = await getSupabase().from("categories").select("*").eq("slug", slug).single();
  return data as unknown as Category | undefined;
}
export async function getCategoriesByType(type: string): Promise<Category[]> {
  const { data } = await getSupabase().from("categories").select("*").eq("type", type);
  return (data as unknown || []) as Category[];
}

// =====================================================================
// LANDMARKS (still local if not in Supabase)
// =====================================================================
export async function getLandmarks(): Promise<Landmark[]> {
  const { data } = await getSupabase().from("landmarks").select("*");
  return (data as unknown || []) as Landmark[];
}
export async function getFeaturedLandmarks(): Promise<Landmark[]> {
  const { data } = await getSupabase().from("landmarks").select("*").eq("is_featured", true);
  return (data as unknown || []) as Landmark[];
}
export async function getLandmarkBySlug(slug: string): Promise<Landmark | undefined> {
  const { data } = await getSupabase().from("landmarks").select("*").eq("slug", slug).single();
  return data as unknown as Landmark | undefined;
}
export async function getLandmarksByCity(cityId: string): Promise<Landmark[]> {
  const { data } = await getSupabase().from("landmarks").select("*").eq("city_id", cityId);
  return (data as unknown || []) as Landmark[];
}

// =====================================================================
// HOTELS
// =====================================================================
function buildHotelSelect() {
  return "*, city:cities(*), affiliate_links(*)";
}

export async function getHotels(): Promise<Hotel[]> {
  const { data } = await getSupabase()
    .from("hotels")
    .select(buildHotelSelect())
    .eq("is_published", true)
    .order("review_count", { ascending: false });
  return (data as unknown || []) as Hotel[];
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  const { data } = await getSupabase()
    .from("hotels")
    .select(buildHotelSelect())
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("review_count", { ascending: false });
  return (data as unknown || []) as Hotel[];
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const { data } = await getSupabase()
    .from("hotels")
    .select(buildHotelSelect())
    .eq("slug", slug)
    .single();
  return data as unknown as Hotel | undefined;
}

export async function getHotelsByCity(cityId: string): Promise<Hotel[]> {
  const { data } = await getSupabase()
    .from("hotels")
    .select(buildHotelSelect())
    .eq("city_id", cityId)
    .eq("is_published", true)
    .order("guest_rating", { ascending: false });
  return (data as unknown || []) as Hotel[];
}

export async function getSimilarHotels(hotel: Hotel, limit = 4): Promise<Hotel[]> {
  const { data } = await getSupabase()
    .from("hotels")
    .select(buildHotelSelect())
    .eq("city_id", hotel.city_id)
    .eq("is_published", true)
    .neq("id", hotel.id)
    .limit(limit);
  return (data as unknown || []) as Hotel[];
}

export async function searchHotels(filters: SearchFilters): Promise<PaginatedResult<Hotel>> {
  const supabase = getSupabase();
  let query = supabase
    .from("hotels")
    .select(buildHotelSelect(), { count: "exact" })
    .eq("is_published", true);

  if (filters.query) {
    query = query.or(
      `name.ilike.%${filters.query}%,short_description.ilike.%${filters.query}%,address.ilike.%${filters.query}%`
    );
  }
  if (filters.city_slug) {
    const { data: city } = await supabase.from("cities").select("id").eq("slug", filters.city_slug).single();
    if (city) query = query.eq("city_id", city.id);
  }
  if (filters.category_slug) {
    const { data: cat } = await supabase.from("categories").select("name, type").eq("slug", filters.category_slug).single();
    if (cat && cat.type === "tipe_properti") {
      query = query.ilike("property_type", `%${cat.name}%`);
    }
  }
  if (filters.price_min !== undefined) query = query.gte("price_from", filters.price_min);
  if (filters.price_max !== undefined) query = query.lte("price_from", filters.price_max);
  if (filters.star_rating !== undefined) query = query.gte("star_rating", filters.star_rating);
  if (filters.property_type) query = query.ilike("property_type", `%${filters.property_type}%`);

  switch (filters.sort_by) {
    case "price_low": query = query.order("price_from", { ascending: true }); break;
    case "price_high": query = query.order("price_from", { ascending: false }); break;
    case "rating": query = query.order("guest_rating", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    default: query = query.order("review_count", { ascending: false }); break;
  }

  const page = filters.page || 1;
  const per_page = filters.per_page || 12;
  const { data, count } = await query.range((page - 1) * per_page, page * per_page - 1);
  const total = count || 0;

  return {
    data: (data as unknown as Hotel[]) || [],
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  };
}

// =====================================================================
// BLOG
// =====================================================================
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data as unknown || []) as BlogPost[];
}
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as unknown as BlogPost | undefined;
}
export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as unknown || []) as BlogPost[];
}

// =====================================================================
// STATS
// =====================================================================
export async function getSiteStats() {
  const supabase = getSupabase();
  const [{ count: h }, { count: c }, { count: b }] = await Promise.all([
    supabase.from("hotels").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
  ]);
  return {
    totalHotels: h || 0,
    totalCities: c || 0,
    totalCategories: 0,
    totalLandmarks: 0,
    partners: 3,
  };
}

// =====================================================================
// ADMIN
// =====================================================================
export async function getAllHotelsAdmin(): Promise<any[]> {
  const { data } = await getSupabase()
    .from("hotels")
    .select("*, city:cities(name, slug), affiliate_links(*)")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getHotelByIdAdmin(id: string): Promise<any | undefined> {
  const { data } = await getSupabase()
    .from("hotels")
    .select("*, city:cities(*), affiliate_links(*)")
    .eq("id", id)
    .single();
  return data;
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as unknown || []) as BlogPost[];
}

export async function getBlogPostByIdAdmin(id: string): Promise<BlogPost | undefined> {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  return data as unknown as BlogPost | undefined;
}

export async function getAdminStats() {
  const supabase = getSupabase();
  const [{ count: hotels }, { count: cities }, { count: blog }, { count: affiliate }] = await Promise.all([
    supabase.from("hotels").select("*", { count: "exact", head: true }),
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("affiliate_links").select("*", { count: "exact", head: true }),
  ]);
  return {
    hotels: hotels || 0,
    cities: cities || 0,
    blogPosts: blog || 0,
    affiliateLinks: affiliate || 0,
  };
}
