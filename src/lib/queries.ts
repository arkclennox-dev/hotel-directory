import { supabase } from "@/lib/supabase";
import { Hotel, City, Category, Landmark, BlogPost, SearchFilters, PaginatedResult } from "@/lib/types";

// Helper function to safely extract data or return empty array/null
const getSupabaseData = async <T>(query: any): Promise<T> => {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase error:", error);
    return null as any;
  }
  return data as T;
};

// ===== CITIES =====

export async function getCities(): Promise<City[]> {
  const { data } = await supabase.from("cities").select("*").order("name");
  return data || [];
}

export async function getFeaturedCities(): Promise<City[]> {
  const { data } = await supabase.from("cities").select("*").eq("is_featured", true).order("name");
  return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const { data } = await supabase.from("cities").select("*").eq("slug", slug).single();
  return data || undefined;
}

// ===== CATEGORIES =====

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").eq("is_featured", true).order("name");
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data || undefined;
}

export async function getCategoriesByType(type: string): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").eq("type", type).order("name");
  return data || [];
}

// ===== HOTELS =====

export async function getHotels(): Promise<Hotel[]> {
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*), images:hotel_images(*), affiliate_links(*)")
    .eq("slug", slug)
    .single();
  return data || undefined;
}

export async function getHotelsByCity(cityId: string): Promise<Hotel[]> {
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .eq("city_id", cityId)
    .eq("is_published", true);
  return data || [];
}

export async function getHotelsByCitySlug(citySlug: string): Promise<Hotel[]> {
  const city = await getCityBySlug(citySlug);
  if (!city) return [];
  return getHotelsByCity(city.id);
}

export async function getSimilarHotels(hotel: Hotel, limit: number = 4): Promise<Hotel[]> {
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .neq("id", hotel.id)
    .eq("is_published", true)
    .eq("city_id", hotel.city_id)
    .limit(limit);
  
  if (data && data.length > 0) return data;

  // Fallback to star rating if no hotel in same city
  const { data: fallbackData } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .neq("id", hotel.id)
    .eq("is_published", true)
    .eq("star_rating", hotel.star_rating)
    .limit(limit);
    
  return fallbackData || [];
}

export async function searchHotels(filters: SearchFilters): Promise<PaginatedResult<Hotel>> {
  let queryObj = supabase
    .from("hotels")
    .select("*, city:cities(*)", { count: "exact" })
    .eq("is_published", true);

  if (filters.query) {
    queryObj = queryObj.or(`name.ilike.%${filters.query}%,short_description.ilike.%${filters.query}%,address.ilike.%${filters.query}%`);
  }

  if (filters.city_slug) {
    const city = await getCityBySlug(filters.city_slug);
    if (city) {
      queryObj = queryObj.eq("city_id", city.id);
    }
  }

  // Category filter requires join or JSON array contains. 
  // For simplicity, we skip category exact filter here if it's too complex without a junction table RPC,
  // but if hotels have a categories array or junction table, we'd query it.
  
  if (filters.price_min !== undefined) {
    queryObj = queryObj.gte("price_from", filters.price_min);
  }
  
  if (filters.price_max !== undefined) {
    queryObj = queryObj.lte("price_from", filters.price_max);
  }

  if (filters.star_rating !== undefined) {
    queryObj = queryObj.gte("star_rating", filters.star_rating);
  }

  if (filters.guest_rating_min !== undefined) {
    queryObj = queryObj.gte("guest_rating", filters.guest_rating_min);
  }

  if (filters.property_type) {
    queryObj = queryObj.ilike("property_type", filters.property_type);
  }

  // Sorting
  switch (filters.sort_by) {
    case "price_low":
      queryObj = queryObj.order("price_from", { ascending: true });
      break;
    case "price_high":
      queryObj = queryObj.order("price_from", { ascending: false });
      break;
    case "rating":
      queryObj = queryObj.order("guest_rating", { ascending: false });
      break;
    case "newest":
      queryObj = queryObj.order("created_at", { ascending: false });
      break;
    case "popular":
    default:
      queryObj = queryObj.order("review_count", { ascending: false });
      break;
  }

  // Pagination
  const page = filters.page || 1;
  const per_page = filters.per_page || 12;
  const start = (page - 1) * per_page;
  
  queryObj = queryObj.range(start, start + per_page - 1);

  const { data, count, error } = await queryObj;
  
  if (error) {
    console.error("Search error:", error);
    return { data: [], total: 0, page, per_page, total_pages: 0 };
  }

  const total = count || 0;
  return {
    data: data as Hotel[],
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  };
}

// ===== LANDMARKS =====

export async function getLandmarks(): Promise<Landmark[]> {
  const { data } = await supabase.from("landmarks").select("*");
  return data || [];
}

export async function getFeaturedLandmarks(): Promise<Landmark[]> {
  const { data } = await supabase.from("landmarks").select("*").eq("is_featured", true);
  return data || [];
}

export async function getLandmarkBySlug(slug: string): Promise<Landmark | undefined> {
  const { data } = await supabase.from("landmarks").select("*, city:cities(*)").eq("slug", slug).single();
  return data || undefined;
}

export async function getLandmarksByCity(cityId: string): Promise<Landmark[]> {
  const { data } = await supabase.from("landmarks").select("*").eq("city_id", cityId);
  return data || [];
}

// ===== FACILITIES =====

export async function getFacilities(): Promise<any[]> {
  const { data } = await supabase.from("facilities").select("*");
  return data || [];
}

// ===== BLOG =====

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data || undefined;
}

export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data || [];
}

// ===== STATS =====

export async function getSiteStats() {
  const [
    { count: hotelsCount },
    { count: citiesCount },
    { count: categoriesCount }
  ] = await Promise.all([
    supabase.from("hotels").select("*", { count: "exact", head: true }),
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true })
  ]);

  return {
    totalHotels: hotelsCount || 0,
    totalCities: citiesCount || 0,
    totalCategories: categoriesCount || 0,
    totalLandmarks: 0,
    partners: 3,
  };
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  // Admin route to get all posts including drafts
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getAllHotelsAdmin(): Promise<Hotel[]> {
  // Admin route to get all hotels including drafts
  const { data } = await supabase
    .from("hotels")
    .select("*, city:cities(*)")
    .order("created_at", { ascending: false });
  return data || [];
}
