"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Star, MapPin, Eye, EyeOff, Trash2 } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const allChecked = hotels.length > 0 && selected.size === hotels.length;
  const someChecked = selected.size > 0 && selected.size < hotels.length;

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(hotels.map((h) => h.id)));
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
      if (!res.ok) {
        const err = await res.json();
        alert("Gagal: " + (err.error || "Unknown error"));
        return;
      }
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <>
      {/* Bulk action toolbar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between px-5 py-3 bg-blue-600/10 border border-blue-500/30 rounded-xl mb-2">
          <span className="text-sm text-blue-400 font-medium">{selected.size} hotel dipilih</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {bulkDeleting ? "Menghapus..." : `Hapus ${selected.size} Hotel`}
          </button>
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
              {hotels.map((hotel) => (
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
