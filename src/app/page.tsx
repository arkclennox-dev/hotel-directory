import Link from "next/link";
import {
  ArrowRight, Star, MapPin, Building2, Plane, Train, Users,
  Briefcase, Heart, Wallet, Sparkles, Home, TreePalm, ShoppingBag, Clock
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import HotelCard from "@/components/ui/HotelCard";
import SectionHeader, { StatCard, HotelGrid } from "@/components/ui/SectionHeader";
import { getFeaturedHotels, getFeaturedCities, getFeaturedCategories, getFeaturedLandmarks, getRecentBlogPosts, getSiteStats } from "@/lib/queries";
import { cities } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  Plane: <Plane className="w-5 h-5" />,
  Train: <Train className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Palmtree: <TreePalm className="w-5 h-5" />,
};

export default function HomePage() {
  const featuredHotels = getFeaturedHotels();
  const featuredCities = getFeaturedCities();
  const featuredCategories = getFeaturedCategories();
  const featuredLandmarks = getFeaturedLandmarks();
  const recentPosts = getRecentBlogPosts(3);
  const stats = getSiteStats();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Directory Hotel #1 di Indonesia
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
              Temukan Hotel{" "}
              <span className="gradient-text">Terbaik</span>{" "}
              di Indonesia
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Jelajahi ribuan hotel dari budget hingga bintang 5 di seluruh Indonesia. Bandingkan harga terbaik dari Traveloka, tiket.com, dan Agoda.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar size="large" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <StatCard value={`${stats.totalHotels}+`} label="Hotel" />
            <StatCard value={`${stats.totalCities}+`} label="Kota" />
            <StatCard value={`${stats.partners}`} label="Partner" />
          </div>
        </div>
      </section>

      {/* ===== KATEGORI POPULER ===== */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <SectionHeader
            title="Cari Berdasarkan Kebutuhan"
            subtitle="Temukan hotel yang sesuai dengan tujuan perjalanan dan preferensi Anda"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="glass-card-hover p-5 text-center group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary group-hover:bg-primary/20 transition-colors">
                  {iconMap[cat.icon] || <Building2 className="w-5 h-5" />}
                </div>
                <h3 className="text-sm font-medium text-foreground">{cat.name}</h3>
                {cat.hotel_count && (
                  <p className="text-xs text-muted-foreground mt-1">{cat.hotel_count} hotel</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOTEL POPULER ===== */}
      <section className="py-16 md:py-20 bg-black/5 dark:bg-[#0B0B0F]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              title="Hotel Populer"
              subtitle="Pilihan hotel terbaik yang paling banyak dicari traveler Indonesia"
              align="left"
              className="mb-0"
            />
            <Link
              href="/kota"
              className="hidden md:flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors shrink-0"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <HotelGrid>
            {featuredHotels.slice(0, 8).map((hotel) => {
              // Enrich with city
              const city = cities.find((c: any) => c.id === hotel.city_id);
              return <HotelCard key={hotel.id} hotel={{ ...hotel, city }} />;
            })}
          </HotelGrid>
          <div className="mt-8 text-center md:hidden">
            <Link href="/kota" className="btn-primary">
              Lihat Semua Hotel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== KOTA UNGGULAN ===== */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <SectionHeader
            title="Kota Populer"
            subtitle="Jelajahi hotel di kota-kota favorit di Indonesia"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCities.map((city) => (
              <Link
                key={city.id}
                href={`/kota/${city.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={city.hero_image_url}
                  alt={`Hotel di ${city.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white mb-0.5">{city.name}</h3>
                  <p className="text-xs text-white/70">{city.hotel_count} hotel tersedia</p>
                </div>
                <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 rounded-xl transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/kota" className="btn-secondary">
              Lihat Semua Kota
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LANDMARK POPULER ===== */}
      <section className="py-16 md:py-20 bg-black/5 dark:bg-[#0B0B0F]">
        <div className="section-container">
          <SectionHeader
            title="Hotel Dekat Landmark Populer"
            subtitle="Temukan hotel strategis dekat bandara, wisata, dan lokasi penting lainnya"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredLandmarks.map((landmark) => (
              <Link
                key={landmark.id}
                href={`/kota/${landmark.slug}`}
                className="glass-card-hover p-5 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {landmark.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {landmark.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG TERBARU ===== */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              title="Artikel Terbaru"
              subtitle="Tips, rekomendasi, dan panduan menginap di Indonesia"
              align="left"
              className="mb-0"
            />
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors shrink-0"
            >
              Semua Artikel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="glass-card-hover group overflow-hidden"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-primary mb-2">
                    {new Date(post.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-20 bg-black/5 dark:bg-[#0B0B0F]">
        <div className="section-container">
          <div className="glass-card relative overflow-hidden p-10 md:p-16 text-center">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/15 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Siap Menemukan Hotel Impian Anda?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Jelajahi directory hotel terlengkap di Indonesia dan bandingkan harga dari partner booking terpercaya.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/kota" className="btn-primary px-8 py-3">
                  Mulai Jelajahi
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/kategori" className="btn-secondary px-8 py-3">
                  Lihat Kategori
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
