import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Shield, Zap, CreditCard, Flame, Video, Award, RefreshCw, Crown } from 'lucide-react';
import { Button } from './ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  isPremium: boolean;
  onDowngrade: () => void;
  exportCount: number;
}

export function UpgradeModal({ isOpen, onClose, onUpgradeSuccess, isPremium, onDowngrade, exportCount }: Props) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({ name: '', email: '', cardNumber: '4111 2222 3333 4444', expiry: '12/28', cvc: '123' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartPayment = () => {
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onUpgradeSuccess();
    }, 2000);
  };

  const features = [
    { title: 'Unlimited Exports', desc: 'Ekspor tanpa batas harian (bebas dari limit 30 per hari).', icon: <Flame className="w-4 h-4 text-[var(--accent)] shrink-0" /> },
    { title: 'Resolusi Ultra HD (4x)', desc: 'Hasil tangkapan layar super tajam hingga 4x untuk layar retina.', icon: <Award className="w-4 h-4 text-[var(--accent)] shrink-0" /> },
    { title: 'Video Animasi (Segera Hadir)', desc: 'Akses eksklusif untuk ekspor format video MP4/WebM dengan animasi IN dan OUT.', icon: <Video className="w-4 h-4 text-[var(--accent)] shrink-0" /> },
    { title: 'Bebas Watermark & Iklan', desc: 'Screenshot murni, bersih, profesional untuk konten komersial.', icon: <Shield className="w-4 h-4 text-emerald-500 shrink-0" /> },
    { title: 'Prioritas Fitur Baru', desc: 'Request layout platform khusus langsung ditangani prioritas.', icon: <Crown className="w-4 h-4 text-[var(--accent)] shrink-0" /> },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-lg max-h-full bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-2xl rounded-3xl overflow-y-auto custom-scrollbar z-10 text-[var(--root-fg)]"
        >
          {/* Top colored accent line */}
          <div className="h-1.5 bg-[var(--accent)] w-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-[var(--button-hover)] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'details' && (
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--accent)]/10 mb-3 uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  SocialCanvas PRO Creator
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">Kembangkan Kontenmu Tanpa Batas</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5">
                  Akses fitur eksklusif dirancang khusus untuk UGC Creator Indonesia handal.
                </p>
              </div>

              {/* Pricing teaser */}
              <div className="bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-2xl p-4.5 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-10px] w-24 h-24 bg-[var(--accent)]/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <h4 className="font-bold text-sm">PRO Creator Access</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Berlangganan bulanan / cancel kapan saja</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-muted)] line-through">Rp 199.000</div>
                  <div className="text-xl font-black text-[var(--accent)]">Rp 49.000<span className="text-xs font-normal text-[var(--text-muted)]">/bln</span></div>
                </div>
              </div>

              {/* Features list */}
              <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3 text-left">
                    <div className="mt-0.5 bg-[var(--root-bg)] border border-[var(--panel-border)] p-1.5 rounded-lg">
                      {f.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[var(--root-fg)]">{f.title}</h5>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="flex flex-col gap-2.5 mt-2">
                {isPremium ? (
                  <div className="flex flex-col gap-2 text-center">
                    <div className="text-xs text-emerald-500 font-bold flex items-center justify-center gap-1.5 bg-emerald-500/10 p-2.5 border border-emerald-500/15 rounded-xl">
                      <Check className="w-4 h-4" /> Anda sudah memiliki paket PRO Creator!
                    </div>
                    <Button variant="danger" onClick={() => { onDowngrade(); onClose(); }} className="h-10 text-xs font-bold gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Kembalikan ke Akun Free (Simulasi)
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleStartPayment}
                    className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] shadow-lg text-sm font-bold gap-2 rounded-lg"
                  >
                    <Zap className="w-4 h-4 fill-white text-white" />
                    Berlangganan Sekarang — Rp 49K
                  </Button>
                )}
                <p className="text-xs text-center text-[var(--text-muted)]">
                  Jalur pembayaran aman & terenskripsi. Batalkan langganan kapan pun di menu setelan.
                </p>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Simulasi Pembayaran (Jalur Siap)</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5">
                  Ini adalah simulasi gerbang pembayaran premium SocialCanvas.
                </p>
              </div>

              {/* Form details */}
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-xs text-[var(--accent)]">
                  <p className="font-semibold">Simulasi Sandbox Aktif</p>
                  <p className="mt-1 opacity-90">Klik tombol di bawah untuk menyimulasikan transaksi pembayaran sukses melalui Stripe / Midtrans.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Nama Pemegang Kartu</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name || 'UGC Creator Depok'}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[var(--accent)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Nomor Kartu (Mock)</label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Expired</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs text-center outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                        className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs text-center outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <Button variant="secondary" onClick={() => setStep('details')} disabled={isProcessing} className="flex-1 h-11 text-xs font-bold rounded-xl">
                  Kembali
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      Simulasi Bayar Rp 49.000
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5">
              {/* Animated check circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.8, 1] }}
                className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-8 h-8" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-emerald-500">Pembayaran Sukses!</h3>
                <p className="text-xs text-[var(--root-fg)] font-semibold mt-1">Akun Anda Kini Berstatus PRO Creator ✨</p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto mt-2">
                  Terima kasih banyak atas dukungannya! Sekarang Anda memiliki akses ekspor tanpa batas harian dan fitur pratinjau kualitas tinggi retina.
                </p>
              </div>

              {/* Info summary */}
              <div className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-2xl p-4.5 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">No. Transaksi</span>
                  <span className="font-semibold font-mono text-[var(--root-fg)]">DK-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--panel-border)] pt-2 mt-2">
                  <span className="text-[var(--text-muted)]">Paket Aktif</span>
                  <span className="font-bold text-[var(--accent)] flex items-center gap-1">PRO Creator Access</span>
                </div>
                <div className="flex justify-between border-t border-[var(--panel-border)] pt-2">
                  <span className="text-[var(--text-muted)]">Batas Ekspor Harian</span>
                  <span className="font-bold text-emerald-500">Tanpa Batas (Unlimited)</span>
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="primary"
                onClick={onClose}
                className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-bold rounded-lg"
              >
                Mulai Menggunakan PRO
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
