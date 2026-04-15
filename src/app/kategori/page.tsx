import { Metadata } from "next";
import Link from "next/link";
import { Tag, Building2, Plane, Train, ShoppingBag, MapPin, Users, Briefcase, Heart, Wallet, Sparkles, Clock, Home, TreePalm } from "lucide-react";
import { getCategories, getCategoriesByType } from "@/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";

const iconMap: Record<string, React.ReactNode> = {
  Plane: <Plane className="w-5 h-5" />, Train: <Train className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />, MapPin: <MapPin className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />, Briefcase: <Briefcase className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />, Wallet: <Wallet className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />, Clock: <Clock className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />, Palmtree: <TreePalm className="w-5 h-5" />,
};

export const metadata: Metadata = {
  title: "Kategori Hotel — Temukan Berdasarkan Kebutuhan",
  description: "Jelajahi hotel di Indonesia berdasarkan kategori: lokasi, kebutuhan, tipe properti, dan fasilitas.",
};

const typeLabels: Record<string, string> = {
  lokasi: "Berdasarkan Lokasi",
  kebutuhan: "Berdasarkan Kebutuhan",
  tipe_properti: "Tipe Properti",
  fasilitas: "Berdasarkan Fasilitas",
};

export default function KategoriIndexPage() {
  const categories = getCategories();
  const types = ["lokasi", "kebutuhan", "tipe_properti"];

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kategori <span className="gradient-text">Hotel</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan hotel yang tepat berdasarkan lokasi, kebutuhan perjalanan, dan tipe properti
          </p>
        </div>

        {types.map((type) => {
          const typeCats = getCategoriesByType(type);
          if (typeCats.length === 0) return null;
          return (
            <div key={type} className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                {typeLabels[type] || type}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {typeCats.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.slug}`}
                    className="glass-card-hover p-5 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:bg-primary/20 transition-colors">
                      {iconMap[cat.icon] || <Building2 className="w-5 h-5" />}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                    {cat.hotel_count && (
                      <p className="text-xs text-primary mt-2">{cat.hotel_count} hotel</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
