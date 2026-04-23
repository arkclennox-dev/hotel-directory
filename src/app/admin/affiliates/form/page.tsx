"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const PROVIDERS = [
  { key: "traveloka", label: "Traveloka", color: "blue" },
  { key: "tiketcom", label: "Tiket.com", color: "red" },
  { key: "agoda", label: "Agoda", color: "emerald" },
];

function AffiliateFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get("hotel_id") || "";

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<Record<string, { url: string; deeplink: string; active: boolean }>>({
    traveloka: { url: "", deeplink: "", active: true },
    tiketcom: { url: "", deeplink: "", active: true },
    agoda: { url: "", deeplink: "", active: true },
  });

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors";

  const handleChange = (provider: string, field: string, value: string | boolean) => {
    setLinks((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], [field]: value },
    }));
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
      else alert("Gagal menyimpan affiliate links.");
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

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/affiliates" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Affiliate Links</h1>
          <p className="text-sm text-gray-400 mt-0.5">Hotel ID: <code className="text-violet-400">{hotelId}</code></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {PROVIDERS.map((p) => (
          <div key={p.key} className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{p.label}</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={links[p.key].active}
                  onChange={(e) => handleChange(p.key, "active", e.target.checked)}
                  className="w-4 h-4 accent-violet-500"
                />
                <span className="text-xs text-gray-400">Aktif</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Affiliate URL</label>
              <input
                value={links[p.key].url}
                onChange={(e) => handleChange(p.key, "url", e.target.value)}
                placeholder={`https://www.${p.key}.com/hotel/...?aff=...`}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Deeplink URL (optional)</label>
              <input
                value={links[p.key].deeplink}
                onChange={(e) => handleChange(p.key, "deeplink", e.target.value)}
                placeholder="Deep link untuk mobile app"
                className={inputClass}
              />
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
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
    <Suspense fallback={<div className="text-gray-400 text-sm">Memuat form...</div>}>
      <AffiliateFormContent />
    </Suspense>
  );
}
