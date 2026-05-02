"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Star, MapPin, Eye, EyeOff, Trash2, Search } from "lucide-react";
import DeleteHotelButton from "./DeleteButton";

interface Hotel {
  id: string;
  name: string;
  slug: string;
  star_rating: number;
  guest_rating: number;
  price_from: number;
  property_type: string;
  is_published: boolean;
  hero_image_url?: string;
  city_id: string;
  city?: { name: string };
}

export default function HotelsTable({ hotels }: { hotels: Hotel[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? hotels.filter((h) => {
        const q = query.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.property_type?.toLowerCase().includes(q) ||
          h.city?.name?.toLowerCase().includes(q) ||
          h.slug.toLowerCase().includes(q)
        );
      })
    : hotels;

  const allChecked = filtered.length > 0 && filtered.every((h) => selected.has(h.id));
  const someChecked = filtered.some((h) => selected.has(h.id)) && !allChecked;

  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => { const next = new Set(prev); filtered.forEach((h) => next.delete(h.id)); return next; });
    } else {
      setSelected((prev) => new Set(Array.from(prev).concat(filtered.map((h) => h.id))));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Hapus ${selected.size} hotel yang dipilih? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBulkDeleting(true);
    try {
      const ids = Array.from(selected).join(",");
      const res = await fetch(`/api/hotels?ids=${encodeURIComponent(ids)}`, { method: "DELETE" });
      if (!res.ok) { const err = await res.json(); alert("Gagal: " + (err.error || "Unknown error")); return; }
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch (err) { alert("Error: " + err); }
    finally { setBulkDeleting(false); }
  };

  const handleBulkEdit = async (updates: Record<string, unknown>) => {
    if (selected.size === 0) return;
    setBulkEditing(true);
    try {
      const res = await fetch("/api/hotels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), ...updates }),
      });
      if (!res.ok) { const err = await res.json(); alert("Gagal: " + (err.error || "Unknown error")); return; }
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch (err) { alert("Error: " + err); }
    finally { setBulkEditing(false); }
  };

  return (
    <>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari hotel, kota, tipe properti..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Bulk action toolbar */}
      {selected.size > 0 && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-600/10 p-4 space-y-3 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-300">{selected.size} hotel dipilih</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-white transition-colors">Batalkan pilihan</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Publish / Unpublish */}
            <button
              onClick={() => handleBulkEdit({ is_published: true })}
              disabled={bulkEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Publish
            </button>
            <button
              onClick={() => handleBulkEdit({ is_published: false })}
              disabled={bulkEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Unpublish
            </button>

            {/* Featured / Unfeatured */}
            <button
              onClick={() => handleBulkEdit({ is_featured: true })}
              disabled={bulkEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              Jadikan Featured
            </button>
            <button
              onClick={() => handleBulkEdit({ is_featured: false })}
              disabled={bulkEditing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Star className="w-3.5 h-3.5" />
              Hapus Featured
            </button>

            {/* Divider */}
            <div className="w-px bg-gray-700 self-stretch mx-1" />

            {/* Delete */}
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {bulkDeleting ? "Menghapus..." : `Hapus ${selected.size} Hotel`}
            </button>
          </div>
          {bulkEditing && <p className="text-xs text-blue-400">Menyimpan perubahan...</p>}
        </div>
      )}

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Belum ada hotel</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">Supabase masih kosong. Mulai tambahkan hotel pertama Anda.</p>
            <Link href="/admin/hotels/form" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              Tambah Hotel Pertama
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Tidak ada hasil untuk "{query}"</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Kota</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Harga Mulai</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((hotel) => (
                <tr
                  key={hotel.id}
                  className={`bg-gray-900 hover:bg-gray-800/50 transition-colors ${selected.has(hotel.id) ? "bg-blue-900/10" : ""}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(hotel.id)}
                      onChange={() => toggleOne(hotel.id)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {hotel.hero_image_url && (
                        <img src={hotel.hero_image_url} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-700" />
                      )}
                      <div>
                        <p className="font-medium text-white">{hotel.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {hotel.star_rating} bintang · {hotel.property_type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      {hotel.city?.name || hotel.city_id}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    Rp {hotel.price_from.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-300">{hotel.guest_rating}/10</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${hotel.is_published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-700 text-gray-400 border border-gray-600"}`}>
                      {hotel.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {hotel.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/hotels/form?id=${hotel.id}`} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteHotelButton id={hotel.id} name={hotel.name} />
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
