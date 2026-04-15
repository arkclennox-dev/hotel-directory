"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Kota", href: "/kota" },
  { label: "Kategori", href: "/kategori" },
  { label: "Blog", href: "/blog" },
  { label: "Tentang", href: "/tentang" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
        )}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Lali<span className="gradient-text">oma</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/cari"
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Search className="w-4.5 h-4.5" />
            </Link>
            <Link href="/kota" className="btn-primary text-sm">
              Jelajahi Hotel
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          isMobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isMobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Slide panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-surface border-l border-surface-border p-6 pt-20 transition-transform duration-300",
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="px-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-surface-border my-3" />
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
            <Link
              href="/cari"
              onClick={() => setIsMobileOpen(false)}
              className="px-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Cari Hotel
            </Link>
            <Link
              href="/kota"
              onClick={() => setIsMobileOpen(false)}
              className="btn-primary mt-3 text-center"
            >
              Jelajahi Hotel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
