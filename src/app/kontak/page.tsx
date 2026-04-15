import { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi tim Lalioma untuk pertanyaan, kerja sama, atau feedback.",
};

export default function KontakPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hubungi <span className="gradient-text">Kami</span>
          </h1>
          <p className="text-muted-foreground mb-10">
            Punya pertanyaan, saran, atau ingin kerja sama? Jangan ragu untuk menghubungi kami.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="glass-card p-5 text-center">
              <Mail className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">hello@lalioma.id</p>
            </div>
            <div className="glass-card p-5 text-center">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Lokasi</h3>
              <p className="text-sm text-muted-foreground">Jakarta, Indonesia</p>
            </div>
            <div className="glass-card p-5 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Respons</h3>
              <p className="text-sm text-muted-foreground">1-2 hari kerja</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Kirim Pesan</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Nama</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-foreground text-sm outline-none focus:border-primary/30" placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-foreground text-sm outline-none focus:border-primary/30" placeholder="email@contoh.com" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Subjek</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-foreground text-sm outline-none focus:border-primary/30" placeholder="Subjek pesan" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Pesan</label>
                <textarea rows={5} className="w-full px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-foreground text-sm outline-none focus:border-primary/30 resize-none" placeholder="Tulis pesan Anda..." />
              </div>
              <button type="submit" className="btn-primary px-8 py-3">Kirim Pesan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
