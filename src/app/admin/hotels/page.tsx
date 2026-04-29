import { getAllHotelsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Plus, Pencil, MapPin, Star, Eye, EyeOff } from "lucide-react";
import DeleteHotelButton from "./DeleteButton";
import ImportButton from "./ImportButton";

export default async function AdminHotelsPage() {
  const hotels = await getAllHotelsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hotels</h1>
          <p className="text-sm text-gray-400 mt-0.5">{hotels.length} hotel di Supabase</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportButton />
          <Link
            href="/admin/hotels/form"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Hotel
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Belum ada hotel</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              Supabase masih kosong. Mulai tambahkan hotel pertama Anda.
            </p>
            <Link
              href="/admin/hotels/form"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Tambah Hotel Pertama
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
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
                <tr key={hotel.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {hotel.hero_image_url && (
                        <img
                          src={hotel.hero_image_url}
                          alt={hotel.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-700"
                        />
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
                      {(hotel as any).city?.name || hotel.city_id}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    Rp {hotel.price_from.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-300">{hotel.guest_rating}/10</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        hotel.is_published
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-700 text-gray-400 border border-gray-600"
                      }`}
                    >
                      {hotel.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {hotel.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/hotels/form?id=${hotel.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
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
    </div>
  );
}
