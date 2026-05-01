export const dynamic = 'force-dynamic';

import { getAllHotelsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import ImportButton from "./ImportButton";
import HotelsTable from "./HotelsTable";

export default async function AdminHotelsPage() {
  const hotels = await getAllHotelsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hotels</h1>
          <p className="text-sm text-gray-400 mt-0.5">{hotels.length} hotel di Supabase</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportButton />
          <Link
            href="/admin/hotels/form"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Hotel
          </Link>
        </div>
      </div>

      <HotelsTable hotels={hotels} />
    </div>
  );
}
