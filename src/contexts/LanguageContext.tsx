import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Header
    'header.goHome': 'Kembali ke Beranda',
    'header.home': 'Beranda',
    'header.login': 'Masuk',
    'header.logout': 'Keluar',
    'header.proAccount': 'Akun PRO',
    'header.freeAccount': 'Akun Free',
    'header.openEditor': 'Buka Editor',
    'header.switchTheme': 'Ganti Tema',
    'header.terms': 'Ketentuan Layanan',
    'header.privacy': 'Kebijakan Privasi',
    
    // Sidebar Tabs
    'sidebar.tab.comment': 'Comment',
    'sidebar.tab.engagement': 'Engagement',
    'sidebar.tab.advanced': 'Advanced',
    'sidebar.tab.gallery': 'Gallery',

    // Sidebar Content - Comment
    'sidebar.tiktokTemplate': 'Template TikTok',
    'sidebar.tiktokTemplate.video': 'Video Comment',
    'sidebar.tiktokTemplate.reply': 'Reply Bubble',
    'sidebar.instagramTemplate': 'Template Instagram',
    'sidebar.instagramTemplate.comment': 'Post Comment',
    'sidebar.instagramTemplate.live': 'Live Comment',
    'sidebar.avatar': 'Avatar',
    'sidebar.avatar.upload': 'Upload',
    'sidebar.avatar.random': 'Random',
    'sidebar.avatar.remove': 'Hapus Avatar',
    'sidebar.username': 'Username',
    'sidebar.handle': '@Handle',
    'sidebar.commentText': 'Comment Text',
    'sidebar.commentText.placeholder': 'Tulis komentar Anda...',
    'sidebar.commentText.formatting': 'Tulis komentar Anda dengan kustomisasi...',
    'sidebar.formatting.highlight': 'Highlight',
    'sidebar.formatting.blur': 'Blur',
    'sidebar.formatting.cut': 'Coret (Cut)',
    'sidebar.formatting.reset': 'Reset Format',

    // Sidebar Content - Engagement
    'sidebar.likes': 'Likes',
    'sidebar.time': 'Waktu',
    'sidebar.retweets': 'Retweets',
    'sidebar.views': 'Views',
    'sidebar.replies': 'Replies',
    'sidebar.badges': 'Tanda / Lencana',
    'sidebar.badge.verified': 'Verified Badge',
    'sidebar.badge.creatorLiked': 'Creator Liked',
    'sidebar.badge.pinned': 'Pinned Comment',

    // Sidebar Content - Advanced
    'sidebar.platform': 'Platform',
    'sidebar.nestedReplies': 'Nested Replies',
    'sidebar.liveComments': 'Komentar Live',
    'sidebar.appearanceWatermark': 'Appearance & Watermark',
    'sidebar.animation': 'Animation (Segera Hadir)',
    'sidebar.animation.desc': 'Efek transisi masuk dinamis, animasi fade-in, dan kustomisasi waktu rendering frame.',
    'sidebar.customCss': 'Custom CSS (Segera Hadir)',
    'sidebar.customCss.desc': 'Tulis kode style kustom untuk override elemen card secara penuh.',

    // Sidebar Content - Gallery
    'sidebar.snapshotGallery': 'Snapshot Gallery',
    'sidebar.gallery.empty': 'Belum ada snapshot.',
    'sidebar.gallery.emptyDesc': 'Gunakan tombol Snapshot di area Preview untuk membandingkan desain.',
    'sidebar.gallery.save': 'Simpan',
    'sidebar.gallery.delete': 'Hapus',
    'sidebar.gallery.timestamp': 'Timestamp',
    'sidebar.gallery.selectAll': 'Pilih Semua',
    'sidebar.gallery.deselectAll': 'Batal Pilih Semua',
    'sidebar.gallery.deleteSelected': 'Hapus Terpilih',

    // Sidebar Fixed Bottom
    'sidebar.undo': 'Undo',
    'sidebar.redo': 'Redo',
    'sidebar.draft': 'Draft',
    'sidebar.draft.count': 'Draft ({count})',
    'sidebar.history.count': 'Riwayat ({count})',

    // SectionDrafts
    'drafts.cloudSyncActive': 'Cloud Sync Aktif',
    'drafts.cloudSyncInactive': 'Penyimpanan Lokal',
    'drafts.cloudSyncDescActive': 'Karya disinkronkan otomatis antar perangkat',
    'drafts.cloudSyncDescInactive': 'Draf disimpan di browser. Upgrade untuk cloud sync.',
    'drafts.manualSync': 'Sinkronisasi Manual',
    'drafts.syncSuccess': 'Sinkronisasi cloud berhasil!',
    'drafts.proSync': 'PRO Sync',
    'drafts.draftSavedLocal': 'Draf "{name}" disimpan lokal!',
    'drafts.draftSavedCloud': 'Draf "{name}" tersinkronisasi ke cloud!',
    'drafts.draftRenamed': 'Draf berhasil diganti nama!',
    'drafts.draftDeleted': 'Draf "{name}" berhasil dihapus.',
    'drafts.loading': 'Memuat "{name}"...',
    'drafts.placeholder': 'Beri nama draf baru...',
    'drafts.emptyDrafts': 'Belum ada draf disimpan',
    'drafts.emptyDraftsDesc': 'Gunakan input di atas untuk menyimpan draf pertama Anda.',
    'drafts.emptyHistory': 'Riwayat masih kosong',
    'drafts.emptyHistoryDesc': 'Riwayat akan tersimpan otomatis saat Anda menekan tombol **Randomize**, **Reset**, atau mengunduh hasil ekspor.',
    'drafts.autoSaveDesc': 'Disimpan otomatis dari suntingan terakhir',
    'drafts.clearAll': 'Bersihkan Semua',
    'drafts.rename': 'Ganti Nama',
    'drafts.delete': 'Hapus',

    // SectionReplies / SectionComment
    'replies.add': 'Tambah {type} Baru',
    'replies.comment': 'Komentar',
    'replies.reply': 'Balasan',
    'replies.empty': 'Belum ada {type}.',
    'replies.emptyDesc': 'Klik tombol di atas untuk menambah.',
    'replies.edit': 'Edit Balasan',
    'replies.duplicate': 'Duplikat',
    'replies.remove': 'Hapus',
    'replies.clickToEdit': 'Klik untuk mengedit balasan ini',

    // SectionAppearance
    'appearance.fontFamily': 'Font Family',
    'appearance.fontSize': 'Font Size',
    'appearance.padding': 'Padding',
    'appearance.borderRadius': 'Border Radius',
    'appearance.cardWidth': 'Lebar Kartu (Width)',
    'appearance.autoWidth': 'Lebar Otomatis (Auto Adjust)',
    'appearance.dropShadow': 'Drop Shadow',
    'appearance.replyBubbleColor': 'Reply Bubble Color',
    'appearance.transparentBackground': 'Transparent Background',

    // Landing Page Hero
    'landing.badge': 'UGC Creator Tool Terunggul di Indonesia',
    'landing.start': 'Mulai Buat Komentar',
    'landing.compare': 'Bandingkan Paket PRO',
    'landing.platformsDesc': 'Mendukung Layout Platform Terlengkap',
    'landing.featuresTitle': 'Dikembangkan Khusus untuk Kebutuhan Kreatif',
    'landing.featuresDesc': 'Setiap elemen didesain presisi agar pixel-perfect menyerupai tampilan aplikasi aslinya.',
    'landing.stats.ugc': 'Konten UGC Dibuat',
    'landing.stats.ready': 'Siap Digunakan',
    'landing.stats.realistic': 'Hasil Sangat Realistis',
    'landing.stats.free': 'Bisa Mulai Gratis',

    // Landing Page Pricing
    'pricing.title': 'Rencana Harga Berlangganan',
    'pricing.subtitle': 'Gratis selamanya dengan opsi upgrade PRO Creator untuk hasil tanpa batas.',
    'pricing.free.title': 'Free Plan',
    'pricing.free.desc': 'Cocok untuk kreator pemula',
    'pricing.free.price': 'Rp 0',
    'pricing.free.period': ' / selamanya',
    'pricing.free.feature1': 'Maksimal **30 Ekspor per hari**',
    'pricing.free.feature2': 'Akses ke semua tata letak layout platform',
    'pricing.free.feature3': 'Opsi kustomisasi penuh & multi-komen',
    'pricing.free.feature4': 'Kualitas gambar standar 1X',
    'pricing.free.feature5': 'Ada watermark tipis SocialCanvas',
    'pricing.free.btn': 'Mulai Gratis Sekarang',

    'pricing.pro.title': 'PRO Creator Plan',
    'pricing.pro.desc': 'Sempurna untuk Agensi & UGC Creator profesional',
    'pricing.pro.price': 'Rp 29.000',
    'pricing.pro.period': ' / bulan',
    'pricing.pro.feature1': 'Ekspor tanpa batas tanpa limit harian',
    'pricing.pro.feature2': 'Kualitas Ultra HD Retina (Sangat Jelas 4X)',
    'pricing.pro.feature3': 'Tanpa Watermark SocialCanvas',
    'pricing.pro.feature4': 'Akses penuh ke semua fitur premium baru',
    'pricing.pro.feature5': 'Dukungan cloud sync & draf tanpa batas',
    'pricing.pro.btn': 'Upgrade ke PRO Sekarang',
    'pricing.recommended': 'Rekomendasi',

    // Preview Area Action Buttons
    'preview.randomize': 'Randomize',
    'preview.snapshot': 'Snapshot',
    'preview.export': 'Export',
    'preview.randomize.title': 'Acak Konten',
    'preview.snapshot.title': 'Ambil Snapshot untuk Perbandingan',

    // Modals
    'auth.title': 'Selamat Datang Kembali',
    'auth.desc': 'Masuk untuk mengaktifkan cloud sync, draf tanpa batas, dan fitur PRO.',
    'auth.successGoogle': 'Berhasil masuk dengan Google!',
    'auth.failGoogle': 'Gagal masuk dengan Google.',
    'auth.successRegister': 'Berhasil mendaftar!',
    'auth.successLogin': 'Berhasil masuk!',
    'auth.errorAuth': 'Terjadi kesalahan otentikasi.',
    'auth.enterEmail': 'Masukkan email Anda.',
    'auth.successReset': 'Email reset password telah dikirim. Periksa kotak masuk Anda.',
    'auth.failReset': 'Gagal mengirim email reset password.',
    'auth.successGuest': 'Masuk sebagai Akun Tamu (Guest)!',
    'auth.success': 'Sukses!',
    'auth.guestAccount': 'Akun Tamu (Guest)',
    'auth.registeredAccount': 'Akun Terdaftar',
    'auth.sessionInfo': 'Informasi Sesi Akun',
    'auth.sessionInfoDesc': 'Semua komentar mockup yang Anda edit akan otomatis disimpan ke penyimpanan lokal Anda agar tidak hilang saat halaman disegarkan.',
    'auth.close': 'Tutup',
    'auth.logout': 'Keluar Akun',
    'auth.loginOrRegister': 'Masuk atau Daftar',
    'auth.loginOrRegisterDesc': 'Pilih metode masuk akun Anda untuk mengaktifkan batas ekspor harian.',
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.forgotPassword': 'Lupa Sandi',
    'auth.forgotPasswordDesc': 'Masukkan email akun Anda. Kami akan mengirimkan tautan untuk menyetel ulang kata sandi.',
    'auth.emailAddress': 'Alamat Email',
    'auth.sending': 'Mengirim...',
    'auth.sendResetLink': 'Kirim Link Reset',
    'auth.creatorName': 'Nama Kreator',
    'auth.creatorNamePlaceholder': 'Contoh: Andi Wijaya',
    'auth.password': 'Kata Sandi',
    'auth.passwordPlaceholder': 'Minimal 6 karakter',
    'auth.processing': 'Memproses...',
    'auth.registerNow': 'Daftar Sekarang',
    'auth.loginAccount': 'Masuk Akun',
    'auth.or': 'Atau',
    'auth.loginWithGoogle': 'Masuk dengan Google',
    'auth.continueAsGuest': 'Lanjutkan sebagai Tamu',
    'auth.importantFirebase': 'Penting: Pastikan Anda telah mengaktifkan Email/Password provider di Firebase Console Anda jika fitur pendaftaran gagal.',
    'upgrade.title': 'Upgrade ke PRO Creator',
    'upgrade.desc': 'Buka potensi penuh pembuatan konten Anda.',
  },
  en: {
    // Header
    'header.goHome': 'Back to Home',
    'header.home': 'Home',
    'header.login': 'Login',
    'header.logout': 'Logout',
    'header.proAccount': 'PRO Account',
    'header.freeAccount': 'Free Account',
    'header.openEditor': 'Open Editor',
    'header.switchTheme': 'Switch Theme',
    'header.terms': 'Terms of Service',
    'header.privacy': 'Privacy Policy',

    // Sidebar Tabs
    'sidebar.tab.comment': 'Comment',
    'sidebar.tab.engagement': 'Engagement',
    'sidebar.tab.advanced': 'Advanced',
    'sidebar.tab.gallery': 'Gallery',

    // Sidebar Content - Comment
    'sidebar.tiktokTemplate': 'TikTok Template',
    'sidebar.tiktokTemplate.video': 'Video Comment',
    'sidebar.tiktokTemplate.reply': 'Reply Bubble',
    'sidebar.instagramTemplate': 'Instagram Template',
    'sidebar.instagramTemplate.comment': 'Post Comment',
    'sidebar.instagramTemplate.live': 'Live Comment',
    'sidebar.avatar': 'Avatar',
    'sidebar.avatar.upload': 'Upload',
    'sidebar.avatar.random': 'Random',
    'sidebar.avatar.remove': 'Remove Avatar',
    'sidebar.username': 'Username',
    'sidebar.handle': '@Handle',
    'sidebar.commentText': 'Comment Text',
    'sidebar.commentText.placeholder': 'Type your comment...',
    'sidebar.commentText.formatting': 'Type your comment with formatting...',
    'sidebar.formatting.highlight': 'Highlight',
    'sidebar.formatting.blur': 'Blur',
    'sidebar.formatting.cut': 'Strikeout (Cut)',
    'sidebar.formatting.reset': 'Reset Format',

    // Sidebar Content - Engagement
    'sidebar.likes': 'Likes',
    'sidebar.time': 'Time',
    'sidebar.retweets': 'Retweets',
    'sidebar.views': 'Views',
    'sidebar.replies': 'Replies',
    'sidebar.badges': 'Badges & Markers',
    'sidebar.badge.verified': 'Verified Badge',
    'sidebar.badge.creatorLiked': 'Creator Liked',
    'sidebar.badge.pinned': 'Pinned Comment',

    // Sidebar Content - Advanced
    'sidebar.platform': 'Platform',
    'sidebar.nestedReplies': 'Nested Replies',
    'sidebar.liveComments': 'Live Comments',
    'sidebar.appearanceWatermark': 'Appearance & Watermark',
    'sidebar.animation': 'Animation (Coming Soon)',
    'sidebar.animation.desc': 'Dynamic entrance transition effects, fade-in animations, and custom frame rendering time.',
    'sidebar.customCss': 'Custom CSS (Coming Soon)',
    'sidebar.customCss.desc': 'Write custom style code to completely override the card elements.',

    // Sidebar Content - Gallery
    'sidebar.snapshotGallery': 'Snapshot Gallery',
    'sidebar.gallery.empty': 'No snapshots yet.',
    'sidebar.gallery.emptyDesc': 'Use the Snapshot button in the Preview area to compare designs.',
    'sidebar.gallery.save': 'Save',
    'sidebar.gallery.delete': 'Delete',
    'sidebar.gallery.timestamp': 'Timestamp',
    'sidebar.gallery.selectAll': 'Select All',
    'sidebar.gallery.deselectAll': 'Deselect All',
    'sidebar.gallery.deleteSelected': 'Delete Selected',

    // Sidebar Fixed Bottom
    'sidebar.undo': 'Undo',
    'sidebar.redo': 'Redo',
    'sidebar.draft': 'Draft',
    'sidebar.draft.count': 'Drafts ({count})',
    'sidebar.history.count': 'History ({count})',

    // SectionDrafts
    'drafts.cloudSyncActive': 'Cloud Sync Active',
    'drafts.cloudSyncInactive': 'Local Storage',
    'drafts.cloudSyncDescActive': 'Work automatically synced across devices',
    'drafts.cloudSyncDescInactive': 'Drafts saved in browser. Upgrade for cloud sync.',
    'drafts.manualSync': 'Manual Sync',
    'drafts.syncSuccess': 'Cloud sync successful!',
    'drafts.proSync': 'PRO Sync',
    'drafts.draftSavedLocal': 'Draft "{name}" saved locally!',
    'drafts.draftSavedCloud': 'Draft "{name}" synced to cloud!',
    'drafts.draftRenamed': 'Draft successfully renamed!',
    'drafts.draftDeleted': 'Draft "{name}" deleted successfully.',
    'drafts.loading': 'Loading "{name}"...',
    'drafts.placeholder': 'Name your new draft...',
    'drafts.emptyDrafts': 'No drafts saved yet',
    'drafts.emptyDraftsDesc': 'Use the input above to save your first draft.',
    'drafts.emptyHistory': 'History is empty',
    'drafts.emptyHistoryDesc': 'History will be saved automatically when you click **Randomize**, **Reset**, or download exports.',
    'drafts.autoSaveDesc': 'Auto-saved from your last edit',
    'drafts.clearAll': 'Clear All',
    'drafts.rename': 'Rename',
    'drafts.delete': 'Delete',

    // SectionReplies / SectionComment
    'replies.add': 'Add New {type}',
    'replies.comment': 'Comment',
    'replies.reply': 'Reply',
    'replies.empty': 'No {type} yet.',
    'replies.emptyDesc': 'Click the button above to add.',
    'replies.edit': 'Edit Reply',
    'replies.duplicate': 'Duplicate',
    'replies.remove': 'Delete',
    'replies.clickToEdit': 'Click to edit this reply',

    // SectionAppearance
    'appearance.fontFamily': 'Font Family',
    'appearance.fontSize': 'Font Size',
    'appearance.padding': 'Padding',
    'appearance.borderRadius': 'Border Radius',
    'appearance.cardWidth': 'Card Width',
    'appearance.autoWidth': 'Auto Width (Auto Adjust)',
    'appearance.dropShadow': 'Drop Shadow',
    'appearance.replyBubbleColor': 'Reply Bubble Color',
    'appearance.transparentBackground': 'Transparent Background',

    // Landing Page Hero
    'landing.badge': 'The Premier UGC Creator Tool in Indonesia',
    'landing.start': 'Start Creating Comments',
    'landing.compare': 'Compare PRO Plans',
    'landing.platformsDesc': 'Supports the Most Complete Platform Layouts',
    'landing.featuresTitle': 'Developed Specifically for Creative Needs',
    'landing.featuresDesc': 'Every element is precisely designed to be pixel-perfect, resembling the original application layout.',
    'landing.stats.ugc': 'UGC Content Created',
    'landing.stats.ready': 'Ready to Use',
    'landing.stats.realistic': 'Highly Realistic Outcome',
    'landing.stats.free': 'Start for Free',

    // Landing Page Pricing
    'pricing.title': 'Subscription Pricing Plans',
    'pricing.subtitle': 'Free forever with option to upgrade to PRO Creator for unlimited results.',
    'pricing.free.title': 'Free Plan',
    'pricing.free.desc': 'Perfect for beginner creators',
    'pricing.free.price': '$0',
    'pricing.free.period': ' / forever',
    'pricing.free.feature1': 'Up to **30 Exports per day**',
    'pricing.free.feature2': 'Access to all platform layouts',
    'pricing.free.feature3': 'Full customization & multi-comment support',
    'pricing.free.feature4': 'Standard 1X image quality',
    'pricing.free.feature5': 'Subtle SocialCanvas watermark included',
    'pricing.free.btn': 'Start Free Now',

    'pricing.pro.title': 'PRO Creator Plan',
    'pricing.pro.desc': 'Perfect for Agencies & professional UGC Creators',
    'pricing.pro.price': '$1.99',
    'pricing.pro.period': ' / month',
    'pricing.pro.feature1': 'Unlimited exports with no daily limits',
    'pricing.pro.feature2': 'Ultra HD Retina quality (Super sharp 4X)',
    'pricing.pro.feature3': 'No SocialCanvas watermark',
    'pricing.pro.feature4': 'Full access to all new premium features',
    'pricing.pro.feature5': 'Cloud sync & unlimited drafts support',
    'pricing.pro.btn': 'Upgrade to PRO Now',
    'pricing.recommended': 'Recommended',

    // Preview Area Action Buttons
    'preview.randomize': 'Randomize',
    'preview.snapshot': 'Snapshot',
    'preview.export': 'Export',
    'preview.randomize.title': 'Randomize Content',
    'preview.snapshot.title': 'Take Snapshot for Comparison',

    // Modals
    'auth.title': 'Welcome Back',
    'auth.desc': 'Sign in to enable cloud sync, unlimited drafts, and PRO features.',
    'auth.successGoogle': 'Successfully logged in with Google!',
    'auth.failGoogle': 'Failed to log in with Google.',
    'auth.successRegister': 'Successfully registered!',
    'auth.successLogin': 'Successfully logged in!',
    'auth.errorAuth': 'Authentication error occurred.',
    'auth.enterEmail': 'Please enter your email.',
    'auth.successReset': 'Password reset email sent. Please check your inbox.',
    'auth.failReset': 'Failed to send password reset email.',
    'auth.successGuest': 'Logged in as Guest Account!',
    'auth.success': 'Success!',
    'auth.guestAccount': 'Guest Account',
    'auth.registeredAccount': 'Registered Account',
    'auth.sessionInfo': 'Account Session Info',
    'auth.sessionInfoDesc': 'All mockup comments you edit will be automatically saved to your local storage so they are not lost when the page is refreshed.',
    'auth.close': 'Close',
    'auth.logout': 'Logout',
    'auth.loginOrRegister': 'Login or Register',
    'auth.loginOrRegisterDesc': 'Choose your login method to activate your daily export limit.',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password',
    'auth.forgotPasswordDesc': 'Enter your account email. We will send a link to reset your password.',
    'auth.emailAddress': 'Email Address',
    'auth.sending': 'Sending...',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.creatorName': 'Creator Name',
    'auth.creatorNamePlaceholder': 'e.g. Andi Wijaya',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Minimum 6 characters',
    'auth.processing': 'Processing...',
    'auth.registerNow': 'Register Now',
    'auth.loginAccount': 'Login Account',
    'auth.or': 'Or',
    'auth.loginWithGoogle': 'Login with Google',
    'auth.continueAsGuest': 'Continue as Guest',
    'auth.importantFirebase': 'Important: Make sure you have enabled the Email/Password provider in your Firebase Console if registration fails.',
    'upgrade.title': 'Upgrade to PRO Creator',
    'upgrade.desc': 'Unlock the full potential of your content creation.',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'id') return saved;
    return 'id'; // default to Indonesian as per initial state
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translationSet = translations[language] || translations['id'];
    let text = translationSet[key] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([vKey, vVal]) => {
        text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(vVal));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
