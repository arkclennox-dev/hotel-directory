import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Hotel } from "@/lib/types";
import { formatPrice, getRatingLabel, cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
}

export default function HotelCard({ hotel, className }: HotelCardProps) {
  return (
    <Link
      href={`/hotel/${hotel.slug}`}
      className={cn("glass-card-hover group block overflow-hidden", className)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.hero_image_url}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Star badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-xs text-white">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{hotel.star_rating}</span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-primary/90 backdrop-blur-sm text-xs font-semibold text-white">
          {hotel.guest_rating.toFixed(1)}
        </div>

        {/* Property type */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-xs text-white">
          {hotel.property_type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {hotel.name}
        </h3>

        {hotel.city && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span>{hotel.city.name}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {hotel.short_description}
        </p>

        {/* Bottom row */}
        <div className="flex items-end justify-between pt-3 border-t border-surface-border">
          <div>
            <p className="text-xs text-muted-foreground">Mulai dari</p>
            <p className="text-base font-bold gradient-text">
              {formatPrice(hotel.price_from)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-primary">
              {getRatingLabel(hotel.guest_rating)}
            </p>
            <p className="text-xs text-muted-foreground">
              {hotel.review_count.toLocaleString("id-ID")} ulasan
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
