"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const CATEGORY_TYPES = [
  { value: "lokasi", label: "Lokasi" },
  { value: "kebutuhan", label: "Kebutuhan" },
  { value: "tipe_properti", label: "Tipe Properti" },
  { value: "fasilitas", label: "Fasilitas" },
];

const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors";
const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

const EMPTY_FORM = {
  name: "", slug: "", description: "", type: "kebutuhan",
  icon: "", is_featured: false, seo_title: "", seo_description: "",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

function CategoryFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/categories?id=${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            type: data.type || "kebutuhan",
            icon: data.icon || "",
            is_featured: data.is_featured ?? false,
            seo_title: data.seo_title || "",
            seo_description: data.seo_description || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value };
      if (name === "name" && !isEdit) updated.slug = slugify(value);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editId }),
      });
      if (res.ok) router.push("/admin/categories");
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
        <span className="ml-2 text-gray-400 text-sm">Memuat data kategori...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{isEdit ? "Edit Kategori" : "Tambah Kategori"}</h1>
          <p className="text-sm text-gray-400">{isEdit ? `ID: ${editId}` : "Buat kategori baru"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Informasi Dasar</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Kategori *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="contoh: Hotel Bintang 5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} required placeholder="hotel-bintang-5" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipe *</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                {CATEGORY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Icon (nama lucide/emoji)</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="contoh: Star, Hotel, 🏨" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Deskripsi singkat kategori ini..." className={inputClass} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-0" />
            <span className="text-sm text-gray-300">Tampilkan di halaman utama (Featured)</span>
          </label>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">SEO</h2>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input name="seo_title" value={form.seo_title} onChange={handleChange} placeholder="Judul untuk mesin pencari" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea name="seo_description" value={form.seo_description} onChange={handleChange} rows={2} placeholder="Deskripsi untuk mesin pencari" className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Simpan Perubahan" : "Buat Kategori"}
          </button>
          <Link href="/admin/categories" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminCategoryFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}>
      <CategoryFormContent />
    </Suspense>
  );
}
