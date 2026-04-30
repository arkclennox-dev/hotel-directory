import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  Star, MapPin, Clock, Phone, Globe, ChevronRight, Wifi,
  Car, Coffee, Waves, Dumbbell, Wind, UtensilsCrossed,
  Flower2, Shirt, Droplets, Bath, Mountain, Baby, Presentation, Bus
} from "lucide-react";
import { getHotelBySlug, getSimilarHotels, getHotels } from "@/lib/queries";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelCard from "@/components/ui/HotelCard";
import CTAButtonsAffiliate from "@/components/ui/CTAButtonsAffiliate";
import FAQSection from "@/components/ui/FAQSection";
import SectionHeader, { HotelGrid } from "@/components/ui/SectionHeader";
import { formatPrice, getRatingLabel, getStarLabel } from "@/lib/utils";

const facilityIcons: Record<string, React.ReactNode> = {
  "Kolam Renang": <Waves className="w-4 h-4" />,
  "Sarapan Gratis": <Coffee className="w-4 h-4" />,
  "WiFi Gratis": <Wifi className="w-4 h-4" />,
  "Parkir Gratis": <Car className="w-4 h-4" />,
  "Spa & Wellness": <Flower2 className="w-4 h-4" />,
  "Restoran": <UtensilsCrossed className="w-4 h-4" />,
  "Gym & Fitness": <Dumbbell className="w-4 h-4" />,
  "AC": <Wind className="w-4 h-4" />,
  "Resepsionis 24 Jam": <Clock className="w-4 h-4" />,
  "Laundry": <Shirt className="w-4 h-4" />,
  "Private Pool": <Droplets className="w-4 h-4" />,
  "Bathtub": <Bath className="w-4 h-4" />,
  "Pemandangan Bagus": <Mountain className="w-4 h-4" />,
  "Kids Club": <Baby className="w-4 h-4" />,
  "Meeting Room": <Presentation className="w-4 h-4" />,
  "Shuttle Bandara": <Bus className="w-4 h-4" />,
};

const defaultFacilities = [
  "WiFi Gratis", "AC", "Restoran", "Resepsionis 24 Jam", "Parkir Gratis", "Kolam Renang",
];

export const dynamicParams = true;

export async function generateStaticParams() {
  const hotels = await getHotels();
  return hotels.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const hotel = await getHotelBySlug(params.slug);
  if (!hotel) return {};
  return {
    title: hotel.seo_title || hotel.name,
    description: hotel.seo_description || hotel.short_description,
    openGraph: {
      title: hotel.seo_title || hotel.name,
      description: hotel.seo_description || hotel.short_description,
      images: [{ url: hotel.hero_image_url }],
    },
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const hotel = await getHotelBySlug(params.slug);
  if (!hotel) notFound();

  const city = hotel.city;
  const similarHotels = await getSimilarHotels(hotel, 4);

  const faqItems = [
    {
      question: `Berapa harga kamar di ${hotel.name}?`,
      answer: `Harga kamar di ${hotel.name} mulai dari ${formatPrice(hotel.price_from)} hingga ${formatPrice(hotel.price_to)} per malam, tergantung tipe kamar dan musim.`,
    },
    {
      question: `Bagaimana cara booking ${hotel.name}?`,
      answer: `Anda bisa booking ${hotel.name} melalui partner kami seperti Traveloka, tiket.com, atau Agoda. Klik tombol "Lihat Harga" di atas untuk melihat penawaran terbaik.`,
    },
    {
      question: `Jam check-in dan check-out di ${hotel.name}?`,
      answer: `Check-in mulai pukul ${hotel.check_in_time} dan check-out maksimal pukul ${hotel.check_out_time}. Hubungi hotel untuk early check-in atau late check-out.`,
    },
    {
      question: `Di mana lokasi ${hotel.name}?`,
      answer: `${hotel.name} berlokasi di ${hotel.address}${city ? `, ${city.name}` : ""}.`,
    },
  ];

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.short_description,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: city?.name,
      addressRegion: city?.province,
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    },
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.star_rating,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.guest_rating,
      reviewCount: hotel.review_count,
      bestRating: 10,
    },
    priceRange: `${formatPrice(hotel.price_from)} - ${formatPrice(hotel.price_to)}`,
    image: hotel.hero_image_url,
    telephone: hotel.phone,
    checkinTime: hotel.check_in_time,
    checkoutTime: hotel.check_out_time,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 pb-16">
        <div className="section-container">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Kota", href: "/kota" },
              ...(city ? [{ label: city.name, href: `/kota/${city.slug}` }] : []),
              { label: hotel.name },
            ]}
          />

          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-xl overflow-hidden">
            <div className="md:col-span-2 aspect-[16/9] md:aspect-auto md:h-[400px]">
              <img
                src={hotel.hero_image_url}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-3">
              {(hotel.images || []).slice(1, 3).map((img, i) => (
                <div key={i} className="overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {(!hotel.images || hotel.images.length < 3) && (
                <>
                  <div className="bg-surface flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Foto tambahan</p>
                  </div>
                  <div className="bg-surface flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Foto tambahan</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{getStarLabel(hotel.star_rating)}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.address}</span>
                </div>
              </div>

              {/* Quick info bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Rating Tamu</p>
                  <p className="text-lg font-bold gradient-text">{hotel.guest_rating.toFixed(1)}</p>
                  <p className="text-xs text-primary">{getRatingLabel(hotel.guest_rating)}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Ulasan</p>
                  <p className="text-lg font-bold text-foreground">{hotel.review_count.toLocaleString("id-ID")}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                  <p className="text-lg font-bold text-foreground">{hotel.check_in_time}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                  <p className="text-lg font-bold text-foreground">{hotel.check_out_time}</p>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Tentang Hotel</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{hotel.full_description}</p>
              </div>

              {/* Facilities */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Fasilitas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(hotel.facilities && hotel.facilities.length > 0
                    ? hotel.facilities.map((f) => f.name)
                    : defaultFacilities
                  ).map((fac) => (
                    <div key={fac} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02]">
                      <div className="text-primary">
                        {facilityIcons[fac] || <Star className="w-4 h-4" />}
                      </div>
                      <span className="text-sm text-foreground">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Lokasi</h2>
                <div className="aspect-[16/9] rounded-lg bg-surface border border-surface-border flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{hotel.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hotel.latitude}, {hotel.longitude}
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <FAQSection items={faqItems} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & CTA */}
              <div className="glass-card p-6 sticky top-24">
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground mb-1">Harga mulai dari</p>
                  <p className="text-3xl font-bold gradient-text">{formatPrice(hotel.price_from)}</p>
                  <p className="text-xs text-muted-foreground">per malam</p>
                </div>

                {/* Affiliate buttons */}
                <CTAButtonsAffiliate
                  links={hotel.affiliate_links || []}
                  hotelName={hotel.name}
                />

                {/* Contact info */}
                <div className="mt-6 pt-5 border-t border-surface-border space-y-3">
                  {hotel.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.website_url && hotel.website_url !== "#" && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={hotel.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website resmi
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar hotels */}
          {similarHotels.length > 0 && (
            <div className="mt-16">
              <SectionHeader
                title="Hotel Serupa"
                subtitle="Hotel lain yang mungkin Anda suka"
                align="left"
              />
              <HotelGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {similarHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </HotelGrid>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
