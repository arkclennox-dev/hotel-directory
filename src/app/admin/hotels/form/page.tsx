"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const PROPERTY_TYPES = ["Hotel", "Resort", "Villa", "Hostel", "Guest House", "Apartemen", "Kost"];
const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";
const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

const EMPTY_FORM = {
  name: "", slug: "", city_id: "", short_description: "", full_description: "",
  address: "", star_rating: "3", price_from: "", price_to: "",
  property_type: "Hotel", hero_image_url: "", phone: "", website_url: "",
  seo_title: "", seo_description: "", is_published: true, is_featured: false,
};

function HotelFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState(EMPTY_FORM);

  // Load existing data saat edit
  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    fetch(`/api/hotels?id=${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            city_id: data.city_id || "",
            short_description: data.short_description || "",
            full_description: data.full_description || "",
            address: data.address || "",
            star_rating: String(data.star_rating || 3),
            price_from: String(data.price_from || ""),
            price_to: String(data.price_to || ""),
            property_type: data.property_type || "Hotel",
            hero_image_url: data.hero_image_url || "",
            phone: data.phone || "",
            website_url: data.website_url || "",
            seo_title: data.seo_title || "",
            seo_description: data.seo_description || "",
            is_published: data.is_published ?? true,
            is_featured: data.is_featured ?? false,
          });
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        id: editId,
        star_rating: parseInt(form.star_rating),
        price_from: parseInt(form.price_from) || 0,
        price_to: parseInt(form.price_to) || 0,
      };
      const res = await fetch("/api/hotels", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) router.push("/admin/hotels");
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400 text-sm">Memuat data hotel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/hotels" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? `Edit: ${form.name}` : "Tambah Hotel Baru"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Data disimpan ke Supabase</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Informasi Dasar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Nama Hotel *</label>
              <input name="name" required value={form.name}
                onChange={(e) => { handleChange(e); setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })); }}
                placeholder="cth. Hotel Grand Jakarta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <input name="slug" required value={form.slug} onChange={handleChange} placeholder="hotel-grand-jakarta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tipe Properti</label>
              <select name="property_type" value={form.property_type} onChange={handleChange} className={inputClass}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>City ID</label>
              <input name="city_id" value={form.city_id} onChange={handleChange} placeholder="city-001" className={inputClass} />
              <p className="text-xs text-gray-500 mt-1">Lihat ID kota di tabel cities Supabase</p>
            </div>
            <div>
              <label className={labelClass}>Telepon</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+62-21-..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Alamat</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Jl. ..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Short Description *</label>
              <textarea name="short_description" required value={form.short_description} onChange={handleChange} rows={2} placeholder="Deskripsi singkat..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Full Description</label>
              <textarea name="full_description" value={form.full_description} onChange={handleChange} rows={4} placeholder="Deskripsi lengkap..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Hero Image URL</label>
              <input name="hero_image_url" value={form.hero_image_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
              {form.hero_image_url && (
                <img src={form.hero_image_url} alt="preview" className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-700" />
              )}
            </div>
            <div>
              <label className={labelClass}>Website URL</label>
              <input name="website_url" value={form.website_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Harga & Rating */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Harga & Rating</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bintang</label>
              <select name="star_rating" value={form.star_rating} onChange={handleChange} className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Harga Mulai (IDR)</label>
              <input type="number" name="price_from" value={form.price_from} onChange={handleChange} placeholder="350000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Harga s.d. (IDR)</label>
              <input type="number" name="price_to" value={form.price_to} onChange={handleChange} placeholder="800000" className={inputClass} />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">SEO</h2>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input name="seo_title" value={form.seo_title} onChange={handleChange} placeholder="Judul untuk Google..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea name="seo_description" value={form.seo_description} onChange={handleChange} rows={2} placeholder="Deskripsi untuk Google..." className={inputClass} />
          </div>
        </div>

        {/* Publish */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Published</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Featured (halaman utama)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Hotel"}
          </button>
          <Link href="/admin/hotels" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 text-sm font-medium rounded-lg transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminHotelFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center gap-2 text-gray-400 text-sm py-10"><Loader2 className="w-4 h-4 animate-spin" />Memuat...</div>}>
      <HotelFormContent />
    </Suspense>
  );
}
