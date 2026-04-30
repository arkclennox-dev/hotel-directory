export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Metadata } from "next";
import SearchContent from "./SearchContent";

export const metadata: Metadata = {
  title: "Cari Hotel",
  description: "Cari hotel di seluruh Indonesia berdasarkan nama, kota, atau landmark.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-16">
          <div className="section-container">
            <div className="max-w-2xl mx-auto mb-10 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Cari Hotel</h1>
              <div className="glass-card px-5 py-4 animate-pulse">
                <div className="h-5 bg-surface rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
