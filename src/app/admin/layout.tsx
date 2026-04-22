import Link from "next/link";
import { LayoutDashboard, BookText, Building2, Link2, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <BookText className="h-4 w-4" />
            Blog Posts
          </Link>
          <Link href="/admin/hotels" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Building2 className="h-4 w-4" />
            Hotels
          </Link>
          <Link href="/admin/affiliates" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Link2 className="h-4 w-4" />
            Affiliate Links
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-md">
              <Home className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">Directory Management</h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
