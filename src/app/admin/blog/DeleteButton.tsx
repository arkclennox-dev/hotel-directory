"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert("Gagal menghapus: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
