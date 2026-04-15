import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ title, subtitle, className, align = "center" }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", align === "center" && "text-center", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Empty state component
export function EmptyState({
  title = "Tidak ada hasil",
  description = "Coba ubah filter atau kata kunci pencarian Anda.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

// Stat card component
export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card p-5 text-center">
      <p className="text-2xl md:text-3xl font-bold gradient-text mb-1">{value}</p>
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Hotel grid wrapper
export function HotelGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5", className)}>
      {children}
    </div>
  );
}

// Sort dropdown
export function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="glass-card px-3 py-2 text-sm text-foreground bg-surface border border-surface-border rounded-lg outline-none focus:border-primary/30 cursor-pointer"
    >
      <option value="popular">Terpopuler</option>
      <option value="price_low">Harga Termurah</option>
      <option value="price_high">Harga Tertinggi</option>
      <option value="rating">Rating Tertinggi</option>
      <option value="newest">Terbaru</option>
    </select>
  );
}

// Pagination component
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Sebelumnya
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-9 h-9 rounded-lg text-sm font-medium transition-all",
            page === currentPage
              ? "bg-gradient-primary text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Selanjutnya
      </button>
    </div>
  );
}
