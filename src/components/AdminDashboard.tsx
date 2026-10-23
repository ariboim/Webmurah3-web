import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Youtube,
  FolderOpen,
  TrendingUp,
  Clock,
  Calendar,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  Article,
  getAllArticles,
  getCustomArticlesOnly,
  saveArticle,
  deleteArticle,
  resetArticlesToDefault,
  getAdminCredentials,
  verifyAdminLogin,
  updateAdminCredentials,
  isAdminLoggedIn,
  setAdminSession,
} from '../utils/articleStorage';
import {
  convertGoogleDriveImageUrl,
  convertGoogleDriveVideoUrl,
  convertYouTubeEmbedUrl,
  detectVideoSource,
  readFileAsDataUrl,
  extractGoogleDriveId,
  extractYouTubeId,
} from '../utils/mediaUtils';
import { IndoDigitalLogo } from './IndoDigitalLogo';

interface AdminDashboardProps {
  onNavigateToPublicArticles: () => void;
  onNavigateToHome: () => void;
}

type AdminTab = 'create' | 'list' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToPublicArticles,
  onNavigateToHome,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminLoggedIn);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('');

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<AdminTab>('create');

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form State for Article Input
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('Tips Bisnis & Marketing');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formReadTime, setFormReadTime] = useState('4 Menit Baca');
  const [formSourceName, setFormSourceName] = useState('Admin Indo Digital');
  const [formKeyStat, setFormKeyStat] = useState('+350%');
  const [formKeyStatLabel, setFormKeyStatLabel] = useState('Kenaikan Pesanan');
  const [formSummary, setFormSummary] = useState('');

  // Media: Image
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'drive' | 'url'>('upload');
  const [imageFilePreview, setImageFilePreview] = useState<string>('');
  const [imageDriveUrl, setImageDriveUrl] = useState('');
  const [imageDirectUrl, setImageDirectUrl] = useState('');
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media: Video
  const [videoInputMode, setVideoInputMode] = useState<'none' | 'youtube' | 'drive'>('none');
  const [videoRawUrl, setVideoRawUrl] = useState('');
  const [finalVideoEmbedUrl, setFinalVideoEmbedUrl] = useState<string>('');
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'drive' | 'direct' | 'none'>('none');

  // Content mode: simple (body text) vs structured
  const [contentMode, setContentMode] = useState<'simple' | 'structured'>('simple');
  const [formBodyText, setFormBodyText] = useState('');
  const [formBackground, setFormBackground] = useState('');
  const [formChallenge, setFormChallenge] = useState('');
  const [formStrategies, setFormStrategies] = useState<string>('');
  const [formResult, setFormResult] = useState('');
  const [formTakeaway, setFormTakeaway] = useState('');

  // Notifications
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Settings State: Change Username & Password
  const [currentAdminUser, setCurrentAdminUser] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsNotice, setSettingsNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load articles on mount & sync admin username
  useEffect(() => {
    refreshArticles();
    const creds = getAdminCredentials();
    setCurrentAdminUser(creds.username);
  }, [isAuthenticated]);

  const refreshArticles = () => {
    setArticles(getAllArticles());
  };

  // Sync Final Image URL based on chosen mode
  useEffect(() => {
    if (imageInputMode === 'upload') {
      setFinalImageUrl(imageFilePreview);
    } else if (imageInputMode === 'drive') {
      setFinalImageUrl(convertGoogleDriveImageUrl(imageDriveUrl));
    } else if (imageInputMode === 'url') {
      setFinalImageUrl(imageDirectUrl.trim());
    }
  }, [imageInputMode, imageFilePreview, imageDriveUrl, imageDirectUrl]);

  // Sync Final Video Embed URL
  useEffect(() => {
    if (videoInputMode === 'none' || !videoRawUrl.trim()) {
      setFinalVideoEmbedUrl('');
      setVideoSourceType('none');
      return;
    }

    const detected = detectVideoSource(videoRawUrl);
    setVideoSourceType(detected);

    if (detected === 'youtube') {
      const embed = convertYouTubeEmbedUrl(videoRawUrl);
      setFinalVideoEmbedUrl(embed || '');
    } else if (detected === 'drive') {
      const embed = convertGoogleDriveVideoUrl(videoRawUrl);
      setFinalVideoEmbedUrl(embed || '');
    } else {
      setFinalVideoEmbedUrl(videoRawUrl.trim());
    }
  }, [videoInputMode, videoRawUrl]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Harap isi username dan password admin.');
      return;
    }

    const isValid = verifyAdminLogin(loginUsername, loginPassword);
    if (isValid) {
      setAdminSession(true, true);
      setIsAuthenticated(true);
      setLoginSuccessNotice('Login berhasil!');
      const creds = getAdminCredentials();
      setCurrentAdminUser(creds.username);
    } else {
      setLoginError('Username atau password yang Anda masukkan salah.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Handle File Upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageFilePreview(dataUrl);
      setFormErrorMessage('');
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Gagal mengupload gambar.');
    }
  };

  // Clear Form
  const resetForm = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('Tips Bisnis & Marketing');
    setFormCustomCategory('');
    setFormReadTime('4 Menit Baca');
    setFormSourceName('Admin Indo Digital');
    setFormKeyStat('+350%');
    setFormKeyStatLabel('Kenaikan Pesanan');
    setFormSummary('');
    setImageFilePreview('');
    setImageDriveUrl('');
    setImageDirectUrl('');
    setFinalImageUrl('');
    setVideoInputMode('none');
    setVideoRawUrl('');
    setFinalVideoEmbedUrl('');
    setFormBodyText('');
    setFormBackground('');
    setFormChallenge('');
    setFormStrategies('');
    setFormResult('');
    setFormTakeaway('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Populate form for editing
  const handleStartEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormSubtitle(article.subtitle || '');
    setFormCategory(article.category);
    setFormReadTime(article.readTime || '4 Menit Baca');
    setFormSourceName(article.sourceName || 'Admin Indo Digital');
    setFormKeyStat(article.keyStat || '+100%');
    setFormKeyStatLabel(article.keyStatLabel || 'Pertumbuhan');
    setFormSummary(article.summary || '');

    // Image
    if (article.imageUrl) {
      if (article.imageUrl.startsWith('data:')) {
        setImageInputMode('upload');
        setImageFilePreview(article.imageUrl);
      } else if (article.imageUrl.includes('drive.google.com') || article.imageUrl.includes('googleusercontent.com')) {
        setImageInputMode('drive');
        setImageDriveUrl(article.imageUrl);
      } else {
        setImageInputMode('url');
        setImageDirectUrl(article.imageUrl);
      }
      setFinalImageUrl(article.imageUrl);
    }

    // Video
    if (article.videoUrl) {
      setVideoRawUrl(article.videoUrl);
      if (article.videoType === 'youtube' || article.videoUrl.includes('youtube')) {
        setVideoInputMode('youtube');
      } else if (article.videoType === 'drive' || article.videoUrl.includes('drive')) {
        setVideoInputMode('drive');
      }
    } else {
      setVideoInputMode('none');
      setVideoRawUrl('');
    }

    // Content
    if (article.content.bodyText) {
      setContentMode('simple');
      setFormBodyText(article.content.bodyText);
    } else {
      setContentMode('structured');
      setFormBackground(article.content.background || '');
      setFormChallenge(article.content.challenge || '');
      setFormStrategies((article.content.strategy || []).join('\n'));
      setFormResult(article.content.result || '');
      setFormTakeaway(article.content.takeaway || '');
    }

    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Article (Create or Edit)
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!formTitle.trim()) {
      setFormErrorMessage('Judul artikel wajib diisi.');
      return;
    }
    if (!formSummary.trim()) {
      setFormErrorMessage('Ringkasan singkat wajib diisi.');
      return;
    }

    const selectedCategory =
      formCategory === 'Lainnya' && formCustomCategory.trim()
        ? formCustomCategory.trim()
        : formCategory;

    // Determine category badge style
    let categoryColor = 'bg-sky-50 text-sky-800 border-sky-200';
    if (selectedCategory.includes('Kuliner')) {
      categoryColor = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (selectedCategory.includes('Kreatif') || selectedCategory.includes('Jasa')) {
      categoryColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (selectedCategory.includes('Riset') || selectedCategory.includes('Data')) {
      categoryColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    } else if (selectedCategory.includes('Fashion')) {
      categoryColor = 'bg-rose-50 text-rose-800 border-rose-200';
    }

    // Prepare strategies array if in structured mode
    const strategyArray = formStrategies
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const generatedId =
      editingArticleId ||
      'art-' +
        formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 40) +
        '-' +
        Date.now().toString().slice(-4);

    const newArticle: Article = {
      id: generatedId,
      category: selectedCategory,
      categoryColor,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || formTitle.trim(),
      readTime: formReadTime.trim() || '4 Menit Baca',
      date: new Date().getFullYear().toString(),
      sourceName: formSourceName.trim() || 'Admin Indo Digital',
      sourceUrl: '#',
      keyStat: formKeyStat.trim() || '+100%',
      keyStatLabel: formKeyStatLabel.trim() || 'Kenaikan Bisnis',
      summary: formSummary.trim(),
      imageUrl: finalImageUrl || undefined,
      videoUrl: videoRawUrl.trim() || undefined,
      videoType: videoInputMode !== 'none' ? videoSourceType : undefined,
      content: {
        bodyText: contentMode === 'simple' ? formBodyText.trim() : undefined,
        background: formBackground.trim() || undefined,
        challenge: formChallenge.trim() || undefined,
        strategy: strategyArray.length > 0 ? strategyArray : undefined,
        result: formResult.trim() || undefined,
        takeaway: formTakeaway.trim() || undefined,
      },
      isCustom: true,
      createdAt: Date.now(),
    };

    const saved = saveArticle(newArticle);
    if (saved) {
      setFormSuccessMessage(
        editingArticleId
          ? 'Artikel berhasil diperbarui dan langsung tayang di Navtab Artikel!'
          : 'Artikel baru berhasil diterbitkan dan otomatis muncul di Navtab Artikel!'
      );
      refreshArticles();
      if (!editingArticleId) {
        resetForm();
      }
    } else {
      setFormErrorMessage('Gagal menyimpan artikel ke penyimpanan browser.');
    }
  };

  // Handle Delete Article
  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) {
      deleteArticle(id);
      refreshArticles();
      if (editingArticleId === id) {
        resetForm();
      }
    }
  };

  // Handle Reset Articles
  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset daftar artikel ke default bawaan? Semua artikel buatan admin akan dihapus.'
      )
    ) {
      resetArticlesToDefault();
      refreshArticles();
      resetForm();
    }
  };

  // Handle Update Admin Credentials
  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsNotice(null);

    const creds = getAdminCredentials();
    if (oldPassword.trim() !== creds.password.trim()) {
      setSettingsNotice({ type: 'error', text: 'Password lama salah. Verifikasi gagal.' });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setSettingsNotice({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    const res = updateAdminCredentials(newUsername || creds.username, newPassword);
    if (res.success) {
      setSettingsNotice({ type: 'success', text: res.message });
      setCurrentAdminUser(newUsername.trim() || creds.username);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSettingsNotice({ type: 'error', text: res.message });
    }
  };

  // -------------------------------------------------------------
  // VIEW: IF NOT AUTHENTICATED -> SHOW SECURE LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <button
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Website</span>
            </button>
            <div className="flex justify-center pt-2">
              <IndoDigitalLogo size="lg" variant="full" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Portal Admin & Kelola Konten
            </h1>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Masuk untuk input blog, artikel inspirasi UMKM, dan upload media gambar/video.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Autentikasi Admin</h2>
                <p className="text-[11px] text-slate-500">Akses terbatas hanya untuk pengelola web</p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1D3582] hover:bg-[#162968] active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGGED IN ADMIN DASHBOARD
  // -------------------------------------------------------------
  const customCount = articles.filter((a) => a.isCustom).length;
  const defaultCount = articles.filter((a) => !a.isCustom).length;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-20">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToHome}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Webkilat</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Admin Panel • Kelola Blog &amp; Artikel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Link to User-facing Articles tab */}
            <button
              onClick={onNavigateToPublicArticles}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Buka Navtab Artikel Publik"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Tab Artikel</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subheader & Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Dashboard Pengelola Konten
            </h1>
            <p className="text-xs text-slate-500">
              Login aktif sebagai: <strong className="text-sky-700">{currentAdminUser}</strong> • Total {articles.length} artikel ({customCount} diterbitkan oleh admin)
            </p>
          </div>

          {/* 3 Main Admin Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('create');
                setFormSuccessMessage('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'create'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{editingArticleId ? 'Edit Artikel' : 'Input Artikel Baru'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('list');
                setFormSuccessMessage('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'list'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Daftar Artikel ({articles.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setFormSuccessMessage('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ganti Akun Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* TAB 1: FORM INPUT / EDIT ARTIKEL */}
        {/* ========================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {formSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">{formSuccessMessage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateToPublicArticles}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Buka Tab Artikel</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {formErrorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-semibold">{formErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitArticle} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Article Meta & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Edit3 className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        {editingArticleId ? 'Ubah Artikel' : 'Data Pokok Artikel'}
                      </h2>
                    </div>
                    {editingArticleId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Batal Edit</span>
                      </button>
                    )}
                  </div>

                  {/* Judul Artikel */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Judul Artikel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Contoh: Strategi UMKM Frozen Food Tembus Omzet Puluhan Juta Berkat Landing Page"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-semibold"
                    />
                  </div>

                  {/* Subjudul */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Subjudul / Tagline Pendukung
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Contoh: Kisah nyata adaptasi digital dan integrasi pemesanan kilat via WhatsApp"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Kategori & Waktu Baca */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Kategori
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      >
                        <option value="Tips Bisnis & Marketing">Tips Bisnis &amp; Marketing</option>
                        <option value="Kuliner & Makanan Kemasan">Kuliner &amp; Makanan Kemasan</option>
                        <option value="Jasa & Produk Kreatif">Jasa &amp; Produk Kreatif</option>
                        <option value="Fashion & Retail">Fashion &amp; Retail</option>
                        <option value="Riset & Data Nasional">Riset &amp; Data Nasional</option>
                        <option value="Kisah Sukses UMKM">Kisah Sukses UMKM</option>
                        <option value="Lainnya">Lainnya (Ketik Sendiri)</option>
                      </select>
                      {formCategory === 'Lainnya' && (
                        <input
                          type="text"
                          value={formCustomCategory}
                          onChange={(e) => setFormCustomCategory(e.target.value)}
                          placeholder="Ketik kategori baru..."
                          className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Estimasi Waktu Baca
                      </label>
                      <input
                        type="text"
                        value={formReadTime}
                        onChange={(e) => setFormReadTime(e.target.value)}
                        placeholder="Contoh: 4 Menit Baca"
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Penulis & Key Stat */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Penulis / Sumber
                      </label>
                      <input
                        type="text"
                        value={formSourceName}
                        onChange={(e) => setFormSourceName(e.target.value)}
                        placeholder="Admin Indo Digital"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Highlight Angka (Stat)
                      </label>
                      <input
                        type="text"
                        value={formKeyStat}
                        onChange={(e) => setFormKeyStat(e.target.value)}
                        placeholder="+350%"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-sky-700 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Label Angka
                      </label>
                      <input
                        type="text"
                        value={formKeyStatLabel}
                        onChange={(e) => setFormKeyStatLabel(e.target.value)}
                        placeholder="Kenaikan Omzet"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Ringkasan Singkat (Summary for card) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Ringkasan Singkat (Muncul di Kartu Depan) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formSummary}
                      onChange={(e) => setFormSummary(e.target.value)}
                      placeholder="Tulis 2-3 kalimat menarik yang menggambarkan inti artikel agar pembaca tertarik membaca selengkapnya..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-normal"
                    />
                  </div>
                </div>

                {/* Article Full Content (Mode Switcher) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Isi Konten Artikel Lengkap
                      </h2>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setContentMode('simple')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          contentMode === 'simple'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Teks Bebas / Paragraf
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentMode('structured')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          contentMode === 'structured'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Format Studi Kasus
                      </button>
                    </div>
                  </div>

                  {contentMode === 'simple' ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Teks Lengkap Artikel (Gunakan Baris Baru untuk Memisahkan Paragraf)
                      </label>
                      <textarea
                        rows={10}
                        value={formBodyText}
                        onChange={(e) => setFormBodyText(e.target.value)}
                        placeholder="Tuliskan isi artikel Anda secara lengkap di sini. Anda dapat menuliskan beberapa paragraf untuk mengedukasi calon pembeli mengenai pentingnya landing page, tips jualan online, dan cara mengembangkan usaha..."
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-normal"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          1. Latar Belakang &amp; Profil Awal Usaha
                        </label>
                        <textarea
                          rows={2}
                          value={formBackground}
                          onChange={(e) => setFormBackground(e.target.value)}
                          placeholder="Bagaimana usaha ini dirintis dan kondisi sebelum punya landing page..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          2. Tantangan &amp; Kendala Usaha
                        </label>
                        <textarea
                          rows={2}
                          value={formChallenge}
                          onChange={(e) => setFormChallenge(e.target.value)}
                          placeholder="Kendala pembeli ragu, perang harga di marketplace, biaya admin tinggi..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          3. Strategi Digital (Tulis 1 Poin per Baris)
                        </label>
                        <textarea
                          rows={3}
                          value={formStrategies}
                          onChange={(e) => setFormStrategies(e.target.value)}
                          placeholder="Membuat landing page resmi promo Rp 499rb&#10;Menghubungkan tombol pesan WhatsApp langsung&#10;Menampilkan testimoni pelanggan asli"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          4. Hasil Nyata yang Dicapai
                        </label>
                        <textarea
                          rows={2}
                          value={formResult}
                          onChange={(e) => setFormResult(e.target.value)}
                          placeholder="Omzet melonjak 300% dalam waktu 6 bulan dan pesanan datang rutin..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          5. Kesimpulan / Pesan Utama untuk Pembaca
                        </label>
                        <textarea
                          rows={2}
                          value={formTakeaway}
                          onChange={(e) => setFormTakeaway(e.target.value)}
                          placeholder="Pesan moral penting bagi UMKM lainnya agar segera bertransformasi..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Media (Image & Video) & Live Preview */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. MEDIA GAMBAR (Photo / Illustration) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Upload Gambar / Foto Artikel
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Dukung dengan gambar menarik untuk sampul
                      </p>
                    </div>
                  </div>

                  {/* Mode Selector Gambar */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'upload'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('drive')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'drive'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Google Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'url'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Link Web (URL)
                    </button>
                  </div>

                  {/* Option A: Direct File Upload */}
                  {imageInputMode === 'upload' && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="article-image-upload"
                      />
                      <label
                        htmlFor="article-image-upload"
                        className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-sky-50/40 hover:bg-sky-50 transition-all text-center"
                      >
                        <Upload className="w-6 h-6 text-sky-600" />
                        <span className="text-xs font-bold text-sky-900">
                          Pilih Gambar dari Perangkat (HP/Laptop)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Format JPG, PNG, WEBP (Maksimal 4MB)
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Option B: Google Drive Link */}
                  {imageInputMode === 'drive' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Tempel Link Gambar dari Google Drive:
                      </label>
                      <input
                        type="url"
                        value={imageDriveUrl}
                        onChange={(e) => setImageDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                      <div className="p-2 rounded-lg bg-blue-50 text-[10px] text-blue-800 leading-snug">
                        💡 <strong>Tips:</strong> Pastikan setelan berbagi di Google Drive adalah <em>"Siapa saja yang memiliki link / Anyone with link"</em>. Sistem otomatis mengonversi ke tautan gambar langsung.
                      </div>
                    </div>
                  )}

                  {/* Option C: Direct Image URL */}
                  {imageInputMode === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Tempel Link Gambar (URL):
                      </label>
                      <input
                        type="url"
                        value={imageDirectUrl}
                        onChange={(e) => setImageDirectUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau domain Anda"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Image Live Preview */}
                  {finalImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                      <img
                        src={finalImageUrl}
                        alt="Preview Gambar Artikel"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="p-2 bg-white flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Gambar Siap
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFilePreview('');
                            setImageDriveUrl('');
                            setImageDirectUrl('');
                            setFinalImageUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MEDIA VIDEO (YouTube or Google Drive) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <VideoIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Sematkan Video (Opsional)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Link YouTube atau Google Drive Video
                      </p>
                    </div>
                  </div>

                  {/* Video Type Selector */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoInputMode('none');
                        setVideoRawUrl('');
                      }}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        videoInputMode === 'none'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tanpa Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('youtube')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                        videoInputMode === 'youtube'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-600" />
                      <span>YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('drive')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                        videoInputMode === 'drive'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Drive Video</span>
                    </button>
                  </div>

                  {/* Video Input Box */}
                  {videoInputMode !== 'none' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        {videoInputMode === 'youtube'
                          ? 'Tempel Link Video YouTube (Watch/Shorts/Share):'
                          : 'Tempel Link Video Google Drive:'}
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={videoRawUrl}
                          onChange={(e) => setVideoRawUrl(e.target.value)}
                          placeholder={
                            videoInputMode === 'youtube'
                              ? 'https://www.youtube.com/watch?v=... atau https://youtu.be/...'
                              : 'https://drive.google.com/file/d/.../view'
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Video Player Preview */}
                      {finalVideoEmbedUrl && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Preview Player Video:
                          </span>
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300 bg-black">
                            <iframe
                              src={finalVideoEmbedUrl}
                              title="Preview Video Player"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Action Submission Box */}
                <div className="bg-gradient-to-br from-[#1D3582] to-sky-900 rounded-3xl p-6 text-white space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <h3 className="font-extrabold text-sm">
                      {editingArticleId ? 'Perbarui Artikel' : 'Publikasikan ke Website'}
                    </h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Artikel akan otomatis tersimpan dan langsung muncul di Navtab Artikel (bagian atas) untuk dibaca semua pengunjung website.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-yellow-300 active:scale-98 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {editingArticleId ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel Sekarang'}
                    </span>
                  </button>

                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Batal / Buat Artikel Baru
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DAFTAR & KELOLA SEMUA ARTIKEL */}
        {/* ========================================================= */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Daftar Semua Artikel ({articles.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kelola artikel buatan admin atau lihat artikel bawaan sistem
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tulis Artikel Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Reset semua artikel ke bawaan"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Bawaan</span>
                  </button>
                </div>
              </div>

              {/* Table or Cards of Articles */}
              <div className="space-y-3">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      article.isCustom
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      {/* Thumbnail */}
                      <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                            <BookOpen className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Text info */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${article.categoryColor}`}
                          >
                            {article.category}
                          </span>
                          {article.isCustom ? (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              Diterbitkan Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                              Artikel Bawaan
                            </span>
                          )}
                          {article.videoUrl && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <VideoIcon className="w-2.5 h-2.5" />
                              Ada Video
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleStartEdit(article)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Edit Artikel"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {article.isCustom && (
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.title)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PENGATURAN AKUN (GANTI USERNAME & PASSWORD) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Pengaturan Akun &amp; Kredensial Admin
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ubah username dan password agar hanya Anda yang dapat mengakses panel ini
                  </p>
                </div>
              </div>

              {settingsNotice && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-bold ${
                    settingsNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {settingsNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{settingsNotice.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateCreds} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Username Saat Ini
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentAdminUser}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-800">
                    Username Baru (Bisa Disesuaikan)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Contoh: pemilik_web atau nama Anda"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    Kosongkan jika hanya ingin mengubah password saja.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Password Lama (Verifikasi) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan password saat ini (default: admin123)"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (minimal 4 karakter)"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Konfirmasi Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru Anda"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Akun</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
