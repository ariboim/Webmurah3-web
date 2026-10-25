import React, { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  AlertTriangle,
  Flame,
  Clock,
  Lock,
  Award,
  Crown,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { CountdownDisplay } from './CountdownTimer';

export const PricingSection: React.FC = () => {
  const [isPromoActive, setIsPromoActive] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('promo_50_active') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handlePromoClaimed = () => {
      setIsPromoActive(true);
    };
    window.addEventListener('promo-50-claimed', handlePromoClaimed);
    return () => window.removeEventListener('promo-50-claimed', handlePromoClaimed);
  }, []);

  const handleSelectPackage = (pkg: 'umkm' | 'elite') => {
    try {
      sessionStorage.setItem('selected_package', pkg);
    } catch {}

    window.dispatchEvent(new CustomEvent('package-selected', { detail: pkg }));
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));

    setTimeout(() => {
      const el = document.getElementById('formulir-order') || document.getElementById('form-order');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleTriggerBannerPromo = () => {
    window.dispatchEvent(new CustomEvent('open-promo-modal'));
  };

  return (
    <section id="paket-harga" className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider border border-rose-200">
            <Flame className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
            <span>PILIHAN PAKET LAYANAN TERBAIK · INVESTASI BISNIS NAIK KELAS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Transparan, Jelas, &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700">
              Tanpa Biaya Tersembunyi
            </span>
          </h2>
          <p className="text-base text-slate-700 font-medium leading-relaxed">
            Pilih paket yang paling sesuai dengan target pertumbuhan bisnis Anda. Mulai dari paket kilat UMKM hingga website custom multi-halaman skala korporat.
          </p>
        </div>

        {/* PESAN SEKARANG BAYAR SETELAH JADI Banner */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <span>PESAN SEKARANG, BAYAR SETELAH JADI! (100% BEBAS RISIKO)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2 PRICING CARDS: SIDE-BY-SIDE ON DESKTOP, VERTICAL ON MOBILE              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* ===================================================================== */}
          {/* CARD 1: PAKET UMKM (BERLAKU DISKON 50% VIA BANNER PROMO)             */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
            
            {/* Top Badge */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-center py-2.5 px-4 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300 fill-current" />
              <span>PAKET SPESIALIS UMKM &bull; 1 HARI KILAT SELESAI</span>
            </div>

            <div className="p-6 sm:p-8 lg:p-9 space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Package Title & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      Landing Page Sat-Set
                    </span>
                    {isPromoActive && (
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 animate-pulse">
                        ✓ Diskon Banner 50%
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    PAKET UMKM
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Cocok untuk UMKM, produk fisik, kuliner, jasa lokal, &amp; toko online yang butuh web kilat siap promosi dalam 24 jam.
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Harga Normal:</span>
                    <span className="line-through text-slate-400">Rp 1.800.000</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-slate-800">Rp</span>
                    {isPromoActive ? (
                      <>
                        <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight">
                          249.500
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-400 line-through">
                          499.000
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">
                          499.000
                        </span>
                        <span className="text-xs font-bold text-slate-500">/ all-in</span>
                      </>
                    )}
                  </div>

                  {/* Banner Promo Status / Interactive Claim */}
                  {isPromoActive ? (
                    <div className="pt-1.5 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-black">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Diskon Banner 50% Aktif!
                      </span>
                      <span className="bg-emerald-200/70 text-emerald-950 px-2 py-0.5 rounded text-[11px]">
                        Hemat Rp 249.500
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTriggerBannerPromo}
                      className="w-full pt-1.5 text-left text-[11px] font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center justify-between cursor-pointer group/claim"
                    >
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Punya Banner Promo? Klik Klaim Diskon 50%
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black group-hover/claim:bg-amber-200">
                        Jadi Rp 249.500
                      </span>
                    </button>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    Fitur &amp; Fasilitas Layanan:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">1 Halaman Landing Page</strong> fokus konversi jualan
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">FREE Domain 1 Tahun</strong> (.my.id &amp; .biz.id)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Cloud Hosting Cepat 1 Tahun</strong> + SSL HTTPS resmi
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">100% Desain Kustom</strong> (Bukan template kaku)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Selesai Kilat 24 Jam</strong> siap share link WhatsApp
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Copywriting Menjual</strong> bikin calon pembeli tergiur
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Form &amp; Tombol WhatsApp</strong> otomatis tersambung
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Gratis Revisi 1x</strong> &amp; panduan pakai
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom CTA for Paket UMKM */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectPackage('umkm')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>
                    {isPromoActive ? 'Klaim Promo Diskon Rp 249.500' : 'Pilih Paket UMKM (Rp 499rb)'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
                <p className="text-[11px] text-center text-slate-500 font-medium">
                  {isPromoActive
                    ? '✓ Diskon 50% akan otomatis terkunci di form pemesanan'
                    : '✓ Bayar setelah landing page jadi & disetujui'}
                </p>
              </div>

            </div>
          </div>

          {/* ===================================================================== */}
          {/* CARD 2: PAKET ELITE (WEB CUSTOM) - RECOMMENDED / BEST VALUE           */}
          {/* ===================================================================== */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border-2 border-amber-400 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ring-4 ring-amber-400/20 group">
            
            {/* Prominent "RECOMMENDED / BEST VALUE" Top Badge */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-center py-2.5 px-4 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-md">
              <Crown className="w-4 h-4 fill-slate-950 stroke-slate-950" />
              <span>★ RECOMMENDED &bull; BEST VALUE UNTUK BISNIS BERKEMBANG ★</span>
            </div>

            <div className="p-6 sm:p-8 lg:p-9 space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Package Title & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
                      Multi-Halaman &bull; Custom Architecture
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-yellow-300 bg-yellow-400/20 px-2.5 py-0.5 rounded-full border border-yellow-400/40">
                      VIP Project
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2">
                    <span>PAKET ELITE</span>
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                      Web Custom
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
                    Solusi website lengkap multi-halaman berstandar agensi korporat untuk meningkatkan kredibilitas, branding, &amp; peringkat Google.
                  </p>
                </div>

                {/* Price Display with Net Notice */}
                <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-amber-400/40 space-y-2 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Harga Investasi:</span>
                    <span className="text-amber-300 font-semibold">Paket Lengkap Agensi</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-amber-400">Rp</span>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      3.000.000
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ project</span>
                  </div>

                  {/* Net Price Label: NOT applicable for 50% promo */}
                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-amber-200/90 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Harga Net / Tidak Berlaku Promo Banner
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      Fixed Price
                    </span>
                  </div>
                </div>

                {/* Features List exactly matching prompt requirements */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
                    Fitur &amp; Fasilitas Layanan Elite:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-[13px] text-slate-200">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Sampai 7 Halaman</strong> (Home, Tentang Kami, Layanan/Produk, Portofolio, Blog/Artikel, Kontak, dll.)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Desain Custom &amp; Responsif</strong> disesuaikan identitas brand Anda di HP, Tablet, &amp; Desktop
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Optimasi PageSpeed</strong> (Kecepatan akses ultra kilat, skor Google PageSpeed optimal)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Form Kontak &amp; WhatsApp</strong> interaktif dengan notifikasi pesan instan
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Dasar SEO On-Page</strong> (Meta tag, struktur H1-H3, sitemap, siap masuk pencarian Google)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Gratis Revisi 2x</strong> memastikan website sesuai ekspektasi sempurna Anda
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Termasuk Domain &amp; Cloud Server 1 Tahun</strong> (SSL HTTPS + backup rutin)
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold">Dukungan Prioritas</strong> &amp; garansi pemeliharaan teknis eksklusif
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom CTA for Paket Elite (Polished, Glowing, Contrast Gradient) */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectPackage('elite')}
                  className="relative group/btn w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></span>
                  <Crown className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <span>Pesan Paket Elite (Rp 3.000.000)</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  ✓ Mengunci paket custom Rp 3.000.000 langsung ke formulir pemesanan
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust & Bank Methods Bar */}
        <div className="mt-14 max-w-4xl mx-auto pt-8 border-t border-slate-200 flex flex-col items-center text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garansi Kepuasan &amp; Revisi Resmi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Pengerjaan Sesuai Jadwal Kontrak</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Keamanan SSL 256-Bit &amp; Backup Rutin</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 max-w-xl">
            Mendukung metode pembayaran transfer bank lokal (BCA, Mandiri, BRI, BNI), Virtual Account, dan QRIS seluruh Indonesia.
          </p>
        </div>

      </div>
    </section>
  );
};
