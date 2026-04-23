import { getAllHotelsAdmin } from "@/lib/queries";
import Link from "next/link";
import { Link2, Edit } from "lucide-react";

// In a real app with Supabase, we would fetch affiliate links separately or as a joined query.
// For this UI mockup based on JSON data, we assume hotels have some mock provider data.

export default async function AdminAffiliatesPage() {
  const hotels = await getAllHotelsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliate Links Management</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Hotel Name</th>
                <th className="px-6 py-4 font-medium">Traveloka</th>
                <th className="px-6 py-4 font-medium">Tiket.com</th>
                <th className="px-6 py-4 font-medium">Agoda</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {hotel.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      <Link2 className="w-3 h-3" /> Configured
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      Not Configured
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                      <Link2 className="w-3 h-3" /> Configured
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/affiliates/form?hotel_id=${hotel.id}`} className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit className="h-4 w-4" /> Edit Links
                    </Link>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hotels found to manage links for.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
