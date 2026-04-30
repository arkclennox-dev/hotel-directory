export const dynamic = 'force-dynamic';

import { getAllHotelsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Pencil, Link2, CheckCircle2, XCircle } from "lucide-react";

const providers = ["traveloka", "tiketcom", "agoda"] as const;

export default async function AdminAffiliatesPage() {
  const hotels = await getAllHotelsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Affiliate Links</h1>
        <p className="text-sm text-gray-400 mt-0.5">Kelola link afiliasi Traveloka, Tiket.com, dan Agoda per hotel</p>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {hotels.length === 0 ? (
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
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Hotel</th>
                {providers.map((p) => (
                  <th key={p} className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider capitalize">{p === "tiketcom" ? "Tiket.com" : p}</th>
                ))}
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {hotels.map((hotel: any) => {
                const links: any[] = hotel.affiliate_links || [];
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
    </div>
  );
}
