"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, MapPin, Star, Search } from "lucide-react";
import DeleteLandmarkButton from "./DeleteButton";

const TYPE_LABELS: Record<string, string> = {
  bandara: "Bandara", stasiun: "Stasiun", terminal: "Terminal",
  pelabuhan: "Pelabuhan", mall: "Mall", rumah_sakit: "Rumah Sakit",
  kampus: "Kampus", wisata: "Wisata", kawasan_industri: "Kawasan Industri",
};

interface Landmark {
  id: string;
  name: string;
  slug: string;
  type?: string;
  city_id?: string;
  is_featured: boolean;
  city?: { name: string };
}

export default function LandmarksTable({ landmarks }: { landmarks: Landmark[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? landmarks.filter((lm) => {
        const q = query.toLowerCase();
        return (
          lm.name.toLowerCase().includes(q) ||
          lm.slug.toLowerCase().includes(q) ||
          lm.city?.name?.toLowerCase().includes(q) ||
          (lm.type && (TYPE_LABELS[lm.type] || lm.type).toLowerCase().includes(q))
        );
      })
    : landmarks;

  if (landmarks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada landmark</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">Mulai tambahkan landmark pertama.</p>
          <Link href="/admin/landmarks/form" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Tambah Landmark
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
          placeholder="Cari nama, kota, atau tipe landmark..."
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Kota</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Tipe</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((lm) => (
                <tr key={lm.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{lm.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{lm.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      {lm.city?.name || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                      {TYPE_LABELS[lm.type || ""] || lm.type || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {lm.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/landmarks/form?id=${lm.id}`} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteLandmarkButton id={lm.id} name={lm.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
