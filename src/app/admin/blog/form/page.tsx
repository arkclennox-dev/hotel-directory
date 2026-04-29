"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors";
const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

const EMPTY_FORM = {
  title: "", slug: "", excerpt: "", content_html: "",
  featured_image_url: "", author_name: "Admin",
  seo_title: "", seo_description: "", is_published: true,
};

function BlogFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    fetch(`/api/blog?id=${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content_html: data.content_html || "",
            featured_image_url: data.featured_image_url || "",
            author_name: data.author_name || "Admin",
            seo_title: data.seo_title || "",
            seo_description: data.seo_description || "",
            is_published: data.is_published ?? true,
          });
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editId }),
      });
      if (res.ok) router.push("/admin/blog");
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
        <span className="ml-2 text-gray-400 text-sm">Memuat data artikel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? `Edit: ${form.title}` : "Tulis Artikel Baru"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Data disimpan ke Supabase</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Konten Artikel</h2>
          <div>
            <label className={labelClass}>Judul *</label>
            <input name="title" required value={form.title}
              onChange={(e) => { handleChange(e); setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })); }}
              placeholder="Judul artikel..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Penulis</label>
              <input name="author_name" value={form.author_name} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Excerpt (Ringkasan)</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Ringkasan singkat..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Featured Image URL</label>
            <input name="featured_image_url" value={form.featured_image_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
            {form.featured_image_url && (
              <img src={form.featured_image_url} alt="preview" className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-700" />
            )}
          </div>
          <div>
            <label className={labelClass}>Konten (HTML)</label>
            <textarea name="content_html" value={form.content_html} onChange={handleChange} rows={10}
              placeholder="<p>Isi artikel dalam format HTML...</p>"
              className={`${inputClass} font-mono text-xs`} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">SEO</h2>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input name="seo_title" value={form.seo_title} onChange={handleChange} placeholder="Judul untuk Google..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea name="seo_description" value={form.seo_description} onChange={handleChange} rows={2} className={inputClass} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 accent-emerald-500" />
            <span className="text-sm text-gray-300">Published (tampil di website)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Artikel"}
          </button>
          <Link href="/admin/blog" className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 text-sm font-medium rounded-lg transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminBlogFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center gap-2 text-gray-400 text-sm py-10"><Loader2 className="w-4 h-4 animate-spin" />Memuat...</div>}>
      <BlogFormContent />
    </Suspense>
  );
}
