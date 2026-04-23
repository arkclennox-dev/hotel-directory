"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import HotelCard from "@/components/ui/HotelCard";
import { HotelGrid, EmptyState } from "@/components/ui/SectionHeader";
import { Hotel } from "@/lib/types";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q: string) => {
    if (!q) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&per_page=20`);
      const data = await res.json();
      setResults(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            Cari Hotel
          </h1>
          <SearchBar size="large" initialQuery={query} />
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && query && (
          <p className="text-sm text-muted-foreground mb-6">
            Menampilkan <strong className="text-foreground">{total}</strong> hasil untuk &quot;
            <strong className="text-foreground">{query}</strong>&quot;
          </p>
        )}

        {!loading && results.length > 0 ? (
          <HotelGrid>
            {results.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </HotelGrid>
        ) : !loading && query ? (
          <EmptyState
            title="Tidak ada hotel ditemukan"
            description="Coba kata kunci lain atau jelajahi berdasarkan kota dan kategori."
            icon={<SearchIcon className="w-12 h-12" />}
          />
        ) : !loading && !query ? (
          <div className="text-center py-20">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Masukkan kata kunci untuk mencari hotel</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
