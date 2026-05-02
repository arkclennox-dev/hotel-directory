"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Tag, Star, Search } from "lucide-react";
import DeleteCategoryButton from "./DeleteButton";

const TYPE_LABELS: Record<string, string> = {
  lokasi: "Lokasi",
  kebutuhan: "Kebutuhan",
  tipe_properti: "Tipe Properti",
  fasilitas: "Fasilitas",
};

const TYPE_COLORS: Record<string, string> = {
  lokasi: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  kebutuhan: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  tipe_properti: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  fasilitas: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  type?: string;
  icon?: string;
  is_featured: boolean;
}

export default function CategoriesTable({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? categories.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.type && (TYPE_LABELS[c.type] || c.type).toLowerCase().includes(q))
        );
      })
    : categories;

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada kategori</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-6">Mulai tambahkan kategori pertama.</p>
          <Link href="/admin/categories/form" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Tambah Kategori
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama, slug, atau tipe kategori..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Tidak ada hasil untuk "{query}"</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Tipe</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Icon</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((cat) => (
                <tr key={cat.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{cat.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TYPE_COLORS[cat.type || ""] || "bg-gray-700 text-gray-400 border-gray-600"}`}>
                      {TYPE_LABELS[cat.type || ""] || cat.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 font-mono text-xs">{cat.icon || "—"}</td>
                  <td className="px-5 py-4">
                    {cat.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/form?id=${cat.id}`} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
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
