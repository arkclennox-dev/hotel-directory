import { getAllBlogPostsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, BookOpen } from "lucide-react";
import DeleteBlogButton from "./DeleteButton";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">{posts.length} artikel di Supabase</p>
        </div>
        <Link
          href="/admin/blog/form"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tulis Artikel
        </Link>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Belum ada artikel</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">Mulai tulis artikel blog pertama Anda.</p>
            <Link
              href="/admin/blog/form"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Tulis Artikel Pertama
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Judul</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Penulis</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {posts.map((post) => (
                <tr key={post.id} className="bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {post.featured_image_url && (
                        <img src={post.featured_image_url} alt={post.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-700" />
                      )}
                      <div>
                        <p className="font-medium text-white line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{post.author_name}</td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(post.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.is_published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-gray-700 text-gray-400 border border-gray-600"
                    }`}>
                      {post.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/form?id=${post.id}`} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteBlogButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
