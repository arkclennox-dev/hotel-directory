import Link from "next/link";
import { Hotel, MapPin, Tag, BookOpen, Shield, Mail } from "lucide-react";

const footerLinks = {
  jelajahi: [
    { label: "Semua Kota", href: "/kota" },
    { label: "Hotel Jakarta", href: "/kota/jakarta" },
    { label: "Hotel Bali", href: "/kota/bali" },
    { label: "Hotel Yogyakarta", href: "/kota/yogyakarta" },
    { label: "Hotel Bandung", href: "/kota/bandung" },
    { label: "Hotel Surabaya", href: "/kota/surabaya" },
  ],
  kategori: [
    { label: "Hotel Keluarga", href: "/kategori/hotel-keluarga" },
    { label: "Hotel Budget", href: "/kategori/hotel-budget" },
    { label: "Hotel Bisnis", href: "/kategori/hotel-bisnis" },
    { label: "Hotel Honeymoon", href: "/kategori/hotel-honeymoon" },
    { label: "Hotel Staycation", href: "/kategori/hotel-staycation" },
    { label: "Villa", href: "/kategori/villa" },
  ],
  lainnya: [
    { label: "Blog", href: "/blog" },
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Hubungi Kami", href: "/kontak" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Disclaimer Affiliate", href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-black/5 dark:bg-[#0B0B0F]">
      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Hotel<span className="gradient-text">indo</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Directory hotel Indonesia terlengkap. Temukan hotel terbaik berdasarkan kota,
              kategori, dan landmark. Bandingkan harga di partner booking terpercaya.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>Data diperbarui secara berkala</span>
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Jelajahi
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.jelajahi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Kategori
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.kategori.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lainnya */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Lainnya
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.lainnya.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Affiliate disclosure */}
      <div className="border-t border-surface-border">
        <div className="section-container py-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground/70">Disclosure:</strong> Beberapa link di website ini
            merupakan link affiliate. Kami mungkin mendapatkan komisi jika Anda melakukan pemesanan
            melalui link tersebut, tanpa biaya tambahan bagi Anda.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-border">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hotelindo. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kebijakan-privasi" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Syarat
            </Link>
            <Link href="/kontak" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
