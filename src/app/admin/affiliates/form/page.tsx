"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const PROVIDERS = [
  { key: "traveloka", label: "Traveloka", accent: "border-blue-500 focus:border-blue-400" },
  { key: "tiketcom", label: "Tiket.com", accent: "border-red-500 focus:border-red-400" },
  { key: "agoda", label: "Agoda", accent: "border-emerald-500 focus:border-emerald-400" },
];

const baseInput = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors";

function AffiliateFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get("hotel_id") || "";
  const hotelName = searchParams.get("name") || hotelId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [links, setLinks] = useState<Record<string, { url: string; deeplink: string; active: boolean }>>({
    traveloka: { url: "", deeplink: "", active: true },
    tiketcom: { url: "", deeplink: "", active: true },
    agoda: { url: "", deeplink: "", active: true },
  });

  // Load existing affiliate links
  useEffect(() => {
    if (!hotelId) { setFetching(false); return; }
    fetch(`/api/affiliate?hotel_id=${hotelId}`)
      .then((r) => r.json())
      .then((existing: any[]) => {
        if (Array.isArray(existing)) {
          setLinks((prev) => {
            const updated = { ...prev };
            existing.forEach((l) => {
              if (updated[l.provider] !== undefined) {
                updated[l.provider] = {
                  url: l.affiliate_url || "",
                  deeplink: l.deeplink_url || "",
                  active: l.is_active ?? true,
                };
              }
            });
            return updated;
          });
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [hotelId]);

  const handleChange = (provider: string, field: string, value: string | boolean) => {
    setLinks((prev) => ({ ...prev, [provider]: { ...prev[provider], [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotel_id: hotelId, links }),
      });
      if (res.ok) router.push("/admin/affiliates");
      else {
        const err = await res.json();
        alert("Gagal: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  if (!hotelId) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Parameter hotel_id diperlukan.</p>
        <Link href="/admin/affiliates" className="text-violet-400 text-sm mt-3 inline-block">← Kembali</Link>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400 text-sm">Memuat affiliate links...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/admin/affiliates" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliate Links</h1>
          <p className="text-sm text-gray-400 mt-0.5">{hotelName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {PROVIDERS.map((p) => (
          <div key={p.key} className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{p.label}</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={links[p.key].active}
                  onChange={(e) => handleChange(p.key, "active", e.target.checked)}
                  className="w-4 h-4 accent-violet-500" />
                <span className="text-xs text-gray-400">Aktif</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Affiliate URL</label>
              <input value={links[p.key].url}
                onChange={(e) => handleChange(p.key, "url", e.target.value)}
                placeholder={`https://www.${p.key === "tiketcom" ? "tiket.com" : p.key}.com/hotel/...`}
                className={`${baseInput} ${p.accent}`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Deeplink URL</label>
              <input value={links[p.key].deeplink}
                onChange={(e) => handleChange(p.key, "deeplink", e.target.value)}
                placeholder="Deep link untuk mobile app (opsional)"
                className={`${baseInput} focus:border-gray-500`} />
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Links"}
          </button>
          <Link href="/admin/affiliates" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 text-sm font-medium rounded-lg transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminAffiliateFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center gap-2 text-gray-400 text-sm py-10"><Loader2 className="w-4 h-4 animate-spin" />Memuat...</div>}>
      <AffiliateFormContent />
    </Suspense>
  );
}
