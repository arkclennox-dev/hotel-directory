import { Metadata } from "next";

export const metadata: Metadata = { title: "Disclaimer Affiliate", description: "Disclosure penggunaan link affiliate di website Hotelindo." };

export default function DisclaimerPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Disclaimer Affiliate</h1>
          <div className="glass-card p-6 space-y-5 text-sm text-muted-foreground leading-relaxed">
            <p>Website Hotelindo menggunakan link affiliate dari partner booking hotel. Berikut penjelasan lengkapnya:</p>
            <div><h2 className="text-base font-semibold text-foreground mb-2">Apa itu Link Affiliate?</h2><p>Link affiliate adalah link khusus ke platform partner kami (Traveloka, tiket.com, Agoda). Jika Anda melakukan pemesanan melalui link tersebut, kami mungkin mendapatkan komisi kecil dari partner.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">Apakah Ada Biaya Tambahan?</h2><p><strong className="text-foreground">Tidak.</strong> Penggunaan link affiliate tidak menambah biaya apapun bagi Anda. Harga yang Anda lihat dan bayar tetap sama.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">Mengapa Kami Menggunakan Link Affiliate?</h2><p>Komisi affiliate membantu kami membiayai operasional website, termasuk riset hotel, pembuatan konten, dan pemeliharaan website agar tetap gratis untuk Anda gunakan.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">Objektivitas Konten</h2><p>Penggunaan affiliate tidak mempengaruhi rekomendasi kami. Kami berkomitmen menyajikan informasi yang akurat dan objektif.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
