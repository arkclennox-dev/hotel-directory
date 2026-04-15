// ===== Database Entity Types (mirrors Supabase schema from PRD) =====

export interface City {
  id: string;
  name: string;
  slug: string;
  province: string;
  island: string;
  description: string;
  hero_image_url: string;
  latitude: number;
  longitude: number;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  hotel_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Landmark {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  type: "bandara" | "stasiun" | "terminal" | "pelabuhan" | "mall" | "rumah_sakit" | "kampus" | "wisata" | "kawasan_industri";
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  city?: City;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "lokasi" | "kebutuhan" | "tipe_properti" | "fasilitas";
  icon: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  hotel_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  city_id: string;
  short_description: string;
  full_description: string;
  address: string;
  latitude: number;
  longitude: number;
  star_rating: number;
  guest_rating: number;
  review_count: number;
  price_from: number;
  price_to: number;
  currency: string;
  property_type: string;
  check_in_time: string;
  check_out_time: string;
  phone: string;
  website_url: string;
  hero_image_url: string;
  is_featured: boolean;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  city?: City;
  categories?: Category[];
  facilities?: Facility[];
  images?: HotelImage[];
  affiliate_links?: AffiliateLink[];
  landmarks?: HotelLandmark[];
  created_at: string;
  updated_at: string;
}

export interface HotelCategory {
  id: string;
  hotel_id: string;
  category_id: string;
  created_at: string;
}

export interface HotelLandmark {
  id: string;
  hotel_id: string;
  landmark_id: string;
  distance_km: number;
  distance_text: string;
  landmark?: Landmark;
  created_at: string;
}

export interface HotelImage {
  id: string;
  hotel_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

export interface AffiliateLink {
  id: string;
  hotel_id: string;
  provider: "traveloka" | "tiketcom" | "agoda";
  affiliate_url: string;
  deeplink_url: string;
  is_active: boolean;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  featured_image_url: string;
  author_name: string;
  is_published: boolean;
  published_at: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface SEOPage {
  id: string;
  page_type: string;
  city_id?: string;
  landmark_id?: string;
  category_id?: string;
  slug: string;
  h1: string;
  intro_content: string;
  faq_json: FAQItem[];
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ===== UI Types =====

export interface SearchFilters {
  query?: string;
  city_slug?: string;
  category_slug?: string;
  price_min?: number;
  price_max?: number;
  star_rating?: number;
  guest_rating_min?: number;
  property_type?: string;
  facilities?: string[];
  sort_by?: "popular" | "price_low" | "price_high" | "rating" | "newest";
  page?: number;
  per_page?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
