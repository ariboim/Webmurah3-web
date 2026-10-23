import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Share2,
  Building2,
  X,
  Send,
  Zap,
} from 'lucide-react';

export interface Article {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  sourceName: string;
  sourceUrl: string;
  keyStat: string;
  keyStatLabel: string;
  summary: string;
  content: {
    background: string;
    challenge: string;
    strategy: string[];
    result: string;
    takeaway: string;
  };
}

const ARTICLES: Article[] = [
  {
    id: 'metamorf-perawatan-sepatu',
    category: 'Jasa & Produk Kreatif',
    categoryColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Kisah Sukses "Metamorf": Dari Garasi Rumah Meraup Lonjakan Omzet 800% Berkat Ekosistem Digital',
    subtitle: 'Bagaimana usaha perawatan sepatu DIY berhasil menembus pasar 38 kota di Indonesia melalui halaman katalog digital mandiri.',
    readTime: '4 Menit Baca',
    date: '2026',
    sourceName: 'Kompas.com & Liputan UMKM Go Digital',
    sourceUrl: 'https://kompas.com',
    keyStat: '+800%',
    keyStatLabel: 'Lonjakan Omzet Usaha',
    summary:
      'Senoaji, pemilik brand perawatan sepatu Metamorf, awalnya hanya melayani orderan sekitar lingkungan perumahan. Setelah membangun kehadiran digital dengan halaman penawaran khusus dan integrasi pemesanan instan via WhatsApp, bisnisnya berkembang pesat dengan lonjakan omzet hingga 800% dan pengiriman ratusan paket setiap hari ke seluruh Indonesia.',
    content: {
      background:
        'Senoaji mengawali usaha perawatan sepatu DIY (Do-It-Yourself) dari garasi rumah dengan modal terbatas. Sebelum bertransformasi ke digital, tantangan terbesarnya adalah lingkup pasar yang sempit karena hanya mengandalkan pelanggan lokal sekitar domisili yang datang secara fisik.',
      challenge:
        'Pelanggan ragu membeli produk perawatan sepatu tanpa bukti hasil nyata (before-after), serta kebingungan calon pembeli memilih jenis formula pembersih yang cocok untuk bahan sepatu tertentu (canvas, suede, leather).',
      strategy: [
        'Membuat halaman website/landing page resmi yang menampilkan galeri transformasi sebelum & sesudah (before-after) secara detail dan meyakinkan.',
        'Menyediakan tombol konsultasi dan pemesanan cepat langsung ke WhatsApp, sehingga calon pembeli bisa berkonsultasi gratis mengenai jenis sepatu mereka sebelum membeli.',
        'Menerapkan paket hemat bundling (sabun pembersih + sikat bulu kuda + semprotan anti-air) dengan diskon khusus yang dipajang di halaman utama website.',
        'Memanfaatkan domain resmi sendiri (.my.id/.biz.id) yang meningkatkan reputasi usaha menjadi lebih tepercaya dan profesional di mata pelanggan luar pulau.',
      ],
      result:
        'Omzet bulanan melonjak hingga 800% dalam waktu kurang dari satu tahun. Jangkauan distribusi melebar ke 38 kota dari Sumatra, Jawa, hingga Sulawesi, dengan perputaran ratusan paket perawatan sepatu yang dikirim setiap minggunya.',
      takeaway:
        'Bagi pelaku usaha kreatif, halaman website mandiri adalah "etalase permanen" 24 jam. Kejelasan visual hasil kerja dan kemudahan order via WhatsApp menjadi kunci utama yang meruntuhkan keraguan pembeli baru.',
    },
  },
  {
    id: 'kuliner-rasa-nusantara',
    category: 'Kuliner & Makanan Kemasan',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Transformasi "Rasa Nusantara": Penjualan Makanan Rumahan Melonjak 230% dan Tembus Pasar Antar-Kota',
    subtitle: 'Kisah UMKM kuliner Bandung yang melompat dari sekadar jualan antar tetangga menjadi produsen frozen food beromzet puluhan juta.',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Digima & Studi Kasus UMKM Bandung',
    sourceUrl: 'https://digima.id',
    keyStat: '+230%',
    keyStatLabel: 'Pertumbuhan Penjualan 12 Bulan',
    summary:
      'Usaha kuliner rumahan "Rasa Nusantara" asal Bandung mulanya hanya mengandalkan pesanan arisan tetangga. Begitu membuat landing page 1 halaman dengan menu paket frozen, testimoni pelanggan, dan jaminan pengiriman higienis, penjualan meroket 230% dalam 12 bulan dan 40% pesanan datang dari luar kota.',
    content: {
      background:
        'Dimulai dari resep sambal cumi dan lauk pauk tradisional khas Jawa Barat oleh ibu rumah tangga, produk ini sangat disukai keluarga. Namun saat berniat menjadikannya bisnis serius, penjualan tersendat karena keterbatasan channel distribusi konvensional.',
      challenge:
        'Calon pembeli luar kota ragu mengenai ketahanan makanan, sertifikasi higienis, serta proses pengiriman makanan basah yang rawan basi jika tidak dikemas vakum dengan benar.',
      strategy: [
        'Membangun landing page khusus produk makanan dengan fokus pada foto produk asli berselera tinggi (high-appetite visual).',
        'Menyematkan informasi ketahanan makanan secara transparan: tahan 7 hari suhu ruang, 6 bulan beku di freezer, dengan sertifikat P-IRT & Halal MUI.',
        'Membuat paket promo bundling (Beli 3 Botol Sambal Gratis 1 Lauk Siap Saji) lengkap dengan hitung mundur penawaran terbatas.',
        'Menyediakan formulir pemesanan ringkas dengan integrasi alamat otomatis dan konfirmasi ongkos kirim ekspedisi kilat Paxel / JNE YES.',
      ],
      result:
        'Total transaksi bulanan meningkat 230% dalam waktu 12 bulan. Sebanyak 40% dari total pelanggan aktif kini berasal dari luar kota Bandung seperti Jakarta, Surabaya, Semarang, dan Denpasar, dengan pesanan rutin setiap awal bulan.',
      takeaway:
        'Bisnis kuliner yang memiliki landing page mandiri terlihat 10x lebih higienis dan tepercaya dibanding bisnis yang hanya berjualan di feed media sosial tanpa informasi spesifikasi produk yang jelas.',
    },
  },
  {
    id: 'riset-kemenkop-data-digital',
    category: 'Riset & Data Nasional',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Riset Kemenkop UKM & EzeeLink: Rata-Rata UMKM Digital Meraup Kenaikan Pendapatan 26% Hingga 5 Kali Lipat',
    subtitle: 'Data komprehensif adopsi teknologi: mengapa memiliki aset website mandiri membebaskan UMKM dari jebakan perang harga.',
    readTime: '4 Menit Baca',
    date: '2026',
    sourceName: 'Kemenkop UKM RI, Bank Indonesia & EzeeLink Research',
    sourceUrl: 'https://binus.ac.id',
    keyStat: '5X Lipat',
    keyStatLabel: 'Maksimal Kenaikan Omzet',
    summary:
      'Laporan riset Kemenkop UKM dan survei adopsi digital mencatat rata-rata pelaku usaha mikro yang mendigitalisasi operasional dan memiliki website sendiri mengalami kenaikan omzet 26% hingga 5 kali lipat, memangkas rantai distribusi panjang, serta mengamankan database pembeli tetap.',
    content: {
      background:
        'Transformasi digital UMKM menjadi agenda prioritas nasional dengan target lebih dari 30 juta UMKM terhubung ekosistem digital. Riset membuktikan bahwa bisnis dengan aset digital mandiri memiliki ketahanan ekonomi 3x lipat lebih tinggi saat krisis.',
      challenge:
        'Banyak UMKM hanya bergantung pada marketplace pihak ketiga, yang kerap memotong biaya admin tinggi (6% - 12%) serta memicu perang harga (*price war*) yang menghabiskan margin laba bersih pedagang kecil.',
      strategy: [
        'Membangun aset digital milik sendiri (landing page & nama domain bisnis mandiri) agar memiliki kendali penuh atas harga dan identitas merek.',
        'Menghubungkan tombol pesan langsung ke kontak WhatsApp penjual, sehingga nomor ponsel pembeli tersimpan ke dalam database pelanggan bisnis.',
        'Memanfaatkan penawaran harga paket (bundling) dan garansi kepuasan yang tidak bisa ditiru oleh kompetitor di marketplace.',
        'Menerapkan pengerjaan kilat 24 jam untuk meluncurkan kampanye produk sebelum momen musiman (hari raya, gajian, atau event promo).',
      ],
      result:
        'Pelaku usaha yang menerapkan strategi landing page mandiri mencatatkan penghematan biaya komisi hingga 100%, kenaikan omzet rata-rata 26% hingga 5x lipat, dan tingkat pembelian ulang (*repeat order*) mencapai 35-45% karena komunikasi WhatsApp yang intim.',
      takeaway:
        'Website bukan sekadar biaya, melainkan aset investasi penjualan 24 jam. Dengan biaya awal terjangkau (promo Rp 499.000 all-in), ROI (Return on Investment) UMKM dapat tercapai hanya dari 5 sampai 10 transaksi pertama.',
    },
  },
];

