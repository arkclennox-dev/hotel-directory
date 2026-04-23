import { getSiteStats, getRecentBlogPosts } from "@/lib/queries";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getSiteStats();
  const recentBlogs = await getRecentBlogPosts(5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Hotels</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalHotels}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Cities</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCities}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Categories</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCategories}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Affiliate Partners</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.partners}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Blog Posts</h3>
            <Link href="/admin/blog" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">View All</Link>
          </div>
          <div className="space-y-4">
            {recentBlogs.map((post) => (
              <div key={post.id} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                  <p className="text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {post.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/hotels/form" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center">
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Add New Hotel</span>
            </Link>
            <Link href="/admin/blog/form" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center">
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Write Blog Post</span>
            </Link>
            <Link href="/admin/affiliates" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center">
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Manage Links</span>
            </Link>
            <Link href="/admin/hotels" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center">
              <span className="block text-sm font-medium text-gray-900 dark:text-white">View Inventory</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
