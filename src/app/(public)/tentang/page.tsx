import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Tentang Lalioma — directory hotel Indonesia terlengkap untuk membantu Anda menemukan hotel terbaik.",
};

export default function TentangPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Tentang <span className="gradient-text">Lalioma</span>
          </h1>

          <div className="prose prose-invert prose-dark max-w-none space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Misi Kami</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lalioma hadir untuk membantu traveler Indonesia menemukan hotel yang tepat dengan mudah dan cepat. Kami menyediakan directory hotel terlengkap yang memudahkan pencarian berdasarkan kota, kategori, landmark, dan kebutuhan spesifik Anda.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Bagaimana Kami Bekerja</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kami mengumpulkan dan menyajikan informasi hotel dari seluruh Indonesia dalam format yang mudah dibandingkan. Untuk melakukan booking, kami mengarahkan Anda ke platform partner terpercaya seperti:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">• <strong className="text-foreground">Traveloka</strong> — Platform travel terbesar di Asia Tenggara</li>
                <li className="flex items-center gap-2">• <strong className="text-foreground">tiket.com</strong> — Platform booking hotel dan tiket Indonesia</li>
                <li className="flex items-center gap-2">• <strong className="text-foreground">Agoda</strong> — Platform hotel global dengan harga kompetitif</li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Disclaimer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Beberapa link di website ini merupakan link affiliate. Artinya, kami mungkin mendapatkan komisi kecil jika Anda melakukan pemesanan melalui link tersebut. Hal ini tidak menambah biaya apapun bagi Anda dan membantu kami mempertahankan layanan ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
