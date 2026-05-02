export const dynamic = 'force-dynamic';

import { getAllBlogPostsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import BlogTable from "./BlogTable";

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

      <BlogTable posts={posts} />
    </div>
  );
}
