import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCityBySlug, searchHotels, getCities, getLandmarksByCity, getCategories } from "@/lib/queries";
import { cities } from "@/lib/data";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelCard from "@/components/ui/HotelCard";
import SectionHeader, { HotelGrid } from "@/components/ui/SectionHeader";
import FAQSection from "@/components/ui/FAQSection";

export async function generateStaticParams() {
  return getCities().map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.slug);
  if (!city) return {};
  return {
    title: city.seo_title || `Hotel di ${city.name}`,
    description: city.seo_description || city.description,
  };
}

export default function CityDetailPage({ params, searchParams }: { params: { slug: string }, searchParams: { category?: string } }) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  // Filter hotels by city and category (if provided)
  const cityHotelsResult = searchHotels({ city_slug: params.slug, category_slug: searchParams.category, per_page: 100 });
  const cityHotels = cityHotelsResult.data;
  const cityLandmarks = getLandmarksByCity(city.id);
  const categoriesList = getCategories();

  const faqItems = [
    {
      question: `Hotel apa yang terbaik di ${city.name}?`,
      answer: `${city.name} memiliki banyak pilihan hotel dari berbagai segmen. Gunakan filter di atas untuk menemukan hotel sesuai budget dan kebutuhan Anda.`,
    },
    {
      question: `Berapa harga hotel di ${city.name}?`,
      answer: `Harga hotel di ${city.name} bervariasi mulai dari Rp 200.000 hingga Rp 5.000.000+ per malam tergantung bintang dan fasilitas.`,
    },
    {
      question: `Bagaimana cara booking hotel di ${city.name}?`,
      answer: `Pilih hotel yang Anda suka, lalu klik tombol booking partner (Traveloka, tiket.com, atau Agoda) untuk melihat harga terkini dan melakukan pemesanan.`,
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={city.hero_image_url}
          alt={`Hotel di ${city.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="section-container pb-6">
            <Breadcrumbs items={[{ label: "Kota", href: "/kota" }, { label: city.name }]} />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Hotel di <span className="gradient-text">{city.name}</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{city.province}, {city.island}</span>
              <span className="mx-1">·</span>
              <span>{cityHotels.length} hotel tersedia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container mt-8">
        {/* Description */}
        <div className="glass-card p-6 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{city.description}</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
          <Link
            href={`/kota/${city.slug}`}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors",
              !searchParams.category ? "border-primary bg-primary/10 text-primary" : "border-surface-border glass-card hover:bg-white/5 text-muted-foreground hover:text-foreground"
            )}
          >
            Semua Hotel
          </Link>
          {categoriesList.map((c) => (
            <Link
              key={c.id}
              href={`/kota/${city.slug}?category=${c.slug}`}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                searchParams.category === c.slug ? "border-primary bg-primary/10 text-primary" : "border-surface-border glass-card hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Hotels grid */}
        {cityHotels.length > 0 ? (
          <HotelGrid>
            {cityHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </HotelGrid>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Belum ada hotel tersedia di kota ini.</p>
          </div>
        )}

        {/* Landmarks */}
        {cityLandmarks.length > 0 && (
          <div className="mt-16">
            <SectionHeader
              title={`Landmark di ${city.name}`}
              subtitle="Temukan hotel dekat lokasi penting"
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cityLandmarks.map((lm) => (
                <div key={lm.id} className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{lm.name}</h3>
                      <p className="text-xs text-muted-foreground">{lm.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16">
          <FAQSection items={faqItems} />
        </div>
      </div>
    </div>
  );
}
