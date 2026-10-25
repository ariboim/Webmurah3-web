import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  RotateCcw,
  ShieldCheck,
  Building2,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  BadgeCheck,
  CheckSquare,
  Square,
  PenTool,
  Award,
  DollarSign,
  TrendingUp,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../types/order';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface MitraData {
  namaLengkap: string;
  nik: string;
  tempatTanggalLahir: string;
  alamatKtp: string;
  kotaDomisili: string;
  noHpWa: string;
  email: string;
  namaBank: string;
  nomorRekening: string;
  namaPemilikRekening: string;
  setujuTarget: boolean;
  tanggalPerjanjian: string;
  nomorSurat: string;
  signatureDataUrl: string;
}

const STORAGE_KEY = 'kemitraan_mitra_data_v1';

export const KemitraanPageSection: React.FC<{
  onNavigateToOrder?: () => void;
  onNavigateToContact?: () => void;
}> = ({ onNavigateToOrder, onNavigateToContact }) => {
  // Stepper: 1: Form Input, 2: Tanda Tangan, 3: Pratinjau & Unduh PDF
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields State
  const [formData, setFormData] = useState<MitraData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved mitra data:', e);
    }

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateFormatted = today.toLocaleDateString('id-ID', options);
    const randomCode = Math.floor(1000 + Math.random() * 9000);

    return {
      namaLengkap: '',
      nik: '',
      tempatTanggalLahir: '',
      alamatKtp: '',
      kotaDomisili: '',
      noHpWa: '',
      email: '',
      namaBank: 'BCA',
      nomorRekening: '',
      namaPemilikRekening: '',
      setujuTarget: false,
      tanggalPerjanjian: dateFormatted,
      nomorSurat: `SPK-ITDI/MITRA/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${randomCode}`,
      signatureDataUrl: '',
    };
  });

  // Canvas Signature state & refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadInstanceRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const agreementContainerRef = useRef<HTMLDivElement | null>(null);

  // Save to localStorage when formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  }, [formData]);

  // Setup Signature Pad (using CDN SignaturePad or Hi-DPI Canvas fallback)
  useEffect(() => {
    if (currentStep === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set actual pixel dimensions for crisp strokes on Retina / Mobile screens
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = '#0f2b5c';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      const SigPadConstructor = (window as any).SignaturePad;
      if (typeof SigPadConstructor === 'function') {
        try {
          const pad = new SigPadConstructor(canvas, {
            penColor: '#0f2b5c',
            minWidth: 1.5,
            maxWidth: 3,
            backgroundColor: 'rgba(255, 255, 255, 0)',
          });

          pad.addEventListener('endStroke', () => {
            setHasDrawn(!pad.isEmpty());
          });

          signaturePadInstanceRef.current = pad;

          if (formData.signatureDataUrl) {
            pad.fromDataURL(formData.signatureDataUrl);
            setHasDrawn(true);
          }
        } catch (e) {
          console.warn('SignaturePad initialization fallback:', e);
        }
      } else if (formData.signatureDataUrl && ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          setHasDrawn(true);
        };
        img.src = formData.signatureDataUrl;
      }
    }
  }, [currentStep]);

  // Canvas Drawing Handlers (Touch & Mouse Support)
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (signaturePadInstanceRef.current) {
      try {
        signaturePadInstanceRef.current.clear();
      } catch (e) {
        // ignore
      }
    }
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    }
    setHasDrawn(false);
    setFormData((prev) => ({ ...prev, signatureDataUrl: '' }));
  };

  // Step 1 Validation
  const handleValidateAndProceedToSign = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.namaLengkap.trim()) errors.push('Nama Lengkap (Sesuai KTP) wajib diisi.');
    if (!formData.nik.trim() || formData.nik.trim().length < 15) {
      errors.push('No. NIK / KTP minimal 16 digit angka.');
    }
    if (!formData.tempatTanggalLahir.trim()) errors.push('Tempat & Tanggal Lahir wajib diisi.');
    if (!formData.alamatKtp.trim()) errors.push('Alamat Lengkap Sesuai KTP wajib diisi.');
    if (!formData.kotaDomisili.trim()) errors.push('Kota / Kabupaten Domisili wajib diisi.');
    if (!formData.noHpWa.trim()) errors.push('Nomor WhatsApp / HP Aktif wajib diisi.');
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.push('Alamat Email Aktif tidak valid.');
    }
    if (!formData.namaBank.trim()) errors.push('Nama Bank wajib diisi.');
    if (!formData.nomorRekening.trim()) errors.push('Nomor Rekening Bank wajib diisi.');
    if (!formData.namaPemilikRekening.trim()) errors.push('Nama Pemilik Rekening wajib diisi.');
    if (!formData.setujuTarget) {
      errors.push('Anda harus mencentang persetujuan target evaluasi omzet minimal Rp 10.000.000/bulan.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);
    setCurrentStep(2);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Step 2 Validation (Apply Signature)
  const handleApplySignatureAndProceedToAgreement = () => {
    let dataUrl = '';
    if (signaturePadInstanceRef.current && !signaturePadInstanceRef.current.isEmpty()) {
      dataUrl = signaturePadInstanceRef.current.toDataURL('image/png');
    } else if (canvasRef.current && hasDrawn) {
      dataUrl = canvasRef.current.toDataURL('image/png');
    }

    if (!dataUrl) {
      alert('Silakan bubuhkan tanda tangan Anda pada kotak canvas terlebih dahulu.');
      return;
    }

    setFormData((prev) => ({ ...prev, signatureDataUrl: dataUrl }));
    setCurrentStep(3);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Step 3: Export to PDF using html2canvas-pro (native OKLCH support) + jsPDF
  const handleDownloadPdf = async () => {
    if (!agreementContainerRef.current) return;
    setIsExportingPdf(true);
    setPdfSuccessNotice(null);

    const safeMitraName = formData.namaLengkap.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';
    const fileName = `Perjanjian-Kemitraan-${safeMitraName}.pdf`;

    try {
      const element = agreementContainerRef.current;

      // Render with html2canvas-pro which natively supports Tailwind v4 OKLCH colors
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10; // 10mm margin
      const printWidth = pageWidth - margin * 2; // 190mm
      const availablePageHeight = pageHeight - margin * 2; // 277mm

      // Total height in mm when fitted to printWidth
      const totalPrintHeight = (canvas.height * printWidth) / canvas.width;

      if (totalPrintHeight <= availablePageHeight) {
        // Single page document
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', margin, margin, printWidth, totalPrintHeight);
      } else {
        // Multi-page document: slice canvas cleanly by page height
        const pageCanvasHeight = (availablePageHeight * canvas.width) / printWidth;
        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < canvas.height) {
          if (pageIndex > 0) {
            pdf.addPage();
          }

          const currentSliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = currentSliceHeight;
          const sliceCtx = sliceCanvas.getContext('2d');

          if (sliceCtx) {
            sliceCtx.fillStyle = '#ffffff';
            sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            sliceCtx.drawImage(
              canvas,
              0,
              renderedHeight,
              canvas.width,
              currentSliceHeight,
              0,
              0,
              canvas.width,
              currentSliceHeight
            );

            const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
            const slicePrintHeight = (currentSliceHeight * printWidth) / canvas.width;
            pdf.addImage(sliceData, 'JPEG', margin, margin, printWidth, slicePrintHeight);
          }

          renderedHeight += pageCanvasHeight;
          pageIndex++;
        }
      }

      pdf.save(fileName);
      setIsExportingPdf(false);
      setPdfSuccessNotice(`Dokumen PDF resmi berhasil diunduh: ${fileName}`);
      setTimeout(() => setPdfSuccessNotice(null), 8000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setIsExportingPdf(false);
      // Fallback: window.print()
      window.print();
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  const handleSendToWhatsApp = () => {
    const text = `Halo Admin PT INOVASI TEKNOLOGI DIGITAL INDONESIA,

Saya telah melengkapi data dan menandatangani Surat Perjanjian Kemitraan Mandiri (Non-PKWT) secara online:

*DATA MITRA MANDIRI:*
- Nama: ${formData.namaLengkap}
- NIK: ${formData.nik}
- Domisili: ${formData.kotaDomisili}
- No. WhatsApp: ${formData.noHpWa}
- Rekening: ${formData.namaBank} - ${formData.nomorRekening} (a.n ${formData.namaPemilikRekening})
- No. Dokumen: ${formData.nomorSurat}
- Tanggal: ${formData.tanggalPerjanjian}

Saya siap menjalankan komitmen WFH dan target evaluasi Rp 10.000.000/bulan. Mohon verifikasi dan aktivasi kemitraan saya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleResetForm = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh formulir dan tanda tangan?')) {
      localStorage.removeItem(STORAGE_KEY);
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = today.toLocaleDateString('id-ID', options);
      const randomCode = Math.floor(1000 + Math.random() * 9000);

      setFormData({
        namaLengkap: '',
        nik: '',
        tempatTanggalLahir: '',
        alamatKtp: '',
        kotaDomisili: '',
        noHpWa: '',
        email: '',
        namaBank: 'BCA',
        nomorRekening: '',
        namaPemilikRekening: '',
        setujuTarget: false,
        tanggalPerjanjian: dateFormatted,
        nomorSurat: `SPK-ITDI/MITRA/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${randomCode}`,
        signatureDataUrl: '',
      });
      setCurrentStep(1);
      clearCanvas();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-black uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-indigo-700" />
            <span>Program Karir &amp; Kemitraan Mandiri (Non-PKWT)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kerjasama Kemitraan Digital <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D3582] via-sky-600 to-indigo-600">
              PT Inovasi Teknologi Digital Indonesia
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Sistem onboarding dan tanda tangan surat perjanjian kemitraan mandiri secara online. Bebas bekerja dari mana saja (Full WFH) dengan pembagian fee 60% : 40% dan peluang pengangkatan karyawan tetap (PKWTT).
          </p>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
              60%
            </div>
            <div className="text-xs font-extrabold text-slate-900">Hak Fee Mitra</div>
            <div className="text-[11px] text-slate-500">60% Mitra : 40% Principle</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Pencairan Mingguan</div>
            <div className="text-[11px] text-slate-500">Weekly settlement rekening</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Jalur PKWTT Tetap</div>
            <div className="text-[11px] text-slate-500">Gaji Rp 3jt - Rp 5.8jt/bln</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Digital Signature</div>
            <div className="text-[11px] text-slate-500">Tanda tangan online &amp; PDF</div>
          </div>
        </div>

        {/* Multi-Step Breadcrumb Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-sky-50 text-sky-900 border border-sky-300 font-extrabold'
                  : 'text-slate-500 hover:bg-slate-50 font-bold'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === 1
                    ? 'bg-[#1D3582] text-white shadow-sm'
                    : currentStep > 1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-[11px] sm:text-xs">1. Data Calon Mitra</span>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (formData.namaLengkap && formData.nik) setCurrentStep(2);
              }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-sky-50 text-sky-900 border border-sky-300 font-extrabold'
                  : 'text-slate-500 hover:bg-slate-50 font-bold'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === 2
                    ? 'bg-[#1D3582] text-white shadow-sm'
                    : currentStep > 2
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-[11px] sm:text-xs">2. Tanda Tangan Online</span>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (formData.signatureDataUrl) setCurrentStep(3);
              }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-sky-50 text-sky-900 border border-sky-300 font-extrabold'
                  : 'text-slate-500 hover:bg-slate-50 font-bold'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === 3 ? 'bg-[#1D3582] text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <span className="text-[11px] sm:text-xs">3. Surat &amp; Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* Validation Errors Alert Box */}
        {formErrors.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 text-rose-900 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-black text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Harap Lengkapi Kolom Wajib Berikut:</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 font-medium text-rose-700">
              {formErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: FORMULIR DATA CALON MITRA MANDIRI */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1D3582]" />
                  <span>Formulir Pengisian Data Mitra Mandiri</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Data ini akan dicantumkan secara resmi sebagai identitas <strong>PIHAK KEDUA</strong> pada Surat Perjanjian Kerjasama Kemitraan.
                </p>
              </div>

              {formData.namaLengkap && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              )}
            </div>

            <form onSubmit={handleValidateAndProceedToSign} className="space-y-6">
              {/* Field Group 1: Identitas Pribadi */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>A. Identitas Pribadi Sesuai KTP</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      placeholder="Contoh: Muhammad Farhan Pratama, S.Kom"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Nomor NIK / KTP (16 Digit) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="327501xxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Tempat &amp; Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tempatTanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tempatTanggalLahir: e.target.value })}
                      placeholder="Contoh: Bekasi, 14 Agustus 1996"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Kota / Kabupaten Domisili Saat Ini <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.kotaDomisili}
                      onChange={(e) => setFormData({ ...formData, kotaDomisili: e.target.value })}
                      placeholder="Contoh: Kota Bekasi / Jakarta Selatan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Alamat Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.alamatKtp}
                    onChange={(e) => setFormData({ ...formData, alamatKtp: e.target.value })}
                    placeholder="Jl. Melati No. 45 RT 02 RW 05, Kelurahan Jatiasih, Kecamatan Jatiasih, Kota Bekasi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Field Group 2: Kontak Aktif */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>B. Kontak Komunikasi Aktif</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.noHpWa}
                      onChange={(e) => setFormData({ ...formData, noHpWa: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      Digunakan untuk konfirmasi pencairan fee mingguan dan grup koordinasi kerja WFH.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Alamat Email Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="namaanda@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Field Group 3: Rekening Pembayaran Fee Mingguan */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>C. Rekening Bank Penerima Fee Mingguan (Wajib Atas Nama Pribadi)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Nama Bank <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.namaBank}
                      onChange={(e) => setFormData({ ...formData, namaBank: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    >
                      <option value="BCA">BCA (Bank Central Asia)</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                      <option value="BNI">BNI (Bank Negara Indonesia)</option>
                      <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                      <option value="CIMB Niaga">CIMB Niaga</option>
                      <option value="Bank Permata">Bank Permata</option>
                      <option value="Bank Jago">Bank Jago</option>
                      <option value="SeaBank">SeaBank</option>
                      <option value="Bank Danamon">Bank Danamon</option>
                      <option value="Lainnya">Bank Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Nomor Rekening Bank <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nomorRekening}
                      onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="Contoh: 1234567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Atas Nama Rekening <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.namaPemilikRekening}
                      onChange={(e) => setFormData({ ...formData, namaPemilikRekening: e.target.value })}
                      placeholder="Harus sesuai KTP Anda"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox Persetujuan Awal */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.setujuTarget}
                    onChange={(e) => setFormData({ ...formData, setujuTarget: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-amber-950 font-bold leading-relaxed">
                    Saya menyatakan data yang saya isi adalah benar dan sah. Saya telah membaca serta bersedia menyetujui sistem kerja <strong>Kemitraan Mandiri (Full WFH)</strong> dengan hak fee <strong>60% Mitra : 40% Principle</strong>, serta siap memenuhi target evaluasi omzet minimal <strong>Rp 10.000.000,- / bulan konsisten selama 3 bulan</strong> untuk kualifikasi evaluasi pengangkatan menjadi Karyawan Tetap (PKWTT).
                  </span>
                </label>
              </div>

              {/* Submit to Step 2 */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1D3582] hover:bg-[#162968] active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Tanda Tangan &amp; Perjanjian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: DIGITAL SIGNATURE PAD (CANVAS) */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-[#1D3582]" />
                  <span>Bubuhkan Tanda Tangan Digital Anda</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tanda tangan online ini akan dicantumkan secara otomatis pada Surat Perjanjian Kerjasama atas nama <strong>{formData.namaLengkap}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ubah Data Formulir</span>
              </button>
            </div>

            {/* Signature Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Goreskan tanda tangan menggunakan layar sentuh HP / Mouse PC:
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasDrawn ? '✅ Tanda Tangan Siap' : 'Tanda Tangan Belum Diisi'}
                </span>
              </div>

              <div className="relative border-2 border-dashed border-sky-300 rounded-3xl p-2 bg-slate-50/60 overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-56 sm:h-64 bg-white rounded-2xl cursor-crosshair touch-none"
                />

                {/* Guide watermark in background */}
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs sm:text-sm font-bold tracking-wide select-none">
                    [ Bubuhkan Tanda Tangan di Sini ]
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bersihkan Tanda Tangan (Clear)</span>
                </button>

                <button
                  type="button"
                  disabled={!hasDrawn}
                  onClick={handleApplySignatureAndProceedToAgreement}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Terapkan Tanda Tangan &amp; Buat Surat Perjanjian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: DYNAMIC AGREEMENT VIEWER & EXPORT PDF */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Action Bar for PDF & Print */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Surat Perjanjian Resmi Siap Diunduh</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Perjanjian Kemitraan: {formData.namaLengkap}
                </h3>
                <p className="text-xs text-slate-500">
                  Nomor Surat: <span className="font-mono font-bold text-slate-700">{formData.nomorSurat}</span> &bull; Tanggal: {formData.tanggalPerjanjian}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ubah TTD</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintDocument}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>

                <button
                  type="button"
                  disabled={isExportingPdf}
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Merender PDF...' : 'Download Surat Perjanjian (PDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Konfirmasi & Kirim Bukti ke WhatsApp Admin"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </div>

            {pdfSuccessNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pdfSuccessNotice}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* SURAT PERJANJIAN INTERAKTIF DENGAN SCROLL-DOWN VIEWER */}
            {/* ========================================================= */}
            <div className="bg-slate-200/80 p-3 sm:p-6 rounded-3xl border border-slate-300">
              <div className="text-xs font-bold text-slate-500 text-center pb-2 flex items-center justify-center gap-1.5">
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                <span>Gulir ke bawah untuk meninjau seluruh klausul perjanjian resmi (Legal Terms)</span>
              </div>

              {/* Scrollable Container */}
              <div className="max-h-[680px] overflow-y-auto rounded-2xl shadow-xl bg-white p-6 sm:p-12 border border-slate-200 space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed custom-scrollbar print:overflow-visible print:max-h-none print:shadow-none print:border-none print:p-0">
                {/* The actual printable agreement container */}
                <div ref={agreementContainerRef} className="space-y-6 font-sans">
                  {/* Official Header Letterhead */}
                  <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                    <div className="text-xs uppercase tracking-widest text-[#1D3582] font-black">
                      PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                    </div>
                    <h2 className="text-base sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                      SURAT PERJANJIAN KERJASAMA KEMITRAAN MANDIRI (NON-PKWT)
                    </h2>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Nomor: {formData.nomorSurat}
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">
                      PT INOVASI TEKNOLOGI DIGITAL INDONESIA, jl pangkalan 6 raya no 16 rt 003 rw 004  ,ciketing udik Bekasi 17153
                    </div>
                  </div>

                  {/* Pembuka */}
                  <p className="text-justify indent-6">
                    Pada hari ini, tanggal <strong>{formData.tanggalPerjanjian}</strong>, telah dibuat dan disepakati bersama Perjanjian Kerjasama Kemitraan Mandiri (selanjutnya disebut sebagai <em>"Perjanjian"</em>), oleh dan antara pihak-pihak di bawah ini:
                  </p>

                  {/* PIHAK PERTAMA */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-black text-slate-900 text-xs uppercase text-[#1D3582]">
                      I. PIHAK PERTAMA (PRINCIPLE / PERUSAHAAN):
                    </div>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-36 font-bold text-slate-600 py-0.5">Nama Lengkap</td>
                          <td className="w-3">:</td>
                          <td className="font-bold text-slate-900">Aries M Hardjasasmita,S,kom</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Jabatan</td>
                          <td>:</td>
                          <td>Principle</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Badan Usaha</td>
                          <td>:</td>
                          <td className="font-bold">PT INOVASI TEKNOLOGI DIGITAL INDONESIA</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Alamat Kantor</td>
                          <td>:</td>
                          <td>PT INOVASI TEKNOLOGI DIGITAL INDONESIA, jl pangkalan 6 raya no 16 rt 003 rw 004  ,ciketing udik Bekasi 17153</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Dalam hal ini bertindak untuk dan atas nama <strong>PT INOVASI TEKNOLOGI DIGITAL INDONESIA</strong>, yang selanjutnya disebut sebagai <strong>"PIHAK PERTAMA"</strong>.
                    </p>
                  </div>

                  {/* PIHAK KEDUA */}
                  <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200 space-y-1.5">
                    <div className="font-black text-sky-950 text-xs uppercase">
                      II. PIHAK KEDUA (MITRA MANDIRI):
                    </div>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-36 font-bold text-slate-600 py-0.5">Nama Lengkap</td>
                          <td className="w-3">:</td>
                          <td className="font-black text-slate-950">{formData.namaLengkap}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Nomor NIK / KTP</td>
                          <td>:</td>
                          <td className="font-mono font-bold text-slate-900">{formData.nik}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Tempat &amp; Tgl Lahir</td>
                          <td>:</td>
                          <td>{formData.tempatTanggalLahir}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Alamat KTP</td>
                          <td>:</td>
                          <td>{formData.alamatKtp}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Kota Domisili</td>
                          <td>:</td>
                          <td>{formData.kotaDomisili}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">No. WhatsApp / HP</td>
                          <td>:</td>
                          <td className="font-mono font-bold">{formData.noHpWa}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Email Aktif</td>
                          <td>:</td>
                          <td>{formData.email}</td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-600 py-0.5">Rekening Bank</td>
                          <td>:</td>
                          <td className="font-bold text-sky-900">
                            Bank {formData.namaBank} - No. {formData.nomorRekening} (a.n. {formData.namaPemilikRekening})
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Dalam hal ini bertindak atas nama pribadi sebagai Mitra Mandiri, yang selanjutnya disebut sebagai <strong>"PIHAK KEDUA"</strong>.
                    </p>
                  </div>

                  <p className="text-justify indent-6">
                    PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut sebagai <strong>"PARA PIHAK"</strong>, dan masing-masing disebut sebagai <strong>"PIHAK"</strong>. PARA PIHAK sepakat untuk saling mengikatkan diri dalam Perjanjian Kerjasama Kemitraan Mandiri ini dengan syarat-syarat dan ketentuan-ketentuan sebagai berikut:
                  </p>

                  {/* PASAL 1 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 1<br />STATUS KEMITRAAN MANDIRI (NON-PKWT)
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        Hubungan kerjasama antara PIHAK PERTAMA dan PIHAK KEDUA adalah murni hubungan <strong>Kemitraan Mandiri (*Independent Partnership Agreement*)</strong> berdasarkan pencapaian kinerja, dan <strong>BUKAN</strong> merupakan Perjanjian Kerja Waktu Tertentu (PKWT) maupun hubungan majikan-buruh sebagaimana diatur dalam undang-undang ketenagakerjaan konvensional.
                      </li>
                      <li>
                        PIHAK KEDUA memiliki otonomi dan kebebasan penuh dalam mengatur waktu, metode pemasaran, dan sarana kerja mandirinya tanpa terikat kewajiban jam kerja kantor fisik.
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 2 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 2<br />SISTEM KERJA &amp; FASILITAS WORK FROM HOME (WFH)
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        Kerjasama kemitraan ini dijalankan dengan skema <strong>Full Work From Home (WFH)</strong> secara mandiri dan online.
                      </li>
                      <li>
                        PIHAK PERTAMA memberikan akses sistem katalog digital, landing page promosi, materi copywriting, dan panduan edukasi bisnis kepada PIHAK KEDUA untuk menunjang aktivitas kemitraan.
                      </li>
                      <li>
                        PIHAK KEDUA bertanggung jawab menyediakan perangkat penunjang pribadi (seperti smartphone, komputer/laptop, dan koneksi internet stabil) secara mandiri.
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 3 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 3<br />HAK MITRA &amp; PEMBAGIAN FEE SHARING (60% : 40%)
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        Atas setiap transaksi penjualan layanan atau landing page yang berhasil direalisasikan melalui rujukan/pemasaran PIHAK KEDUA, PIHAK KEDUA berhak menerima fee sharing sebesar <strong>60% (enam puluh persen)</strong> dari nilai margin bersih transaksi.
                      </li>
                      <li>
                        PIHAK PERTAMA menerima bagian sebesar <strong>40% (empat puluh persen)</strong> yang dialokasikan untuk biaya infrastruktur teknologi, lisensi server cloud, domain, pemeliharaan sistem, dan perizinan badan usaha.
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 4 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 4<br />MEKANISME PENCAIRAN FEE SECARA MINGGUAN
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        Pencairan fee komisi PIHAK KEDUA dihitung secara transparan dan ditransfer secara berkala <strong>setiap mingguan (weekly settlement)</strong>.
                      </li>
                      <li>
                        Fee ditransfer langsung ke rekening bank resmi atas nama PIHAK KEDUA yaitu <strong>Bank {formData.namaBank} No. Rekening {formData.nomorRekening} a.n. {formData.namaPemilikRekening}</strong>.
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 5 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 5<br />TARGET MASA EVALUASI KEMITRAAN
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        PIHAK KEDUA menyetujui target evaluasi kinerja kemitraan berupa pencapaian omzet penjualan minimal sebesar <strong>Rp 10.000.000,- (sepuluh juta rupiah)</strong> per bulan.
                      </li>
                      <li>
                        Masa evaluasi kinerja awal berlaku selama <strong>3 (tiga) bulan berturut-turut</strong> terhitung sejak tanggal penandatanganan Perjanjian ini.
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 6 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 6<br />PELUANG KENAIKAN STATUS MENJADI KARYAWAN TETAP (PKWTT)
                    </h4>
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-justify">
                      <li>
                        Apabila PIHAK KEDUA berhasil mencapai target evaluasi omzet minimal Rp 10.000.000,- per bulan secara konsisten selama 3 (tiga) bulan berturut-turut serta menunjukkan loyalitas dan etika bisnis yang baik, PIHAK KEDUA berhak mendapatkan <strong>jalur prioritas evaluasi untuk diangkat menjadi Karyawan Tetap (PKWTT)</strong> PT INOVASI TEKNOLOGI DIGITAL INDONESIA.
                      </li>
                      <li>
                        Setelah resmi diangkat menjadi Karyawan Tetap (PKWTT), PIHAK KEDUA berhak atas:
                        <ul className="list-disc pl-5 mt-1 space-y-0.5">
                          <li><strong>Gaji Pokok Tetap</strong> berkisar antara <strong>Rp 3.000.000,- s.d. Rp 5.800.000,- per bulan</strong> (disesuaikan dengan jenjang performa dan sertifikasi kompetensi).</li>
                          <li>Tunjangan operasional, jaminan kesehatan/ketenagakerjaan sesuai ketentuan korporasi.</li>
                          <li>Tetap berhak mendapatkan bonus insentif produktivitas atas pencapaian di atas target standar.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  {/* PASAL 7 & 8 */}
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 7<br />KERAHASIAAN DATA &amp; ETIKA BISNIS (NDA)
                    </h4>
                    <p className="text-justify indent-6">
                      PARA PIHAK wajib menjaga kerahasiaan seluruh informasi bisnis, database klien, strategi promosi, dan kode program milik PT INOVASI TEKNOLOGI DIGITAL INDONESIA, baik selama berlakunya Perjanjian ini maupun setelah berakhirnya kerjasama.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm text-center">
                      PASAL 8<br />PENYELESAIAN PERSELISIHAN &amp; PENUTUP
                    </h4>
                    <p className="text-justify indent-6">
                      Demikian Perjanjian ini dibuat dalam keadaan sadar tanpa paksaan dari pihak mana pun, dan ditandatangani secara digital dengan kekuatan pembuktian hukum yang sah sesuai Undang-Undang Informasi dan Transaksi Elektronik (UU ITE) Republik Indonesia.
                    </p>
                  </div>

                  {/* TANDA TANGAN DUA PIHAK */}
                  <div className="pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      {/* Pihak Pertama */}
                      <div className="space-y-3">
                        <div className="font-bold text-xs text-slate-600">
                          PIHAK PERTAMA<br />
                          <span className="font-extrabold text-slate-900">PT INOVASI TEKNOLOGI DIGITAL INDONESIA</span>
                        </div>

                        {/* Stempel Digital & TTD Digital Principle */}
                        <div className="relative h-28 flex items-center justify-center">
                          {/* Stempel Bulat Digital */}
                          <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-blue-600/60 flex flex-col items-center justify-center text-[8px] font-black text-blue-700 tracking-tighter uppercase rotate-[-12deg] pointer-events-none opacity-80 left-1/2 -translate-x-1/2">
                            <span>PT INOVASI TEKNOLOGI</span>
                            <span className="text-[10px] font-black text-red-600">★ RESMI ★</span>
                            <span>DIGITAL INDONESIA</span>
                          </div>

                          {/* Tanda Tangan Digital Pihak Pertama (Aries M Hardjasasmita,S,kom) */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140" width="180" height="80" className="relative z-10 drop-shadow-xs">
                            <path d="M 35 105 C 40 75, 55 25, 75 22 C 90 20, 95 65, 80 115 M 50 78 Q 75 72, 105 76 C 118 78, 128 62, 132 85 C 136 100, 142 68, 150 82 C 156 94, 162 70, 172 80 C 182 90, 192 65, 202 78 C 215 95, 235 60, 245 108 Q 220 118, 140 114 C 70 110, 45 116, 120 102 Q 220 85, 295 90" fill="none" stroke="#0f2b5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="282" cy="74" r="2.5" fill="#0f2b5c" />
                          </svg>
                        </div>

                        <div className="border-t border-slate-400 pt-1.5 inline-block min-w-[180px]">
                          <div className="font-black text-xs text-slate-950">Aries M Hardjasasmita,S,kom</div>
                          <div className="text-[10px] text-slate-500">Principle</div>
                        </div>
                      </div>

                      {/* Pihak Kedua */}
                      <div className="space-y-3">
                        <div className="font-bold text-xs text-slate-600">
                          PIHAK KEDUA<br />
                          <span className="font-extrabold text-slate-900">MITRA MANDIRI</span>
                        </div>

                        {/* TTD Mitra dari Canvas */}
                        <div className="h-28 flex items-center justify-center">
                          {formData.signatureDataUrl ? (
                            <img
                              src={formData.signatureDataUrl}
                              alt="Tanda Tangan Digital Mitra"
                              className="max-h-24 max-w-[180px] object-contain drop-shadow-xs"
                            />
                          ) : (
                            <span className="text-slate-300 text-xs italic">[Belum Bertanda Tangan]</span>
                          )}
                        </div>

                        <div className="border-t border-slate-400 pt-1.5 inline-block min-w-[180px]">
                          <div className="font-black text-xs text-slate-950">{formData.namaLengkap}</div>
                          <div className="text-[10px] text-slate-500">NIK: {formData.nik}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footnote Barcode / Hash verification */}
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Dokumen Digital Resmi &bull; UU ITE No. 11/2008 Ps. 5</span>
                    <span>Kode Hash: {btoa(formData.nomorSurat + formData.nik).slice(0, 16)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions banner */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-black text-sm sm:text-base">
                  Langkah Terakhir: Simpan PDF &amp; Konfirmasi ke WhatsApp Admin
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Unduh salinan PDF surat perjanjian di atas untuk arsip pribadi Anda. Selanjutnya, kirimkan konfirmasi aktivasi ke WhatsApp Admin agar tim verifikasi segera mendaftarkan nomor rekening dan akun kemitraan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={isExportingPdf}
                  onClick={handleDownloadPdf}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Mengekspor PDF...' : 'Unduh Surat Perjanjian (PDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Konfirmasi ke WhatsApp Admin ({ADMIN_WA_NUMBER})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