interface ArticlesPageSectionProps {
  onNavigateToOrder?: () => void;
}

export const ArticlesPageSection: React.FC<ArticlesPageSectionProps> = ({
  onNavigateToOrder,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Artikel' },
    { id: 'Jasa & Produk Kreatif', label: 'Jasa & Produk Kreatif' },
    { id: 'Kuliner & Makanan Kemasan', label: 'Kuliner & F&B' },
    { id: 'Riset & Data Nasional', label: 'Riset & Data Nasional' },
  ];

  const filteredArticles =
    activeCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  const handleOpenOrder = () => {
    setSelectedArticle(null);
    if (onNavigateToOrder) {
      onNavigateToOrder();
    } else {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Pusat Artikel & Inspirasi UMKM Go Digital</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Kisah Sukses UMKM Setelah <span className="text-sky-600">Digitalisasi Usaha</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Pelajari data dan kisah nyata pelaku usaha di Indonesia yang berhasil melipatgandakan omzet, memperluas pasar antar-pulau, dan meningkatkan kredibilitas dengan memiliki landing page resmi.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-sky-300"
            >
              <div className="p-6 sm:p-7 space-y-4 flex-1">
                {/* Top Metas */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${article.categoryColor}`}
                  >
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Big Stat Highlight Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50/40 to-white border border-sky-100 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black text-sky-700 tracking-tight">
                      {article.keyStat}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600">
                      {article.keyStatLabel}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>

                {/* Verified Source Citation */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold truncate">
                    Data: {article.sourceName}
                  </span>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:shadow-md"
                >
                  <span>BACA KISAH LENGKAP & STRATEGI</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>


        {/* Big Bottom Social Proof Callout */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Giliran Bisnis Anda Naik Kelas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ingin Merasakan Peningkatan Omzet Serupa?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anda tidak perlu menunggu berbulan-bulan atau mengeluarkan jutaan rupiah. Dengan promo <strong className="text-yellow-400">Rp 499.000 all-in</strong>, landing page kustom bisnis Anda akan selesai dikerjakan dalam <strong className="text-emerald-400">1 hari kerja</strong> lengkap dengan gratis domain 1 tahun!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={handleOpenOrder}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-xl hover:shadow-yellow-400/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>KLAIM PROMO RP 499RB SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/6289673686625?text=Halo%20Admin%20Webkilat,%20saya%20tertarik%20dengan%20artikel%20kesuksesan%20UMKM%20dan%20ingin%20membuat%20landing%20page%20promo%20Rp%20499rb%20sekarang!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Konsultasi WA (0896-7368-6625)</span>
            </a>
          </div>
        </div>
      </div>

      {/* In-Depth Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Tutup Artikel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div className="space-y-3 pr-8">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${selectedArticle.categoryColor}`}
              >
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Award className="w-4 h-4 text-amber-500" />
                  Sumber: {selectedArticle.sourceName}
                </span>
                <span>•</span>
                <span>Waktu Baca: {selectedArticle.readTime}</span>
              </div>
            </div>

            {/* Stat Callout in Modal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-sky-700">
                  {selectedArticle.keyStat}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {selectedArticle.keyStatLabel}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 text-right">
                Studi Kasus Terverifikasi
              </div>
            </div>

            {/* Editorial Content Breakdown */}
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                  1. Latar Belakang &amp; Awal Usaha
                </h4>
                <p>{selectedArticle.content.background}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                  2. Tantangan Sebelum Memiliki Landing Page
                </h4>
                <p>{selectedArticle.content.challenge}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                  3. Strategi Digitalisasi yang Diterapkan
                </h4>
                <ul className="space-y-2.5">
                  {selectedArticle.content.strategy.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <h4 className="font-black text-emerald-900 text-sm uppercase tracking-wide">
                  4. Hasil Nyata yang Dicapai
                </h4>
                <p className="text-emerald-950 font-medium">
                  {selectedArticle.content.result}
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-black text-amber-900 text-sm uppercase tracking-wide">
                  5. Kesimpulan &amp; Pelajaran untuk UMKM Lain
                </h4>
                <p className="text-amber-950 font-medium">
                  {selectedArticle.content.takeaway}
                </p>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Punya bisnis serupa? Segera miliki landing page siap closing Anda.
              </span>
              <button
                type="button"
                onClick={handleOpenOrder}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pesan Landing Page Sekarang (Rp 499rb)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
