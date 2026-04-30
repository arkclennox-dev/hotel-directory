export const dynamic = 'force-dynamic';

import { getAdminStats } from "@/lib/queries";
import Link from "next/link";
import { Hotel, BookOpen, Link2, Globe, TrendingUp, Database } from "lucide-react";

export default async function AdminPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Hotels di Supabase",
      value: stats.hotels,
      icon: <Hotel className="w-6 h-6" />,
      color: "blue",
      href: "/admin/hotels",
      desc: "Kelola daftar hotel",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      icon: <BookOpen className="w-6 h-6" />,
      color: "emerald",
      href: "/admin/blog",
      desc: "Kelola artikel blog",
    },
    {
      label: "Affiliate Links",
      value: stats.affiliateLinks,
      icon: <Link2 className="w-6 h-6" />,
      color: "violet",
      href: "/admin/affiliates",
      desc: "Kelola link afiliasi",
    },
    {
      label: "Kota Tersedia",
      value: stats.cities,
      icon: <Globe className="w-6 h-6" />,
      color: "amber",
      href: "/admin/hotels",
      desc: "Total kota di database",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview data di Supabase database</p>
      </div>

      {/* Status Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <Database className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">Mode Hybrid Aktif</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Halaman publik menggunakan data JSON lokal. Dashboard ini mengelola data Supabase secara terpisah.
            Data yang ditambahkan di sini belum otomatis muncul di halaman publik sampai integrasi penuh selesai.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href + card.label}
            href={card.href}
            className="group p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-800 transition-all"
          >
            <div className={`inline-flex w-11 h-11 rounded-lg border items-center justify-center mb-4 ${colorMap[card.color]}`}>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm font-medium text-gray-200 mt-1">{card.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/hotels/form"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-blue-500/40 hover:bg-gray-800 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Hotel className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Tambah Hotel</p>
              <p className="text-xs text-gray-500">Tambah ke Supabase</p>
            </div>
          </Link>
          <Link
            href="/admin/blog/form"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-emerald-500/40 hover:bg-gray-800 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Tulis Artikel</p>
              <p className="text-xs text-gray-500">Tambah blog post</p>
            </div>
          </Link>
          <Link
            href="/admin/affiliates"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-violet-500/40 hover:bg-gray-800 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Affiliate Links</p>
              <p className="text-xs text-gray-500">Kelola link partner</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
