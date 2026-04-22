import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { getCities } from "@/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Semua Kota — Jelajahi Hotel di Indonesia",
  description: "Jelajahi hotel di seluruh kota Indonesia. Dari Jakarta, Bali, Yogyakarta, Bandung, hingga Lombok.",
};

export default function KotaIndexPage() {
  const allCities = getCities();

  // Group by island
  const grouped = allCities.reduce((acc, city) => {
    if (!acc[city.island]) acc[city.island] = [];
    acc[city.island].push(city);
    return acc;
  }, {} as Record<string, typeof allCities>);

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Jelajahi Hotel di <span className="gradient-text">Seluruh Indonesia</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan hotel terbaik di {allCities.length}+ kota di Indonesia. Pilih kota tujuan Anda untuk melihat rekomendasi hotel.
          </p>
        </div>

        {/* City grid */}
        {Object.entries(grouped).map(([island, islandCities]) => (
          <div key={island} className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {island}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {islandCities.map((city) => (
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
                    <p className="text-xs text-white/70">{city.province} · {city.hotel_count} hotel</p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
