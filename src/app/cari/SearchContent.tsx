"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import HotelCard from "@/components/ui/HotelCard";
import { HotelGrid, EmptyState } from "@/components/ui/SectionHeader";
import { searchHotels } from "@/lib/queries";
import { Hotel } from "@/lib/types";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query) {
      const result = searchHotels({ query, per_page: 20 });
      setResults(result.data);
      setTotal(result.total);
    } else {
      setResults([]);
      setTotal(0);
    }
  }, [query]);

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            Cari Hotel
          </h1>
          <SearchBar size="large" initialQuery={query} />
        </div>

        {query && (
          <p className="text-sm text-muted-foreground mb-6">
            Menampilkan <strong className="text-foreground">{total}</strong> hasil untuk &quot;
            <strong className="text-foreground">{query}</strong>&quot;
          </p>
        )}

        {results.length > 0 ? (
          <HotelGrid>
            {results.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </HotelGrid>
        ) : query ? (
          <EmptyState
            title="Tidak ada hotel ditemukan"
            description="Coba kata kunci lain atau jelajahi berdasarkan kota dan kategori."
            icon={<SearchIcon className="w-12 h-12" />}
          />
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Masukkan kata kunci untuk mencari hotel</p>
          </div>
        )}
      </div>
    </div>
  );
}
