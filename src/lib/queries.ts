import { cities, categories, hotels, landmarks, facilities, blogPosts } from "@/lib/data";
import { Hotel, City, Category, Landmark, BlogPost, SearchFilters, PaginatedResult } from "@/lib/types";

// ===== CITIES =====

export function getCities(): City[] {
  return cities;
}

export function getFeaturedCities(): City[] {
  return cities.filter((c) => c.is_featured);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

// ===== CATEGORIES =====

export function getCategories(): Category[] {
  return categories;
}

export function getFeaturedCategories(): Category[] {
  return categories.filter((c) => c.is_featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesByType(type: string): Category[] {
  return categories.filter((c) => c.type === type);
}

// ===== HOTELS =====

export function getHotels(): Hotel[] {
  return hotels.filter((h) => h.is_published);
}

export function getFeaturedHotels(): Hotel[] {
  return hotels.filter((h) => h.is_featured && h.is_published);
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  const hotel = hotels.find((h) => h.slug === slug);
  if (!hotel) return undefined;

  // Enrich with city data
  const city = getCityBySlug(cities.find((c) => c.id === hotel.city_id)?.slug || "");
  return { ...hotel, city };
}

export function getHotelsByCity(cityId: string): Hotel[] {
  return hotels.filter((h) => h.city_id === cityId && h.is_published);
}

export function getHotelsByCitySlug(citySlug: string): Hotel[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  return getHotelsByCity(city.id);
}

export function getSimilarHotels(hotel: Hotel, limit: number = 4): Hotel[] {
  return hotels
    .filter((h) => h.id !== hotel.id && h.is_published && (h.city_id === hotel.city_id || h.star_rating === hotel.star_rating))
    .slice(0, limit);
}

export function searchHotels(filters: SearchFilters): PaginatedResult<Hotel> {
  let filtered = hotels.filter((h) => h.is_published);

  // Text search
  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.short_description.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
    );
  }

  // City filter
  if (filters.city_slug) {
    const city = getCityBySlug(filters.city_slug);
    if (city) {
      filtered = filtered.filter((h) => h.city_id === city.id);
    }
  }

  // Category filter
  if (filters.category_slug) {
    const category = getCategoryBySlug(filters.category_slug);
    if (category) {
      filtered = filtered.filter((h) => {
        // If categories array contains category object, or if it contains string ID
        return h.categories?.some((c: any) => c === category.id || c.id === category.id);
      });
    }
  }

  // Price filter
  if (filters.price_min !== undefined) {
    filtered = filtered.filter((h) => h.price_from >= (filters.price_min || 0));
  }
  if (filters.price_max !== undefined) {
    filtered = filtered.filter((h) => h.price_from <= (filters.price_max || Infinity));
  }

  // Star rating filter
  if (filters.star_rating !== undefined) {
    filtered = filtered.filter((h) => h.star_rating >= (filters.star_rating || 0));
  }

  // Guest rating filter
  if (filters.guest_rating_min !== undefined) {
    filtered = filtered.filter((h) => h.guest_rating >= (filters.guest_rating_min || 0));
  }

  // Property type filter
  if (filters.property_type) {
    filtered = filtered.filter((h) => h.property_type.toLowerCase() === filters.property_type?.toLowerCase());
  }

  // Sort
  switch (filters.sort_by) {
    case "price_low":
      filtered.sort((a, b) => a.price_from - b.price_from);
      break;
    case "price_high":
      filtered.sort((a, b) => b.price_from - a.price_from);
      break;
    case "rating":
      filtered.sort((a, b) => b.guest_rating - a.guest_rating);
      break;
    case "newest":
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case "popular":
    default:
      filtered.sort((a, b) => b.review_count - a.review_count);
      break;
  }

  // Pagination
  const page = filters.page || 1;
  const per_page = filters.per_page || 12;
  const start = (page - 1) * per_page;
  const paginatedData = filtered.slice(start, start + per_page);

  return {
    data: paginatedData.map((h) => ({
      ...h,
      city: cities.find((c) => c.id === h.city_id),
    })),
    total: filtered.length,
    page,
    per_page,
    total_pages: Math.ceil(filtered.length / per_page),
  };
}

// ===== LANDMARKS =====

export function getLandmarks(): Landmark[] {
  return landmarks;
}

export function getFeaturedLandmarks(): Landmark[] {
  return landmarks.filter((l) => l.is_featured);
}

export function getLandmarkBySlug(slug: string): Landmark | undefined {
  const landmark = landmarks.find((l) => l.slug === slug);
  if (!landmark) return undefined;
  const city = cities.find((c) => c.id === landmark.city_id);
  return { ...landmark, city } as Landmark;
}

export function getLandmarksByCity(cityId: string): Landmark[] {
  return landmarks.filter((l) => l.city_id === cityId);
}

// ===== FACILITIES =====

export function getFacilities() {
  return facilities;
}

// ===== BLOG =====

export function getBlogPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.is_published);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug && p.is_published);
}

export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.is_published)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
}

// ===== STATS =====

export function getSiteStats() {
  return {
    totalHotels: hotels.filter((h) => h.is_published).length,
    totalCities: cities.length,
    totalCategories: categories.length,
    totalLandmarks: landmarks.length,
    partners: 3,
  };
}
