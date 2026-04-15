"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  size?: "default" | "large";
  initialQuery?: string;
}

export default function SearchBar({ className, size = "default", initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "glass-card flex items-center gap-3 transition-all",
          "focus-within:border-primary/30 focus-within:shadow-glow",
          isLarge ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <Search className={cn("text-muted-foreground shrink-0", isLarge ? "w-5 h-5" : "w-4 h-4")} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari hotel, kota, atau landmark..."
          className={cn(
            "bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground",
            isLarge ? "text-base" : "text-sm"
          )}
        />
        <button
          type="submit"
          className={cn(
            "btn-primary shrink-0",
            isLarge ? "px-6 py-2.5" : "px-4 py-2 text-sm"
          )}
        >
          Cari
        </button>
      </div>
    </form>
  );
}
