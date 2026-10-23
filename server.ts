import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `Anda adalah "Asisten AI Webkilat" (didukung teknologi Google Gemini 3.8 Flash), konsultan resmi landing page dan konversi penjualan digital dari Webkilat.
Misi utama Anda adalah membantu pemilik UMKM, pedagang online, praktisi jasa, dan pebisnis di Indonesia untuk memahami manfaat landing page, merumuskan ide copywriting/headline, dan menjawab pertanyaan seputar layanan jasa pembuatan landing page Webkilat.

INFORMASI LENGKAP LAYANAN WEBKILAT:
1. LAYANAN UTAMA & HARGA PROMO:
   - Jasa pembuatan landing page kustom super cepat: Selesai hanya dalam 1 HARI KERJA (24 jam) setelah materi/brief diterima.
   - Harga Normal: Rp 1.800.000,-
   - Harga Promo Flash Sale Saat Ini: Hanya Rp 499.000,- all-in (Hemat Rp 1.301.000).
   - Tanpa biaya langganan bulanan/tersembunyi untuk paket promo ini.

2. FASILITAS YANG DIDAPATKAN KLIEN (ALL-IN):
   - GRATIS Domain 1 tahun (.my.id atau .biz.id).
   - Desain 100% kustom & responsif (sangat optimal dan cepat di smartphone/HP pembeli).
   - Copywriting persuasif & menjual yang disesuaikan dengan produk/jasa klien.
   - Form pemesanan interaktif (order form) yang langsung mengirim data pesanan rapi ke WhatsApp penjual.
   - Integrasi tombol Call-to-Action (CTA) WhatsApp direct chat.
   - Gratis 1x revisi minor setelah website selesai.
   - Integrasi link media sosial, katalog foto produk, dan peta lokasi bisnis.

3. 5 ALASAN KENAPA BISNIS WAJIB PUNYA LANDING PAGE (EDUKASI INNE LIE):
   1. Toko Buka 24 Jam Nonstop: Website bekerja menerima calon pelanggan sepanjang hari tanpa lelah dan tanpa perlu bayar gaji kasir tambahan.
   2. Jangkauan Pasar Tak Terbatas: Pembeli bisa datang dari berbagai kota/pulau di Indonesia bahkan mancanegara.
   3. Tingkatkan Kredibilitas & Kepercayaan: Bisnis yang punya website/landing page terlihat jauh lebih profesional dan terpercaya dibanding hanya akun media sosial.
   4. Kumpulkan Database Pelanggan (Leads): "The money is in the list" — kumpulkan nomor kontak & data pembeli untuk strategi follow up dan repeat order.
   5. Pelacakan & Analitik Akurat: Bisa dipasang Meta Pixel (FB/IG Ads), Google Analytics, atau TikTok Pixel untuk retargeting iklan yang efektif.

4. KONTAK & CARA ORDER:
   - Kontak WhatsApp Admin: 0896-7368-6625 (Nomor: 6289673686625).
   - Cara Order: Klien cukup mengisi Formulir Pemesanan Kilat yang ada di halaman website Webkilat, lalu tekan tombol "Kirim Pesanan ke WhatsApp".

PEDOMAN GAYA BICARA & RESPON:
- Gunakan Bahasa Indonesia yang ramah, santun, antusias, jelas, dan berorientasi solusi (solutif).
- Jika pengguna menanyakan ide untuk bisnis mereka (misal: "saya jual hijab / herbal / kuliner / laundry"), berikan contoh ide Headline menarik, sudut pandang penawaran, atau struktur section landing page yang tepat.
- Format teks dengan rapi menggunakan poin-poin singkat (bullet points) agar nyaman dibaca di smartphone.
- Selalu selipkan ajakan ramah di akhir jawaban untuk memanfaatkan promo Rp 499.000 atau mengisi form order di website atau mengontak WhatsApp Admin di 0896-7368-6625.
- Jangan mengarang harga di luar Rp 499.000 untuk promo ini.`;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Chatbot Gemini Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Parameter pesan (message) diperlukan.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: 'Halo! Terima kasih sudah menghubungi Webkilat. Asisten AI kami siap mendampingi Anda. Jika kunci API belum terkonfigurasi di server, jangan khawatir—Anda dapat langsung berkonsultasi secara gratis dengan tim kami via WhatsApp di 0896-7368-6625 atau mengisi formulir pemesanan promo Rp 499.000 di halaman depan!'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare conversation history
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            formattedContents.push({
              role: item.role,
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }

      // Append current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      let reply: string;
      try {
        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        // 8-second timeout for quick fallback if network latency is high
        const timeoutPromise = new Promise<{ text?: string }>((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT_GRACEFUL')), 8000);
        });

        const response = await Promise.race([generatePromise, timeoutPromise]);
        reply = response.text || 'Halo! Terima kasih atas pertanyaannya. Tim kami siap membantu pembuatan landing page 1 hari untuk bisnis Anda. Silakan hubungi WhatsApp 0896-7368-6625 atau isi form order di bawah.';
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        // Only log non-timeout errors for debugging
        if (!errorMsg.includes('TIMEOUT')) {
          console.warn('Gemini request notice:', errorMsg);
        }

        // Smart domain-aware response about Webkilat
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('harga') || lowerMsg.includes('biaya') || lowerMsg.includes('promo') || lowerMsg.includes('diskon')) {
          reply = `Halo! Saat ini Webkilat sedang mengadakan **Flash Sale Terbesar**: dari harga normal ~~Rp 1.800.000~~ menjadi **Cuma Rp 499.000 all-in** (hemat Rp 1.301.000)!
Sudah termasuk:
• Domain resmi aktif 1 tahun (.my.id / .biz.id)
• Hosting super cepat & sertifikat SSL resmi
• Desain 100% kustom siap closing dalam 24 jam
• Tombol pesan terhubung otomatis ke WhatsApp Anda.

Ingin klaim kuota promonya hari ini? Silakan isi formulir di bawah atau hubungi WhatsApp Admin di **0896-7368-6625**!`;
        } else if (lowerMsg.includes('domain') || lowerMsg.includes('fasilitas') || lowerMsg.includes('fitur') || lowerMsg.includes('hosting')) {
          reply = `Dengan paket **Rp 499.000 all-in**, Anda mendapatkan:
1. **Free Domain 1 Tahun** (.my.id atau .biz.id resmi)
2. **Cloud Hosting Cepat** dengan SSL/HTTPS aman
3. **Pengerjaan Kilat 24 Jam** (1 hari kerja selesai)
4. **Copywriting Menjual** disesuaikan produk Anda
5. **Formulir Order WhatsApp Otomatis**
6. **Free Revisi 1x & Panduan Lengkap**.

Hubungi admin kami di **0896-7368-6625** untuk konsultasi lebih lanjut!`;
        } else if (lowerMsg.includes('order') || lowerMsg.includes('pesan') || lowerMsg.includes('cara') || lowerMsg.includes('daftar')) {
          reply = `Cara pemesanan sangat mudah dan cepat:
1. Gulir ke bagian **"Formulir Pemesanan Kilat"** di halaman ini.
2. Masukkan data produk/bisnis Anda dan nomor WhatsApp tujuan order.
3. Klik tombol **"Order Sekarang via WhatsApp"**.
4. Tim desainer Webkilat akan langsung memproses website Anda dalam 1 hari kerja!

Ada pertanyaan sebelum memesan? Chat admin di **0896-7368-6625** (aktif 24 jam).`;
        } else {
          reply = `Halo! Terima kasih sudah menghubungi Webkilat. Tim kami siap membantu pembuatan landing page kustom 1 hari selesai seharga promo **Rp 499.000 all-in** (sudah termasuk gratis domain 1 tahun, copywriting persuasif, dan sistem order WhatsApp otomatis).

Apakah ada bidang usaha atau produk tertentu yang ingin Anda buatkan landing page-nya hari ini? Anda juga bisa langsung chat Admin kami di WhatsApp **0896-7368-6625**!`;
        }
      }

      return res.json({ reply });
    } catch (err: unknown) {
      return res.json({
        reply: `Halo! Terima kasih sudah bertanya seputar Webkilat. Tim kami siap membantu pembuatan landing page kustom 1 hari selesai dengan harga promo Flash Sale **Rp 499.000 all-in** (sudah termasuk domain gratis 1 tahun, desain mobile-friendly, copywriting, dan form order WhatsApp).\n\nAnda dapat langsung mengobrol dengan Admin kami di WhatsApp **0896-7368-6625** untuk respon kilat atau scroll ke formulir order di bawah!`,
        isFallback: true
      });
    }
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'webkilat-backend',
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash'
    });
  });

  // Domain Availability Check Endpoint
  app.get('/api/check-domain', async (req: Request, res: Response) => {
    try {
      const rawDomain = ((req.query.domain as string) || '').toLowerCase().trim();
      if (!rawDomain) {
        return res.status(400).json({ error: 'Parameter domain wajib diisi.' });
      }

      // Clean domain input: strip protocol, www, slashes, spaces
      let clean = rawDomain
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/.*$/, '')
        .replace(/[^a-z0-9.-]/g, '');

      if (!clean) {
        return res.status(400).json({ error: 'Nama domain tidak valid.' });
      }

      const extensions = ['.my.id', '.biz.id', '.com', '.id'];
      let baseName = clean;
      let specifiedExt = '';

      for (const ext of extensions) {
        if (clean.endsWith(ext)) {
          baseName = clean.slice(0, -ext.length);
          specifiedExt = ext;
          break;
        }
      }

      if (baseName.includes('.')) {
        baseName = baseName.split('.')[0];
      }

      let extList = [...extensions];
      if (specifiedExt) {
        extList = [specifiedExt, ...extensions.filter((e) => e !== specifiedExt)];
      }

      const checkPromises = extList.map(async (ext) => {
        const fullDomain = `${baseName}${ext}`;
        let isAvailable = false;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const dohRes = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(fullDomain)}&type=NS`,
            {
              headers: { Accept: 'application/dns-json' },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (dohRes.ok) {
            const data: any = await dohRes.json();
            if (data.Status === 3) {
              isAvailable = true;
            } else if (
              data.Status === 0 &&
              (!data.Answer || data.Answer.length === 0) &&
              (!data.Authority || data.Authority.length === 0)
            ) {
              isAvailable = true;
            } else {
              isAvailable = false;
            }
          } else {
            isAvailable = true;
          }
        } catch {
          isAvailable = true;
        }

        const isFree = ext === '.my.id' || ext === '.biz.id';
        return {
          domain: fullDomain,
          extension: ext,
          isAvailable,
          isFreeWithPromo: isFree,
          badge: isFree ? 'Gratis 1 Tahun Promo' : 'Ekstensi Populer',
          message: isAvailable
            ? `${fullDomain} TERSEDIA! Siap digunakan untuk landing page Anda.`
            : `${fullDomain} sudah dipakai. Coba nama lain ya.`,
        };
      });

      const results = await Promise.all(checkPromises);
      return res.json({
        baseName,
        results,
      });
    } catch (err) {
      console.error('Error checking domain:', err);
      return res.status(500).json({ error: 'Gagal memeriksa domain.' });
    }
  });

  // Google Search Console Site Verification Endpoints (File & TXT Method Support)
  app.get(['/googleez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo.html', '/google-site-verification.html'], (_req: Request, res: Response) => {
    res.type('text/html').send('google-site-verification: googleez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo.html');
  });

  app.get(['/google-site-verification', '/google-site-verification.txt'], (_req: Request, res: Response) => {
    res.type('text/plain').send('google-site-verification=ez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo');
  });

  // Always serve public directory assets (robots.txt, icons, verification files)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Middleware to attach Google Site Verification header
  app.use((_req: Request, res: Response, next) => {
    res.setHeader('X-Google-Site-Verification', 'ez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo');
    next();
  });

  // Serve static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Webkilat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
