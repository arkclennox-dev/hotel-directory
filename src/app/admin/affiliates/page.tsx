export const dynamic = 'force-dynamic';

import { getAllHotelsWithAffiliatesAdmin } from "@/lib/queries";
import AffiliatesTable from "./AffiliatesTable";

export default async function AdminAffiliatesPage() {
  const hotels = await getAllHotelsWithAffiliatesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Affiliate Links</h1>
        <p className="text-sm text-gray-400 mt-0.5">Kelola link afiliasi Traveloka, Tiket.com, dan Agoda per hotel</p>
      </div>
      <AffiliatesTable hotels={hotels} />
    </div>
  );
}
