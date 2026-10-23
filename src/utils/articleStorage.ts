/**
 * Article & Admin Auth Storage Utility
 * Manages persistent articles and admin credentials in localStorage.
 */

export interface ArticleContent {
  background?: string;
  challenge?: string;
  strategy?: string[];
  result?: string;
  takeaway?: string;
  bodyText?: string; // Free-form article text / paragraphs
}

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
  imageUrl?: string; // Direct image URL, Google Drive image, or Base64 upload
  videoUrl?: string; // YouTube or Google Drive video URL
  videoType?: 'youtube' | 'drive' | 'direct' | 'none';
  content: ArticleContent;
  author?: string;
  isCustom?: boolean;
  createdAt?: number;
}

export const DEFAULT_ARTICLES: Article[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
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
    isCustom: false,
    createdAt: 1710000000000,
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
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
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
    isCustom: false,
    createdAt: 1711000000000,
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
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    content: {
      background:
        'Transformasi digital UMKM menjadi agenda prioritas nasional dengan target lebih dari 30 juta UMKM terhubung ekosistem digital. Riset membuktikan bahwa bisnis dengan aset digital mandiri memiliki ketahanan ekonomi 3x lipat lebih tinggi saat krisis.',
      challenge:
        'Banyak UMKM hanya bergantung pada marketplace pihak ketiga, yang kerap memotong biaya admin tinggi (6% - 12%) serta memicu perang harga (price war) yang menghabiskan margin laba bersih pedagang kecil.',
      strategy: [
        'Membangun aset digital milik sendiri (landing page & nama domain bisnis mandiri) agar memiliki kendali penuh atas harga dan identitas merek.',
        'Menghubungkan tombol pesan langsung ke kontak WhatsApp penjual, sehingga nomor ponsel pembeli tersimpan ke dalam database pelanggan bisnis.',
        'Memanfaatkan penawaran harga paket (bundling) dan garansi kepuasan yang tidak bisa ditiru oleh kompetitor di marketplace.',
        'Menerapkan pengerjaan kilat 24 jam untuk meluncurkan kampanye produk sebelum momen musiman (hari raya, gajian, atau event promo).',
      ],
      result:
        'Pelaku usaha yang menerapkan strategi landing page mandiri mencatatkan penghematan biaya komisi hingga 100%, kenaikan omzet rata-rata 26% hingga 5x lipat, dan tingkat pembelian ulang (repeat order) mencapai 35-45% karena komunikasi WhatsApp yang intim.',
      takeaway:
        'Website bukan sekadar biaya, melainkan aset investasi penjualan 24 jam. Dengan biaya awal terjangkau (promo Rp 499.000 all-in), ROI (Return on Investment) UMKM dapat tercapai hanya dari 5 sampai 10 transaksi pertama.',
    },
    isCustom: false,
    createdAt: 1712000000000,
  },
];

const ARTICLES_STORAGE_KEY = 'webmurah_articles_v2';
const ADMIN_CREDS_STORAGE_KEY = 'webmurah_admin_credentials_v1';
const ADMIN_SESSION_STORAGE_KEY = 'webmurah_admin_logged_in';

export interface AdminCredentials {
  username: string;
  password: string;
  lastUpdated: string;
}

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
  lastUpdated: 'Default',
};

// ================= ADMIN CREDENTIALS & AUTH =================

export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin creds:', e);
  }
  return DEFAULT_ADMIN_CREDS;
}

export function saveAdminCredentials(creds: AdminCredentials): boolean {
  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(creds));
    return true;
  } catch (e) {
    console.error('Error saving admin creds:', e);
    return false;
  }
}

export function updateAdminCredentials(newUsername: string, newPassword: string): { success: boolean; message: string } {
  const trimmedUser = newUsername.trim();
  const trimmedPass = newPassword.trim();

  if (!trimmedUser || trimmedUser.length < 3) {
    return { success: false, message: 'Username minimal harus 3 karakter.' };
  }
  if (!trimmedPass || trimmedPass.length < 4) {
    return { success: false, message: 'Password minimal harus 4 karakter.' };
  }

  const updated: AdminCredentials = {
    username: trimmedUser,
    password: trimmedPass,
    lastUpdated: new Date().toLocaleString('id-ID'),
  };

  const ok = saveAdminCredentials(updated);
  if (ok) {
    return { success: true, message: `Username dan Password admin berhasil diperbarui menjadi "${trimmedUser}".` };
  }
  return { success: false, message: 'Gagal menyimpan perubahan ke browser.' };
}

export function verifyAdminLogin(usernameAttempt: string, passwordAttempt: string): boolean {
  const creds = getAdminCredentials();
  return (
    usernameAttempt.trim().toLowerCase() === creds.username.trim().toLowerCase() &&
    passwordAttempt.trim() === creds.password.trim()
  );
}

export function isAdminLoggedIn(): boolean {
  try {
    return (
      sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true' ||
      localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

export function setAdminSession(loggedIn: boolean, remember: boolean = true) {
  try {
    if (loggedIn) {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      if (remember) {
        localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      }
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error toggling admin session:', e);
  }
}

// ================= ARTICLES MANAGEMENT =================

export function getAllArticles(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (raw) {
      const customArticles: Article[] = JSON.parse(raw);
      if (Array.isArray(customArticles)) {
        // Return custom articles on top, followed by defaults (avoiding duplicate IDs)
        const customIds = new Set(customArticles.map((a) => a.id));
        const filteredDefaults = DEFAULT_ARTICLES.filter((a) => !customIds.has(a.id));
        return [...customArticles, ...filteredDefaults];
      }
    }
  } catch (e) {
    console.error('Error loading articles from storage:', e);
  }
  return DEFAULT_ARTICLES;
}

export function getCustomArticlesOnly(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (raw) {
      const parsed: Article[] = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveArticle(article: Article): boolean {
  try {
    const currentCustom = getCustomArticlesOnly();
    const existingIndex = currentCustom.findIndex((a) => a.id === article.id);

    let updatedList: Article[];
    if (existingIndex >= 0) {
      updatedList = [...currentCustom];
      updatedList[existingIndex] = { ...article, isCustom: true };
    } else {
      updatedList = [{ ...article, isCustom: true, createdAt: Date.now() }, ...currentCustom];
    }

    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedList));

    // Dispatch custom event to notify listeners (ArticlesPageSection, etc.)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: updatedList }));
    }
    return true;
  } catch (e) {
    console.error('Failed to save article:', e);
    return false;
  }
}

export function deleteArticle(articleId: string): boolean {
  try {
    const currentCustom = getCustomArticlesOnly();
    const filtered = currentCustom.filter((a) => a.id !== articleId);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: filtered }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete article:', e);
    return false;
  }
}

export function resetArticlesToDefault(): void {
  try {
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: DEFAULT_ARTICLES }));
    }
  } catch (e) {
    console.error(e);
  }
}
