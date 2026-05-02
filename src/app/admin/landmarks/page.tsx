export const dynamic = 'force-dynamic';

import { getAllLandmarksAdmin, getCities } from "@/lib/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import LandmarksTable from "./LandmarksTable";

export default async function AdminLandmarksPage() {
  const [landmarks, cities] = await Promise.all([
    getAllLandmarksAdmin(),
    getCities(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Landmarks</h1>
          <p className="text-sm text-gray-400 mt-0.5">{landmarks.length} landmark di Supabase</p>
        </div>
        <Link href="/admin/landmarks/form" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Landmark
        </Link>
      </div>
      <LandmarksTable landmarks={landmarks} />
    </div>
  );
}
