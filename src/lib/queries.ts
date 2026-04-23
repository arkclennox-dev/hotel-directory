/**
 * queries.ts
 *
 * Strategi data:
 * - Halaman PUBLIK  → baca dari JSON lokal (database/*.json) — data cepat, tidak tergantung jaringan
 * - Admin Dashboard → baca/tulis ke Supabase secara langsung
 *
 * Ini memungkinkan website tetap berjalan selama Supabase belum di-seed,
 * sementara admin dashboard bisa mengelola data Supabase secara terpisah.
 */

import { getSupabase } from "@/lib/supabase";
import {
  cities as localCities,
  categories as localCategories,
  landmarks as localLandmarks,
  hotels as localHotels,
  blogPosts as localBlogPosts,
} from "@/lib/data";
import {
  Hotel, City, Category, Landmark, BlogPost, SearchFilters, PaginatedResult,
} from "@/lib/types";

// =====================================================================
// CITIES — local data
// =====================================================================

export async function getCities(): Promise<City[]> {
  return localCities;
}

export async function getFeaturedCities(): Promise<City[]> {
  return localCities.filter((c) => c.is_featured);
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  return localCities.find((c) => c.slug === slug);
}

// =====================================================================
// CATEGORIES — local data
// =====================================================================

export async function getCategories(): Promise<Category[]> {
  return localCategories;
}

export async function getFeaturedCategories(): Promise<Category[]> {
  return localCategories.filter((c) => c.is_featured);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return localCategories.find((c) => c.slug === slug);
}

export async function getCategoriesByType(type: string): Promise<Category[]> {
  return localCategories.filter((c) => c.type === type);
}

// =====================================================================
// LANDMARKS — local data
// =====================================================================

export async function getLandmarks(): Promise<Landmark[]> {
  return localLandmarks;
}

export async function getFeaturedLandmarks(): Promise<Landmark[]> {
  return localLandmarks.filter((l) => l.is_featured);
}

export async function getLandmarkBySlug(slug: string): Promise<Landmark | undefined> {
  return localLandmarks.find((l) => l.slug === slug);
}

export async function getLandmarksByCity(cityId: string): Promise<Landmark[]> {
  return localLandmarks.filter((l) => l.city_id === cityId);
}

// =====================================================================
// HOTELS — local data (public) + Supabase (admin)
// =====================================================================

export async function getHotels(): Promise<Hotel[]> {
  return localHotels
    .filter((h) => h.is_published)
    .map((h) => ({
      ...h,
      city: localCities.find((c) => c.id === h.city_id),
    })) as Hotel[];
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  return localHotels
    .filter((h) => h.is_published && h.is_featured)
    .map((h) => ({
      ...h,
      city: localCities.find((c) => c.id === h.city_id),
    })) as Hotel[];
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const hotel = localHotels.find((h) => h.slug === slug);
  if (!hotel) return undefined;
  return {
    ...hotel,
    city: localCities.find((c) => c.id === hotel.city_id),
  } as Hotel;
}

export async function getHotelsByCity(cityId: string): Promise<Hotel[]> {
  return localHotels
    .filter((h) => h.city_id === cityId && h.is_published)
    .map((h) => ({
      ...h,
      city: localCities.find((c) => c.id === h.city_id),
    })) as Hotel[];
}

export async function getSimilarHotels(hotel: Hotel, limit = 4): Promise<Hotel[]> {
  const similar = localHotels
    .filter((h) => h.id !== hotel.id && h.is_published && h.city_id === hotel.city_id)
    .slice(0, limit);

  if (similar.length > 0) {
    return similar.map((h) => ({
      ...h,
      city: localCities.find((c) => c.id === h.city_id),
    })) as Hotel[];
  }

  return localHotels
    .filter((h) => h.id !== hotel.id && h.is_published && h.star_rating === hotel.star_rating)
    .slice(0, limit)
    .map((h) => ({
      ...h,
      city: localCities.find((c) => c.id === h.city_id),
    })) as Hotel[];
}

export async function searchHotels(filters: SearchFilters): Promise<PaginatedResult<Hotel>> {
  let results = localHotels.filter((h) => h.is_published);

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.short_description.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
    );
  }

  if (filters.city_slug) {
    const city = localCities.find((c) => c.slug === filters.city_slug);
    if (city) results = results.filter((h) => h.city_id === city.id);
  }

  if (filters.price_min !== undefined) {
    results = results.filter((h) => h.price_from >= filters.price_min!);
  }

  if (filters.price_max !== undefined) {
    results = results.filter((h) => h.price_from <= filters.price_max!);
  }

  if (filters.star_rating !== undefined) {
    results = results.filter((h) => h.star_rating >= filters.star_rating!);
  }

  if (filters.property_type) {
    results = results.filter((h) =>
      h.property_type.toLowerCase().includes(filters.property_type!.toLowerCase())
    );
  }

  // Sorting
  switch (filters.sort_by) {
    case "price_low": results.sort((a, b) => a.price_from - b.price_from); break;
    case "price_high": results.sort((a, b) => b.price_from - a.price_from); break;
    case "rating": results.sort((a, b) => b.guest_rating - a.guest_rating); break;
    case "newest": results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    default: results.sort((a, b) => b.review_count - a.review_count); break;
  }

  const page = filters.page || 1;
  const per_page = filters.per_page || 12;
  const total = results.length;
  const data = results.slice((page - 1) * per_page, page * per_page).map((h) => ({
    ...h,
    city: localCities.find((c) => c.id === h.city_id),
  })) as Hotel[];

  return { data, total, page, per_page, total_pages: Math.ceil(total / per_page) };
}

// =====================================================================
// BLOG — local data
// =====================================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  return localBlogPosts.filter((p) => p.is_published);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return localBlogPosts.find((p) => p.slug === slug && p.is_published);
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  return localBlogPosts
    .filter((p) => p.is_published)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
}

// =====================================================================
// STATS — dari local data untuk publik
// =====================================================================

export async function getSiteStats() {
  return {
    totalHotels: localHotels.filter((h) => h.is_published).length,
    totalCities: localCities.length,
    totalCategories: localCategories.length,
    totalLandmarks: localLandmarks.length,
    partners: 3,
  };
}

// =====================================================================
// ADMIN QUERIES — langsung ke Supabase
// =====================================================================

export async function getAllHotelsAdmin(): Promise<Hotel[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("hotels")
      .select("*, city:cities(*)")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Hotel[];
  } catch {
    return [];
  }
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as BlogPost[];
  } catch {
    return [];
  }
}

export async function getAllAffiliateLinksByHotelAdmin() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("hotels")
      .select("id, name, slug, affiliate_links(*)")
      .order("name");
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getAdminStats() {
  try {
    const supabase = getSupabase();
    const [
      { count: hotelsCount },
      { count: citiesCount },
      { count: blogCount },
      { count: affiliateCount },
    ] = await Promise.all([
      supabase.from("hotels").select("*", { count: "exact", head: true }),
      supabase.from("cities").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("affiliate_links").select("*", { count: "exact", head: true }),
    ]);
    return {
      hotels: hotelsCount || 0,
      cities: citiesCount || 0,
      blogPosts: blogCount || 0,
      affiliateLinks: affiliateCount || 0,
    };
  } catch {
    return { hotels: 0, cities: 0, blogPosts: 0, affiliateLinks: 0 };
  }
}
