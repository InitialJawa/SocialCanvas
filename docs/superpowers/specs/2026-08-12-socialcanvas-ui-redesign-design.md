# Spec: Redesign UI SocialCanvas — Minimalis Linear

- **Tanggal**: 12 Agustus 2026
- **Repo**: `InitialJawa/SocialCanvas` (React 19 + Vite 6 + Tailwind v4 + lucide-react + motion)
- **Tujuan**: Redesign UI agar lebih modern dan simpel, gaya minimalis bersih ala Linear/Vercel, dark-first, aksen amber lembut.
- **Cakupan**: Visual + tata letak. SEMUA fitur & konfigurasi tetap. Komponen preview 6 platform (TikTok/Instagram/YouTube/X/Kick) TIDAK diubah.

## Keputusan Desain

| Aspek | Keputusan |
|---|---|
| Arah visual | Minimalis bersih (Linear/Vercel) |
| Cakupan | Semua halaman (landing + editor) |
| Tingkat perubahan | Visual + tata letak, fitur tetap |
| Tema default | Dark-first (toggle light tetap) |
| Label mono-label mikro | Buang total |
| Warna accent | Amber lembut (satu accent, per tema) |
| Font UI | Inter (default). Mono hanya untuk angka zoom. |
| Preview platform | Tidak disentuh |

## 1. Design System — `src/index.css`

- Font: `--font-sans: "Inter", ...`. Mono tetap JetBrains Mono.
- Palet dark (default):
  - `--root-bg: #0B0B0D`
  - `--panel-bg: #131316`
  - `--root-fg: #ECEDEF`
  - `--text-muted: #8B8B93`
  - `--panel-border: rgba(255,255,255,0.08)`
  - `--accent: #FFB13D` (amber lembut)
  - `--accent-hover: #FFC56A`
- Palet light (toggle):
  - `--root-bg: #FAFAFA`
  - `--root-fg: #111111`
  - `--text-muted: #6E6E76`
  - `--panel-border: rgba(0,0,0,0.08)`
  - `--accent: #B45309`
  - `--accent-hover: #92400E`
- Token `--panel-bg-translucent`, `--button-bg`, `--button-hover`, `--input-bg`, `--rail`, `--sidebar-*`, `--card-glow`, `--record` dipertahankan agar semua komponen tetap berfungsi.
- Hapus `.mono-label` dan class glow (`.bg-glow-blob-1/2`) — hapus juga pemakaiannya di komponen. Pertahankan `.glass-panel`, `.hairline`, scrollbar, dan `.preview-card-font`.

## 2. UI Primitives — `src/components/ui.tsx`

- `Label`: `block text-xs font-semibold text-[var(--text-muted)] mb-2` (tanpa uppercase/tracking).
- `Input`/`Select`/`Textarea`: border tipis `var(--panel-border)`, `rounded-lg`, `bg-[var(--root-bg)]`, focus ring halus accent, `py-2.5`.
- `Button`: variant `primary` (accent solid), `secondary` (outline), `danger`, `ghost`. Radius konsisten `rounded-lg`, font normal `text-sm`.

## 3. Header & Branding

- Wordmark logo + "SocialCanvas" (label teks normal, bukan mono-label tracking-widest).
- Aksi header: Home (icon saja), language toggle (ID/EN), theme toggle, akun user / tombol login. Tetap ringkas.

## 4. Landing Page — `src/components/LandingPage.tsx`

- Badge pill kecil non-transparan → judul besar `font-semibold` (6xl), subtitle muted, 2 CTA.
- Ganti "Channel Strip" (CH01-05, `5 CH`) dengan kartu platform bersih: ikon + nama, klik → editor route. Tanpa label segment mono.
- Features grid 2 kolom tanpa label `CLIP·A`: ikon dalam kotak + judul + deskripsi.
- Hapus semua dekorasi mono-label (`UGC_01 READY`, `ASSETS · 05 CLIPS`, dll).
- Halaman Terms & Privacy ikut dirapikan visualnya.

## 5. Editor — `src/App.tsx`

- Hapus 2 glow blob di background editor.
- Layout tetap: sidebar kiri (props) + preview kanan, drag-handle mobile tetap.
- Footer disclaimer: teks normal kecil, hapus baris "Premium Output Enabled" / mono-label.

## 6. Sidebar — `src/components/Sidebar.tsx` + `Sidebar/*`

- 4 tab (Comment/Engagement/Advanced/Gallery): tab pill halus (background pill + ikon opsional), heading normal.
- Heading section: `text-xs font-bold` normal (bukan mono-label uppercase 10px).
- Kontrol diberi ruang lega; label pakai primitives baru.
- Semua text-`[10px]`/mono-label pada kontrol diganti teks normal.

## 7. Preview & Toolbar

- `PlatformSelector`: icons platform tetap, container ringkas.
- `PreviewArea`: tombol Randomize/Snapshot + platform picker atas; hapus teks mikro yang tidak perlu.
- `Toolbar` (Canvas/Toolbar.tsx): zoom/theme/grid — icon buttons rapi, label `%` teks normal.
- `ExportCard`: bersihkan `text-[10px]` jadi `text-xs`, label normal.

## Tidak Diubah

- Logika state (types, utils, LanguageContext).
- Komponen `previews/*` (TikTokPreview, InstagramPreview, YouTubePreview, TwitterPreview, KickLivePreview, IGLivePreview).
- Fitur SaaS: Auth, Upgrade/Premium, Draft/History/Snapshot (Firestore + localStorage).

## File yang Diubah

- `src/index.css`
- `src/components/ui.tsx`
- `src/components/Header.tsx`
- `src/components/CapybaraLogo.tsx`
- `src/components/LandingPage.tsx`
- `src/components/App` (`src/App.tsx`)
- `src/components/Sidebar.tsx`
- `src/components/Sidebar/Accordion.tsx`
- `src/components/Sidebar/SectionBasic.tsx`
- `src/components/Sidebar/SectionAppearance.tsx`
- `src/components/Sidebar/SectionComment.tsx`
- `src/components/Sidebar/SectionReplies.tsx`
- `src/components/PreviewArea.tsx`
- `src/components/PlatformSelector.tsx`
- `src/components/Canvas/Toolbar.tsx`
- `src/components/Canvas/ExportCard.tsx`

## Verifikasi

- `npm run build` sukses (vite build).
- `npm run lint` (= `tsc --noEmit`) bersih.
- Preview platform & alur editor tetap berfungsi.