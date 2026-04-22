import { Metadata } from "next";

export const metadata: Metadata = { title: "Kebijakan Privasi", description: "Kebijakan privasi Lalioma." };

export default function PrivasiPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Kebijakan Privasi</h1>
          <div className="glass-card p-6 space-y-5 text-sm text-muted-foreground leading-relaxed">
            <p>Terakhir diperbarui: Januari 2024</p>
            <div><h2 className="text-base font-semibold text-foreground mb-2">1. Informasi yang Kami Kumpulkan</h2><p>Kami mengumpulkan informasi yang Anda berikan secara langsung seperti nama dan email saat mengisi formulir kontak, serta data penggunaan seperti halaman yang dikunjungi dan klik yang dilakukan melalui cookies dan analytics tools.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">2. Penggunaan Informasi</h2><p>Informasi yang kami kumpulkan digunakan untuk meningkatkan layanan website, menyediakan konten yang relevan, dan menganalisis penggunaan website melalui Google Analytics.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">3. Link Affiliate</h2><p>Website ini menggunakan link affiliate ke platform booking hotel pihak ketiga. Saat Anda mengklik link affiliate, platform partner mungkin mengumpulkan data sesuai kebijakan privasi mereka.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">4. Cookies</h2><p>Kami menggunakan cookies untuk analitik dan meningkatkan pengalaman browsing. Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda.</p></div>
            <div><h2 className="text-base font-semibold text-foreground mb-2">5. Kontak</h2><p>Untuk pertanyaan terkait privasi, hubungi kami di hello@lalioma.id.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
