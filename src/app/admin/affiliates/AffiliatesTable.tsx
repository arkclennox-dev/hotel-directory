"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Link2, CheckCircle2, XCircle, Search, ChevronDown } from "lucide-react";

const PROVIDERS = [
  { key: "traveloka", label: "Traveloka" },
  { key: "tiketcom", label: "Tiket.com" },
  { key: "agoda", label: "Agoda" },
] as const;

type ProviderKey = typeof PROVIDERS[number]["key"];

interface Hotel {
  id: string;
  name: string;
  slug: string;
  affiliate_links: { provider: string; is_active: boolean }[];
}

export default function AffiliatesTable({ hotels }: { hotels: Hotel[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Bulk edit state
  const [bulkProvider, setBulkProvider] = useState<ProviderKey>("traveloka");
  const [bulkUrl, setBulkUrl] = useState("");
  const [bulkDeeplink, setBulkDeeplink] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = query.trim()
    ? hotels.filter((h) =>
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.slug.toLowerCase().includes(query.toLowerCase())
      )
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
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const runBulk = async (is_active: boolean, withUrl: boolean) => {
    if (selected.size === 0) return;
    const hotel_ids = Array.from(selected);
    const providerLabel = PROVIDERS.find((p) => p.key === bulkProvider)?.label;

    if (withUrl && !bulkUrl.trim()) {
      alert("Isi URL afiliasi terlebih dahulu.");
      return;
    }

    const action = withUrl
      ? `Insert/update link ${providerLabel} ke ${hotel_ids.length} hotel?`
      : `${is_active ? "Aktifkan" : "Nonaktifkan"} link ${providerLabel} untuk ${hotel_ids.length} hotel?`;
    if (!confirm(action)) return;

    setBulkLoading(true);
    try {
      const body: Record<string, unknown> = { hotel_ids, provider: bulkProvider, is_active };
      if (withUrl) {
        body.affiliate_url = bulkUrl.trim();
        body.deeplink_url = bulkDeeplink.trim() || "#";
      }
      const res = await fetch("/api/affiliate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Gagal: " + (err.error || "Unknown error"));
        return;
      }
      if (withUrl) { setBulkUrl(""); setBulkDeeplink(""); }
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setBulkLoading(false);
    }
  };

  if (hotels.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <Link2 className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada hotel di Supabase</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">Tambahkan hotel terlebih dahulu sebelum mengatur affiliate links.</p>
          <Link href="/admin/hotels/form" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Tambah Hotel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
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

      {/* Bulk edit toolbar */}
      {selected.size > 0 && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-600/10 p-4 space-y-3 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-violet-300">{selected.size} hotel dipilih</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-white transition-colors">Batalkan pilihan</button>
          </div>

          {/* Provider + URL input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Provider selector */}
            <div className="relative">
              <select
                value={bulkProvider}
                onChange={(e) => setBulkProvider(e.target.value as ProviderKey)}
                className="w-full appearance-none bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 pr-8"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Affiliate URL */}
            <input
              type="url"
              placeholder="URL Afiliasi (opsional untuk toggle)"
              value={bulkUrl}
              onChange={(e) => setBulkUrl(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />

            {/* Deeplink URL */}
            <input
              type="url"
              placeholder="Deeplink URL (opsional)"
              value={bulkDeeplink}
              onChange={(e) => setBulkDeeplink(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {bulkUrl.trim() && (
              <button
                onClick={() => runBulk(true, true)}
                disabled={bulkLoading}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {bulkLoading ? "Menyimpan..." : `Terapkan URL ke ${selected.size} Hotel`}
              </button>
            )}
            <button
              onClick={() => runBulk(true, false)}
              disabled={bulkLoading}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Aktifkan {PROVIDERS.find((p) => p.key === bulkProvider)?.label}
            </button>
            <button
              onClick={() => runBulk(false, false)}
              disabled={bulkLoading}
              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Nonaktifkan {PROVIDERS.find((p) => p.key === bulkProvider)?.label}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
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
                    className="w-4 h-4 accent-violet-500 cursor-pointer"
                  />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Hotel</th>
                {PROVIDERS.map((p) => (
                  <th key={p.key} className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">{p.label}</th>
                ))}
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((hotel) => {
                const links = hotel.affiliate_links || [];
                return (
                  <tr key={hotel.id} className={`bg-gray-900 hover:bg-gray-800/50 transition-colors ${selected.has(hotel.id) ? "bg-violet-900/10" : ""}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(hotel.id)}
                        onChange={() => toggleOne(hotel.id)}
                        className="w-4 h-4 accent-violet-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{hotel.name}</p>
                      <p className="text-xs text-gray-500">{hotel.slug}</p>
                    </td>
                    {PROVIDERS.map((p) => {
                      const link = links.find((l) => l.provider === p.key);
                      return (
                        <td key={p.key} className="px-4 py-4 text-center">
                          {link ? (
                            <span className={`inline-flex items-center gap-1 text-xs ${link.is_active ? "text-emerald-400" : "text-gray-500"}`}>
                              {link.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {link.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
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
                        Edit
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
