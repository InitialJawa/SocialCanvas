import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Crown,
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Video, 
  Award, 
  Check, 
  Monitor, 
  Sliders, 
  Image as ImageIcon,
  Heart,
  HelpCircle,
  MessageCircle,
  ArrowUpRight,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { TikTokColoredIcon, InstagramColoredIcon, YouTubeColoredIcon, TwitterColoredIcon, KickColoredIcon } from './icons';
import { CapybaraLogo } from './CapybaraLogo';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onStartEditor: (platform?: any) => void;
  onUpgradeClick: () => void;
  isPremium: boolean;
  onLoginClick: () => void;
  currentUser: { name: string; avatar: string } | null;
  currentPath: string;
  onNavigate: (path: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

export function LandingPage({ 
  onStartEditor, 
  onUpgradeClick, 
  isPremium, 
  onLoginClick, 
  currentUser,
  currentPath,
  onNavigate,
  theme,
  onThemeChange
}: Props) {
  const { language, setLanguage, t } = useLanguage();

  const stats = [
    { value: '10K+', label: t('landing.stats.ugc') },
    { value: '24/7', label: t('landing.stats.ready') },
    { value: '100%', label: t('landing.stats.realistic') },
    { value: 'Rp 0', label: t('landing.stats.free') },
  ];

  const features = [
    {
      title: language === 'id' ? '5 Platform Terpopuler' : '5 Most Popular Platforms',
      desc: language === 'id' 
        ? 'Satu-satunya generator screenshot komentar terlengkap di Indonesia untuk TikTok, Instagram, Twitter/X, YouTube, dan Kick Live Stream.'
        : 'The only comprehensive comment screenshot generator in Indonesia supporting TikTok, Instagram, Twitter/X, YouTube, and Kick Live Stream.',
      icon: <Monitor className="w-5 h-5 text-[var(--accent)]" />
    },
    {
      title: language === 'id' ? 'Kustomisasi Tanpa Batas' : 'Unlimited Customization',
      desc: language === 'id'
        ? 'Atur foto profil, nama pengguna, lencana verifikasi biru, jumlah suka, teks komentar, durasi waktu, hingga warna gelembung balasan komentar.'
        : 'Set profile picture, username, blue verified badge, number of likes, comment text, time duration, and reply bubble color.',
      icon: <Sliders className="w-5 h-5 text-[var(--accent)]" />
    },
    {
      title: language === 'id' ? 'Kualitas Retina Ultra HD' : 'Retina Ultra HD Quality',
      desc: language === 'id'
        ? 'Unduh hasil gambar dengan penskalaan resolusi super tajam (sampai 4x) untuk menjamin screenshot tidak pecah di layar HP manapun.'
        : 'Download image results with super sharp resolution scaling (up to 4x) to guarantee screenshots do not break on any phone screen.',
      icon: <Award className="w-5 h-5 text-yellow-400" />
    },
    {
      title: language === 'id' ? 'Ekspor Transparan & Indah' : 'Beautiful & Transparent Export',
      desc: language === 'id'
        ? 'Mendukung ekspor langsung format PNG dengan latar belakang transparan (no-background) yang mempermudah editing langsung di video CapCut / Premiere.'
        : 'Supports direct PNG export with a transparent background (no-background) which facilitates editing directly in CapCut / Premiere video editing apps.',
      icon: <ImageIcon className="w-5 h-5 text-emerald-400" />
    }
  ];

  const platforms = [
    { name: 'TikTok', icon: <TikTokColoredIcon className="w-6 h-6" />, path: '/tiktok-generator' },
    { name: 'Instagram', icon: <InstagramColoredIcon className="w-7 h-7" />, path: '/instagram-generator' },
    { name: 'YouTube', icon: <YouTubeColoredIcon className="w-7 h-7" />, path: '/youtube-generator' },
    { name: 'Twitter/X', icon: <TwitterColoredIcon className="w-7 h-7" />, path: '/twitter-generator' },
    { name: 'Kick Live', icon: <KickColoredIcon className="w-6 h-6" fontSize="16px" />, path: '/kick-generator' },
  ];

  const pathData: Record<string, { title: Record<'id' | 'en', string>; subtitle: Record<'id' | 'en', string>; badge: Record<'id' | 'en', string>; focusPlatform?: string }> = {
    '/': {
      title: {
        id: 'Buat Screenshot Komentar Realistis dalam Hitungan Detik',
        en: 'Create Realistic Comment Screenshots in Seconds'
      },
      subtitle: {
        id: 'Sempurna untuk video konten kreator UGC, video reaksi TikTok, materi presentasi, edukasi, meme lucu, dan pembuatan mockup interaktif dengan kualitas gambar retina tajam serta opsi ekspor transparan murni.',
        en: 'Perfect for UGC video content creators, TikTok reaction videos, presentations, education, funny memes, and interactive mockup building with sharp retina image quality and pure transparent export options.'
      },
      badge: {
        id: 'UGC Creator Tool Terunggul di Indonesia',
        en: 'The Premier UGC Creator Tool in Indonesia'
      },
    },
    '/twitter-generator': {
      title: {
        id: 'Fake Tweet Generator & Aesthetic Twitter Screenshot Maker',
        en: 'Fake Tweet Generator & Aesthetic Twitter Screenshot Maker'
      },
      subtitle: {
        id: 'Buat screenshot postingan atau komentar Twitter/X super realistis dengan lencana verifikasi biru, jumlah suka, retweet, dan mode malam gelap (Dark Mode) premium secara instan.',
        en: 'Instantly create highly realistic Twitter/X posts or comments with blue verified badges, likes count, retweets, and premium Dark Mode support.'
      },
      badge: {
        id: 'Aesthetic Twitter Screenshot Maker',
        en: 'Aesthetic Twitter Screenshot Maker'
      },
      focusPlatform: 'twitter',
    },
    '/tiktok-generator': {
      title: {
        id: 'TikTok Comment Mockup Generator & Post Builder',
        en: 'TikTok Comment Mockup Generator & Post Builder'
      },
      subtitle: {
        id: 'Bikin tiruan (mockup) balasan komentar video TikTok, lengkap dengan foto profil, durasi waktu, tanda suka merah, dan pin kreator untuk disematkan pada video reaksi atau CapCut Anda.',
        en: 'Make mockups of TikTok video comment replies, complete with profile picture, time duration, red likes count, and creator pin badge to use in your reaction videos or CapCut.'
      },
      badge: {
        id: 'TikTok Comment Mockup Generator',
        en: 'TikTok Comment Mockup Generator'
      },
      focusPlatform: 'tiktok',
    },
    '/instagram-generator': {
      title: {
        id: 'Instagram Post Mockup Tool & Aesthetic IG Comment Editor',
        en: 'Instagram Post Mockup Tool & Aesthetic IG Comment Editor'
      },
      subtitle: {
        id: 'Hasilkan mockup postingan Instagram, komentar feed, atau antarmuka Instagram Live Stream secara profesional dengan lencana verifikasi biru dan tata letak asli 100% akurat.',
        en: 'Professionally generate Instagram post mockups, feed comments, or Instagram Live Stream interfaces with blue verified badge and 100% accurate layout.'
      },
      badge: {
        id: 'Aesthetic IG Comment Editor',
        en: 'Aesthetic IG Comment Editor'
      },
      focusPlatform: 'instagram',
    },
    '/youtube-generator': {
      title: {
        id: 'YouTube Comment Screenshot & Post Generator',
        en: 'YouTube Comment Screenshot & Post Generator'
      },
      subtitle: {
        id: 'Buat mockup komentar YouTube atau postingan komunitas berkualitas tinggi dengan dukungan dark mode penuh, lencana ber-verifikasi, jumlah jempol, dan pin pemilik channel.',
        en: 'Create high-quality YouTube comment or community post mockups with full dark mode support, verified badge, thumbs up count, and channel owner pin.'
      },
      badge: {
        id: 'YouTube Comment Screenshot Generator',
        en: 'YouTube Comment Screenshot Generator'
      },
      focusPlatform: 'youtube',
    },
    '/kick-generator': {
      title: {
        id: 'Kick Live Chat Mockup Generator & Stream Builder',
        en: 'Kick Live Chat Mockup Generator & Stream Builder'
      },
      subtitle: {
        id: 'Buat screenshot atau tiruan obrolan langsung (live chat) Kick dengan warna badge langganan hijau, lencana moderator, nama pengguna berwarna, dan gaya teks realistis.',
        en: 'Create Kick live chat screenshots or mockups with green subscription badges, moderator badges, custom colored usernames, and realistic style.'
      },
      badge: {
        id: 'Kick Live Chat Mockup Generator',
        en: 'Kick Live Chat Mockup Generator'
      },
      focusPlatform: 'kick_live',
    }
  };

  const normalizedPath = pathData[currentPath] ? currentPath : '/';
  const pathMeta = pathData[normalizedPath];
  const meta = {
    title: pathMeta.title[language],
    subtitle: pathMeta.subtitle[language],
    badge: pathMeta.badge[language],
    focusPlatform: pathMeta.focusPlatform
  };

  const heroWords = meta.title.trim().split(/\s+/);
  const heroAccent = heroWords.slice(-2).join(' ');
  const heroAccentPos = meta.title.lastIndexOf(heroAccent);
  const heroBase = heroAccentPos > 0 ? meta.title.slice(0, heroAccentPos).trim() : meta.title;

  return (
    <div className="min-h-screen bg-[var(--root-bg)] text-[var(--root-fg)] selection:bg-[var(--accent)]/20">
      {/* Landing Header — Transport Bar */}
      <nav className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-[var(--panel-border)] bg-[var(--panel-bg-translucent)] backdrop-blur-xl sticky top-0 z-50">
        <div 
          onClick={() => onNavigate('/')} 
          className="flex items-center gap-3 select-none cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          <CapybaraLogo className="w-8 h-8 shrink-0 hover:rotate-6 transition-transform duration-300" />
          <div className="flex flex-col leading-none">
            <span className={`font-black text-base tracking-tight transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>SocialCanvas</span>
            <span className="mono-label text-[9px] text-[var(--text-muted)] mt-0.5">UGC_01 · READY</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onStartEditor(meta.focusPlatform)}
            className="mono-label text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer px-2.5 py-1.5 hover:bg-[var(--button-hover)] rounded-md"
          >
            {t('header.openEditor')}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="mono-label flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--input-bg)] border border-[var(--panel-border)] text-[10px] font-bold hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
            title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="tracking-wide">{language === 'id' ? 'ID' : 'EN'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onThemeChange}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--input-bg)] border border-[var(--panel-border)] hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
            title={theme === 'dark' ? (language === 'id' ? 'Mode terang' : 'Light mode') : (language === 'id' ? 'Mode gelap' : 'Dark mode')}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Moon className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
          </button>
          
          {currentUser ? (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[var(--input-bg)] border border-[var(--panel-border)] mono-label text-[10px] font-bold hover:bg-[var(--button-hover)] transition-all cursor-pointer"
            >
              <img src={currentUser.avatar} alt="User avatar" className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
              <span className="max-w-[80px] truncate">{currentUser.name}</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-2.5 py-1.5 rounded-md mono-label text-[10px] font-bold bg-[var(--input-bg)] border border-[var(--panel-border)] hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
            >
              {t('header.login')}
            </button>
          )}

          <button
            onClick={onUpgradeClick}
            className={`mono-label text-[10px] font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              isPremium 
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/25' 
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] shadow-sm'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            {isPremium ? (language === 'id' ? 'PRO AKTIF' : 'PRO ACTIVE') : (language === 'id' ? 'COBA PRO' : 'TRY PRO')}
          </button>
        </div>
      </nav>


      {/* Main Content Areas */}
      {currentPath === '/terms' ? (
        /* Terms of Service Section */
        <section className="relative px-4 py-16 max-w-3xl mx-auto">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] bg-gradient-to-tr from-[var(--accent)]/5 via-[var(--accent)]/4 to-[var(--record)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="mb-8">
            <button 
              onClick={() => onNavigate('/')}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-bold mb-4 flex items-center gap-1 cursor-pointer"
            >
              ← Kembali ke Beranda
            </button>
            <h1 className="text-3xl font-black tracking-tight mb-2">Ketentuan Layanan (Terms of Service)</h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Terakhir diperbarui: 19 Juli 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--panel-border)]/50 pt-6">
            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">1. Penerimaan Ketentuan</h2>
              <p>Dengan mengakses atau menggunakan platform SocialCanvas, Anda setuju untuk terikat oleh Ketentuan Layanan ini serta semua hukum dan peraturan yang berlaku. Jika Anda tidak menyetujui ketentuan ini, Anda dilarang menggunakan platform ini.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">2. Deskripsi Layanan</h2>
              <p>SocialCanvas menyediakan layanan mockup visual screenshot media sosial (TikTok, Instagram, Twitter/X, YouTube, Kick Live) untuk tujuan edukasi, desain materi kreatif, prototipe aplikasi, dan pembuatan konten UGC (User Generated Content). Layanan ini tidak terafiliasi secara resmi dengan platform media sosial tersebut.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">3. Batasan Penggunaan & Tanggung Jawab</h2>
              <p>Anda setuju untuk menggunakan SocialCanvas secara bertanggung jawab. **Dilarang keras** menggunakan hasil generator platform ini untuk:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Menyebarkan hoaks, berita bohong, fitnah, atau misinformasi berbahaya.</li>
                <li>Melakukan penipuan keuangan, memalsukan bukti percakapan untuk tujuan kriminal, atau merugikan reputasi pihak lain.</li>
                <li>Melanggar hukum pencemaran nama baik atau privasi individu.</li>
              </ul>
              <p className="mt-2">Kami berhak membatasi akses atau memblokir akun yang terindikasi melanggar panduan keselamatan ini.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">4. Hak Kekayaan Intelektual</h2>
              <p>Seluruh desain antarmuka, aset merek, dan logo dari TikTok, Instagram, Twitter/X, YouTube, dan Kick adalah milik eksklusif pemegang hak cipta masing-masing. SocialCanvas hanya menyediakan bentuk tiruan (mockup) visual rekreasi yang digambar ulang untuk memudahkan kreativitas legal.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">5. Keanggotaan PRO (SaaS Subscription)</h2>
              <p>Layanan premium SocialCanvas (PRO Creator) ditawarkan berbasis berlangganan bulanan. Pembayaran diproses dengan aman. Tidak ada pengembalian dana (refund) untuk periode berjalan kecuali diatur berbeda oleh hukum setempat. Pembatalan langganan dapat dilakukan kapan saja melalui menu penyesuaian akun.</p>
            </div>

            <div className="pt-6 border-t border-[var(--panel-border)]/50 text-center">
              <button
                onClick={() => onStartEditor()}
                className="px-5 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-bold text-xs rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Mulai Gunakan SocialCanvas
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      ) : currentPath === '/privacy' ? (
        /* Privacy Policy Section */
        <section className="relative px-4 py-16 max-w-3xl mx-auto">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] bg-gradient-to-tr from-[var(--accent)]/5 via-[var(--accent)]/4 to-[var(--record)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="mb-8">
            <button 
              onClick={() => onNavigate('/')}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-bold mb-4 flex items-center gap-1 cursor-pointer"
            >
              ← Kembali ke Beranda
            </button>
            <h1 className="text-3xl font-black tracking-tight mb-2">Kebijakan Privasi (Privacy Policy)</h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Terakhir diperbarui: 19 Juli 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--panel-border)]/50 pt-6">
            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">1. Informasi yang Kami Kumpulkan</h2>
              <p>Kami sangat menghargai privasi Anda. SocialCanvas mengumpulkan seminimal mungkin data untuk menjaga kelancaran operasi:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>**Data Akun:** Ketika Anda masuk via login tamu atau akun terverifikasi, kami menyimpan nama, alamat email, dan URL avatar Anda.</li>
                <li>**Data Penggunaan:** Kami menyimpan statistik jumlah ekspor gambar harian untuk membatasi kuota harian pada paket gratis.</li>
                <li>**Data Lokal:** Semua data kustomisasi teks mockup Anda disimpan di penyimpanan lokal browser Anda (`localStorage`) dan tidak dikirimkan secara mentah ke server kami demi alasan privasi.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">2. Bagaimana Kami Menggunakan Informasi</h2>
              <p>Data yang dikumpulkan digunakan secara eksklusif untuk:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Mengelola status keanggotaan PRO Anda agar fitur ekspor tanpa batas dapat diakses.</li>
                <li>Menyediakan bantuan dukungan teknis apabila terjadi masalah pada akun Anda.</li>
                <li>Memantau dan meningkatkan kinerja teknis platform generator.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">3. Perlindungan & Penyimpanan Data</h2>
              <p>Kami berkomitmen penuh untuk tidak pernah menjual, menyewakan, atau membagikan data identitas pribadi Anda kepada pihak ketiga manapun untuk tujuan pemasaran. Data disimpan menggunakan teknologi penyimpanan cloud modern dengan enkripsi standar industri.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">4. Hak Pengguna</h2>
              <p>Anda berhak untuk meminta penghapusan permanen seluruh data profil Anda dari sistem database kami. Untuk melakukannya, silakan lakukan proses keluar akun (Logout) atau hubungi tim bantuan teknis kami.</p>
            </div>

            <div>
              <h2 className="font-bold text-[var(--root-fg)] text-base mb-2">5. Perubahan Kebijakan Privasi</h2>
              <p>Kami dapat memperbarui Kebijakan Privasi ini secara berkala. Perubahan akan diumumkan dengan memperbarui tanggal revisi di bagian atas halaman ini. Silakan tinjau kembali halaman ini secara teratur.</p>
            </div>

            <div className="pt-6 border-t border-[var(--panel-border)]/50 text-center">
              <button
                onClick={() => onStartEditor()}
                className="px-5 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-bold text-xs rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Mulai Gunakan SocialCanvas
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Standard Dynamic Landing Page (Main, Twitter, TikTok, Instagram, YouTube) */
        <>
          {/* Hero Section — Monitor Studio */}
          <section className="relative px-4 pt-14 pb-16 max-w-5xl mx-auto text-center flex flex-col items-center">
            {/* Glow backdrop decoration */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] bg-gradient-to-tr from-[var(--accent)]/8 via-[var(--accent)]/5 to-[var(--record)]/8 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--accent)] mono-label text-[10px] px-3 py-1.5 rounded-md mb-6 select-none">
              <Crown className="w-3 h-3 animate-pulse" />
              {meta.badge}
            </div>

            <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
              {heroBase} <span className="text-[var(--accent)]">{heroAccent}</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-6 leading-relaxed">
              {meta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mt-10">
              <button
                onClick={() => onStartEditor(meta.focusPlatform)}
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-bold text-sm rounded-lg flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t('landing.start')}
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onUpgradeClick}
                className="px-6 py-3 bg-[var(--panel-bg)] hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-bold text-sm rounded-lg border border-[var(--panel-border)] flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" />
                {t('landing.compare')}
              </button>
            </div>

            {/* Channel Strip — Timeline Signature */}
            <div className="mt-14 w-full max-w-4xl border border-[var(--panel-border)] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--panel-bg)] border-b border-[var(--panel-border)]">
                <span className="mono-label text-[9px] text-[var(--text-muted)]">{t('landing.platformsDesc')}</span>
                <span className="mono-label text-[9px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  5 CH
                </span>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-1 p-2 bg-[var(--rail)]/40">
                {platforms.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => onNavigate(p.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all select-none cursor-pointer ${
                      normalizedPath === p.path 
                        ? 'border-[var(--accent)]/50 bg-[var(--accent)]/8 ring-1 ring-[var(--accent)]/20' 
                        : 'border-[var(--panel-border)] bg-[var(--panel-bg)] hover:border-[var(--panel-border)] hover:-translate-y-[1px]'
                    }`}
                  >
                    <span className="mono-label text-[8px] text-[var(--text-muted)]">CH{String(i + 1).padStart(2, '0')}</span>
                    {p.icon}
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Grid Features — Clip Inspector */}
          <section className="px-4 py-16 bg-[var(--panel-bg)] border-t border-b border-[var(--panel-border)]/50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="mono-label text-[9px] text-[var(--accent)] block mb-2">ASSETS · 05 CLIPS</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('landing.featuresTitle')}</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1.5">{t('landing.featuresDesc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="p-5 rounded-lg border border-[var(--panel-border)] bg-[var(--root-bg)]/40 hover:border-[var(--accent)]/30 transition-all flex gap-4 group">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <span className="mono-label text-[8px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">CLIP·{String.fromCharCode(65 + i)}</span>
                      <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/8 border border-[var(--accent)]/15 flex items-center justify-center shrink-0">
                        {f.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">{f.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section — Spec Sheet */}
          <section className="px-4 py-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-lg overflow-hidden">
              {stats.map((s, i) => (
                <div key={i} className="p-5 bg-[var(--panel-bg)] flex flex-col items-center justify-center gap-1">
                  <span className="mono-label text-[8px] text-[var(--text-muted)]">SPEC·{String(i + 1).padStart(2, '0')}</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)] tracking-tight">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-[var(--text-muted)] font-semibold text-center">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SaaS Pricing Section */}
          <section className="px-4 py-16 bg-[var(--panel-bg)]/60 border-t border-[var(--panel-border)]">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('pricing.title')}</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1.5">{t('pricing.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
                {/* Free Plan */}
                <div className="bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-3xl p-6.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <h3 className="text-lg font-black">{t('pricing.free.title')}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{t('pricing.free.desc')}</p>
                    
                    <div className="my-6">
                      <span className="text-3xl font-black">{t('pricing.free.price')}</span>
                      <span className="text-xs text-[var(--text-muted)]">{t('pricing.free.period')}</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Maksimal 30 ekspor per hari' : 'Maximum of 30 exports per day'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Akses ke semua tata letak layout platform' : 'Access to all platform layout designs'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Opsi kustomisasi penuh & multi-komen' : 'Full customization & multi-comment options'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start opacity-40">
                        <XIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Kualitas gambar standar 1X' : 'Standard 1X image quality'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start opacity-40">
                        <XIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Ada watermark tipis SocialCanvas' : 'Subtle SocialCanvas watermark included'}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onStartEditor(meta.focusPlatform)}
                    className="w-full mt-8 py-3 bg-[var(--panel-bg)] hover:bg-[var(--button-hover)] border border-[var(--panel-border)] text-[var(--root-fg)] font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {t('pricing.free.btn')}
                  </button>
                </div>

                {/* PRO Creator Plan */}
                <div className="bg-[var(--root-bg)] border border-[var(--accent)]/50 rounded-lg p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="absolute top-3.5 right-3.5 bg-[var(--accent)] text-[var(--root-bg)] mono-label text-[9px] uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--root-bg)]" />
                    {t('pricing.recommended')}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-extrabold text-[var(--accent)] flex items-center gap-1.5">
                      {t('pricing.pro.title').split(' ')[0]} {t('pricing.pro.title').split(' ').slice(1).join(' ')}
                      <Crown className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" />
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{t('pricing.pro.desc')}</p>
                    
                    <div className="my-6">
                      <div className="text-xs text-[var(--text-muted)] line-through">{language === 'id' ? 'Rp 199.000' : '$9.99'}</div>
                      <span className="text-3xl font-extrabold text-[var(--accent)]">{t('pricing.pro.price')}</span>
                      <span className="text-xs text-[var(--text-muted)]">{t('pricing.pro.period')}</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-[var(--accent)]">{language === 'id' ? 'Ekspor tanpa batas harian (Unlimited)' : 'Unlimited daily exports (No limits)'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Resolusi Ultra HD (Penskalaan Gambar 4x)' : 'Ultra HD Retina quality (4X image scaling)'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-semibold">{language === 'id' ? 'Fitur Ekspor Video Animasi (Segera Hadir)' : 'Animated Video Export Feature (Coming Soon)'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Bebas dari Watermark & Iklan' : 'Completely Ad & Watermark Free'}</span>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === 'id' ? 'Dukungan prioritas & request layout khusus' : 'Priority support & custom layout requests'}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={onUpgradeClick}
                    className="w-full mt-8 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    {isPremium ? (language === 'id' ? 'Sudah Aktif' : 'Already Active') : t('pricing.pro.btn')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Landing Footer */}
      <footer className="border-t border-[var(--panel-border)] py-12 px-4 text-center text-xs text-[var(--text-muted)] bg-[var(--root-bg)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div 
            onClick={() => onNavigate('/')} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            <CapybaraLogo className="w-8 h-8 drop-shadow-sm shrink-0 hover:rotate-6 transition-transform duration-300" />
            <span className={`font-black text-sm transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>SocialCanvas</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-bold">
            <button onClick={() => onNavigate('/')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">Main Generator</button>
            <button onClick={() => onNavigate('/twitter-generator')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">Twitter / X</button>
            <button onClick={() => onNavigate('/tiktok-generator')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">TikTok</button>
            <button onClick={() => onNavigate('/instagram-generator')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">Instagram</button>
            <button onClick={() => onNavigate('/youtube-generator')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">YouTube</button>
            <button onClick={() => onNavigate('/kick-generator')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer">Kick Live</button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer text-[var(--accent)] hover:underline">TOS (Ketentuan Layanan)</button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-[var(--root-fg)] transition-colors cursor-pointer text-[var(--accent)] hover:underline">Privacy (Kebijakan Privasi)</button>
          </div>
          
          <div className="flex flex-col gap-2 items-center md:items-end">
            <div className="mono-label text-[10px] flex items-center gap-1.5 opacity-80">
              <span>Dibuat dengan</span>
              <Heart className="w-3 h-3 text-[var(--record)] fill-[var(--record)]" />
              <span>untuk UGC Kreator</span>
            </div>
            <p className="mono-label text-[9px] opacity-50">© 2026 SocialCanvas · RENDER ENGINE v2.0 · ALL SYSTEMS ONLINE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}
