"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Link2, CheckCircle2, XCircle, Search } from "lucide-react";

const providers = ["traveloka", "tiketcom", "agoda"] as const;

interface Hotel {
  id: string;
  name: string;
  slug: string;
  affiliate_links: { provider: string; is_active: boolean }[];
}

export default function AffiliatesTable({ hotels }: { hotels: Hotel[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? hotels.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.slug.toLowerCase().includes(query.toLowerCase()))
    : hotels;

  if (hotels.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <Link2 className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada hotel di Supabase</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">Tambahkan hotel ke Supabase terlebih dahulu sebelum mengatur affiliate links.</p>
          <Link href="/admin/hotels/form" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Tambah Hotel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama hotel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Tidak ada hasil untuk "{query}"</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Hotel</th>
                {providers.map((p) => (
                  <th key={p} className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider capitalize">
                    {p === "tiketcom" ? "Tiket.com" : p}
                  </th>
                ))}
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((hotel) => {
                const links = hotel.affiliate_links || [];
                return (
                  <tr key={hotel.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{hotel.name}</p>
                      <p className="text-xs text-gray-500">{hotel.slug}</p>
                    </td>
                    {providers.map((provider) => {
                      const link = links.find((l) => l.provider === provider);
                      return (
                        <td key={provider} className="px-4 py-4 text-center">
                          {link ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              {link.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                              <XCircle className="w-4 h-4" />
                              Belum ada
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/affiliates/form?hotel_id=${hotel.id}&name=${encodeURIComponent(hotel.name)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-gray-700 transition-colors text-xs"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit Links
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
