import { Metadata } from "next";

export const metadata: Metadata = { title: "Syarat & Ketentuan", description: "Syarat dan ketentuan penggunaan website Lalioma." };

export default function SyaratPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Syarat & Ketentuan</h1>
          <div className="glass-card p-6 space-y-5 text-sm text-muted-foreground leading-relaxed">
            <p>Terakhir diperbarui: Januari 2024</p>
            <div><h2 className="text-base font-semibold text-foreground mb-2">1. Penggunaan Website</h2><p>Dengan mengakses website Lalioma, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Website ini menyediakan informasi dan directory hotel sebagai referensi.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">2. Akurasi Informasi</h2><p>Kami berusaha menyajikan informasi hotel yang akurat dan terkini. Namun, harga, ketersediaan, dan detail hotel dapat berubah sewaktu-waktu. Selalu verifikasi informasi di platform booking partner.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">3. Link Pihak Ketiga</h2><p>Website ini berisi link ke platform booking pihak ketiga. Kami tidak bertanggung jawab atas konten, kebijakan, atau layanan pihak ketiga tersebut.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">4. Batasan Tanggung Jawab</h2><p>Lalioma tidak bertindak sebagai agen perjalanan dan tidak menyediakan layanan booking langsung. Semua transaksi dilakukan langsung antara pengguna dan platform partner.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">5. Kontak</h2><p>Untuk pertanyaan, hubungi kami di hello@lalioma.id.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
