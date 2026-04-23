import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard, Hotel, BookOpen, Link2, LogOut, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/hotels", label: "Hotels", icon: <Hotel className="w-5 h-5" /> },
  { href: "/admin/blog", label: "Blog Posts", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/admin/affiliates", label: "Affiliate Links", icon: <Link2 className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">H</div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Hotel Directory</p>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors group text-sm font-medium"
            >
              <span className="text-gray-500 group-hover:text-blue-400 transition-colors">{item.icon}</span>
              {item.label}
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-800 flex items-center px-6 shrink-0">
          <p className="text-sm text-gray-400">
            Selamat datang kembali, <span className="text-white font-medium">Admin</span>
          </p>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
