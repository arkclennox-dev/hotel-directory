"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AffiliateFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel_id");
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call for this demo
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/affiliates");
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Manage Affiliate Links
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Update affiliate links for Hotel ID: {hotelId || "Unknown"}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="p-4 border border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20 rounded-md">
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Traveloka URL</label>
          <input type="url" name="traveloka_url" placeholder="https://traveloka.com/..." className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        
        <div className="p-4 border border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20 rounded-md">
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Tiket.com URL</label>
          <input type="url" name="tiket_url" placeholder="https://tiket.com/..." className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        
        <div className="p-4 border border-blue-100 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20 rounded-md">
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Agoda URL</label>
          <input type="url" name="agoda_url" placeholder="https://agoda.com/..." className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Links"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AffiliateForm() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading form...</div>}>
      <AffiliateFormContent />
    </Suspense>
  );
}
