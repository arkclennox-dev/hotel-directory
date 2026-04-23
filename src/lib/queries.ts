/**
 * queries.ts — Semua data bersumber dari JSON lokal.
 * Admin dashboard membaca dan memodifikasi file JSON yang sama.
 */

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
// CITIES
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
// CATEGORIES
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
// LANDMARKS
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
// HOTELS
// =====================================================================
function enrichHotel(h: any): Hotel {
  return {
    ...h,
    city: localCities.find((c) => c.id === h.city_id),
  } as Hotel;
}

export async function getHotels(): Promise<Hotel[]> {
  return localHotels.filter((h) => h.is_published).map(enrichHotel);
}
export async function getFeaturedHotels(): Promise<Hotel[]> {
  return localHotels.filter((h) => h.is_published && h.is_featured).map(enrichHotel);
}
export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const h = localHotels.find((h) => h.slug === slug);
  return h ? enrichHotel(h) : undefined;
}
export async function getHotelsByCity(cityId: string): Promise<Hotel[]> {
  return localHotels.filter((h) => h.city_id === cityId && h.is_published).map(enrichHotel);
}
export async function getSimilarHotels(hotel: Hotel, limit = 4): Promise<Hotel[]> {
  const similar = localHotels
    .filter((h) => h.id !== hotel.id && h.is_published && h.city_id === hotel.city_id)
    .slice(0, limit);
  if (similar.length > 0) return similar.map(enrichHotel);
  return localHotels
    .filter((h) => h.id !== hotel.id && h.is_published && h.star_rating === hotel.star_rating)
    .slice(0, limit)
    .map(enrichHotel);
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
  if (filters.price_min !== undefined) results = results.filter((h) => h.price_from >= filters.price_min!);
  if (filters.price_max !== undefined) results = results.filter((h) => h.price_from <= filters.price_max!);
  if (filters.star_rating !== undefined) results = results.filter((h) => h.star_rating >= filters.star_rating!);
  if (filters.property_type) results = results.filter((h) => h.property_type.toLowerCase().includes(filters.property_type!.toLowerCase()));
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
  const data = results.slice((page - 1) * per_page, page * per_page).map(enrichHotel);
  return { data, total, page, per_page, total_pages: Math.ceil(total / per_page) };
}

// =====================================================================
// BLOG
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
// STATS
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
// ADMIN — baca dari JSON lokal (data yang sama dengan halaman publik)
// =====================================================================
export async function getAllHotelsAdmin(): Promise<any[]> {
  return localHotels.map(enrichHotel);
}
export async function getHotelByIdAdmin(id: string): Promise<any | undefined> {
  const h = localHotels.find((h) => h.id === id);
  return h ? enrichHotel(h) : undefined;
}
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  return [...localBlogPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
export async function getBlogPostByIdAdmin(id: string): Promise<BlogPost | undefined> {
  return localBlogPosts.find((p) => p.id === id);
}
export async function getAdminStats() {
  const totalAffiliate = localHotels.reduce(
    (sum, h) => sum + ((h as any).affiliate_links?.length || 0), 0
  );
  return {
    hotels: localHotels.length,
    cities: localCities.length,
    blogPosts: localBlogPosts.length,
    affiliateLinks: totalAffiliate,
  };
}
