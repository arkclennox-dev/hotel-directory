"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

function HotelFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    city_id: "",
    short_description: "",
    full_description: "",
    address: "",
    star_rating: "3",
    price_from: "",
    price_to: "",
    property_type: "Hotel",
    hero_image_url: "",
    is_published: true,
    is_featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/hotels", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editId,
          star_rating: parseInt(form.star_rating),
          price_from: parseInt(form.price_from) || 0,
          price_to: parseInt(form.price_to) || 0,
        }),
      });
      if (res.ok) {
        router.push("/admin/hotels");
      } else {
        alert("Gagal menyimpan hotel. Cek log server.");
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/hotels"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Hotel" : "Tambah Hotel Baru"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Data akan disimpan ke Supabase</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Informasi Dasar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Nama Hotel *</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={(e) => {
                  handleChange(e);
                  setForm((p) => ({ ...p, slug: autoSlug(e.target.value) }));
                }}
                placeholder="cth. Hotel Grand Jayakarta"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <input name="slug" required value={form.slug} onChange={handleChange} placeholder="hotel-grand-jayakarta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tipe Properti</label>
              <select name="property_type" value={form.property_type} onChange={handleChange} className={inputClass}>
                {["Hotel", "Resort", "Villa", "Hostel", "Guest House", "Apartemen", "Kost"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Short Description *</label>
              <textarea
                name="short_description"
                required
                value={form.short_description}
                onChange={handleChange}
                rows={2}
                placeholder="Deskripsi singkat 1-2 kalimat"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Full Description</label>
              <textarea
                name="full_description"
                value={form.full_description}
                onChange={handleChange}
                rows={4}
                placeholder="Deskripsi lengkap hotel..."
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Alamat</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Jl. Sudirman No. 1, Jakarta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City ID</label>
              <input name="city_id" value={form.city_id} onChange={handleChange} placeholder="UUID kota dari Supabase" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Hero Image URL</label>
              <input name="hero_image_url" value={form.hero_image_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Pricing & Rating */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Harga & Rating</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bintang</label>
              <select name="star_rating" value={form.star_rating} onChange={handleChange} className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Bintang</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Harga Mulai (IDR)</label>
              <input
                type="number"
                name="price_from"
                value={form.price_from}
                onChange={handleChange}
                placeholder="350000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Harga s.d. (IDR)</label>
              <input
                type="number"
                name="price_to"
                value={form.price_to}
                onChange={handleChange}
                placeholder="800000"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Publish Settings */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white">Pengaturan Publikasi</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm text-gray-300">Published (tampil di website)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm text-gray-300">Featured (tampil di halaman utama)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Hotel"}
          </button>
          <Link
            href="/admin/hotels"
            className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 text-sm font-medium rounded-lg transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminHotelFormPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 text-sm">Memuat form...</div>}>
      <HotelFormContent />
    </Suspense>
  );
}
