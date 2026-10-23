export interface OrderFormData {
  namaSalesKonsultan: string;
  // 1. Data Klien
  namaLengkap: string;
  nomorWa: string;
  email: string;
  namaBisnis: string;
  domainPilihan?: string;
  alamatBisnis: string;
  mediaSosial: string;
  // 2. Informasi Produk / Layanan
  namaProduk: string;
  deskripsiProduk: string;
  targetAudiens: string;
  hargaPenawaran: string;
  catatanTambahan?: string;
  // 3. Kebutuhan & Tujuan Landing Page
  tujuanLandingPage: string[];
  tujuanLainnya: string;
  ctaDiinginkan: string[];
  ctaLainnya: string;
  // Status Promo 50%
  isPromoActive?: boolean;
}

export const ADMIN_WA_NUMBER = '6289673686625';
export const ADMIN_WA_DISPLAY = '0896-7368-6625';

export function formatOrderToWhatsApp(data: OrderFormData, isPromoActiveOverride?: boolean): string {
  const isPromo = isPromoActiveOverride ?? data.isPromoActive ?? false;
  const tujuanList = [...data.tujuanLandingPage];
  if (data.tujuanLainnya.trim()) {
    tujuanList.push(`Lainnya: ${data.tujuanLainnya.trim()}`);
  }

  const ctaList = [...data.ctaDiinginkan];
  if (data.ctaLainnya.trim()) {
    ctaList.push(`Lainnya: ${data.ctaLainnya.trim()}`);
  }

  const lines = [
    `*FORMULIR PEMESANAN JASA LANDING PAGE WEB KILAT*`,
    isPromo
      ? `Paket: PROMO SPESIAL DISKON 50% (Rp 499.000 -> Rp 249.000)`
      : `Paket: FLASH SALE (Promo Terbatas Rp 1.8 Juta -> Rp 499.000)`,
    ``,
    `--------------------------------`,
    isPromo
      ? `Status Promo: YA (PROGRAM PROMO DISKON 50%)\nTotal Tagihan: Rp 249.000`
      : `Status Promo: REGULER FLASH SALE\nTotal Tagihan: Rp 499.000`,
    `--------------------------------`,
    `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`,
    ``,
    data.namaSalesKonsultan ? `*Nama Sales Konsultan:* ${data.namaSalesKonsultan}` : `*Nama Sales Konsultan:* -`,
    ``,
    `*1. DATA KLIEN*`,
    `• *Nama Lengkap / PIC:* ${data.namaLengkap || '-'}`,
    `• *No. WhatsApp / Kontak:* ${data.nomorWa || '-'}`,
    `• *Email:* ${data.email || '-'}`,
    `• *Nama Bisnis / Brand:* ${data.namaBisnis || '-'}`,
    `• *Pilihan Nama Domain:* ${data.domainPilihan || '(Belum ditentukan / minta rekomendasi admin)'}`,
    `• *Alamat Pengiriman / Bisnis:* ${data.alamatBisnis || '-'}`,
    `• *Web / Medsos Saat Ini:* ${data.mediaSosial || '-'}`,
    ``,
    `*2. INFORMASI PRODUK / LAYANAN*`,
    `• *Nama Produk / Layanan:* ${data.namaProduk || '-'}`,
    `• *Deskripsi Singkat:* ${data.deskripsiProduk || '-'}`,
    `• *Target Audiens:* ${data.targetAudiens || '-'}`,
    `• *Harga & Penawaran Khusus:* ${data.hargaPenawaran || '-'}`,
    data.catatanTambahan ? `• *Catatan Tambahan:* ${data.catatanTambahan}` : null,
    ``,
    `*3. KEBUTUHAN & TUJUAN LANDING PAGE*`,
    `• *Tujuan Utama:*`,
    ...(tujuanList.length > 0 ? tujuanList.map(t => `   - ${t}`) : [`   - (Belum ditentukan)`]),
    `• *Call to Action (CTA) Diinginkan:*`,
    ...(ctaList.length > 0 ? ctaList.map(c => `   - ${c}`) : [`   - (Belum ditentukan)`]),
    ``,
    `*4. SYARAT & KETENTUAN:*`,
    `• PESAN SEKARANG BAYAR SETELAH JADI.`,
    `• Setelah web jadi kami akan mengirimkan invoice dengan batas waktu 1 x 24 jam untuk pembayaran, jika sudah melewati batas waktu kami belum menerima pembayaran maka status web akan kami pending (tidak bisa online).`,
    `• Menyetujui S&K Harga Promo (Free 1x revisi, Free domain .my.id/.biz.id, tanpa email bisnis)`,
    ``,
    isPromo
      ? `Halo Admin Webkilat, saya memesan lewat *Promo Diskon 50% (Rp 249.000)*. Mohon segera diproses pengerjaannya. Terima kasih!`
      : `Halo Admin Webkilat, saya sudah mengisi formulir order di atas dan menyetujui syarat & ketentuan promo. Mohon segera diproses untuk pengerjaan 1 hari kilat. Terima kasih!`
  ].filter(line => line !== null) as string[];

  return lines.join('\n');
}

export function generateWhatsAppUrl(data: OrderFormData, isPromoActiveOverride?: boolean): string {
  const message = formatOrderToWhatsApp(data, isPromoActiveOverride);
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
