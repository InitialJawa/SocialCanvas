import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Button, Select, Label } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onExport: (scale: number, format: 'png' | 'jpg' | 'webp' | 'transparent') => Promise<void>;
  isExporting: boolean;
  isPremium: boolean;
  exportCount: number;
  onUpgradeClick: () => void;
}

export function ExportCard({ onExport, isExporting, isPremium, exportCount, onUpgradeClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp' | 'transparent'>('png');
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    await onExport(scale, format);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <>
      {/* Collapsible Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-lg shadow-md transition-all cursor-pointer select-none"
      >
        <Download className="w-4 h-4 text-[var(--accent)]" />
        <span>Export</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Export Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-[110%] right-0 w-[280px] bg-[var(--panel-bg)]/95 backdrop-blur-xl border border-[var(--panel-border)] shadow-xl rounded-lg p-4 z-30 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-[var(--root-fg)] font-semibold text-sm">
              <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
              Export Options
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5">Scale</Label>
                <Select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="py-1.5 text-xs">
                  <option value={1}>1x</option>
                  <option value={2}>2x (Retina)</option>
                  <option value={4}>4x (Ultra)</option>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">Format</Label>
                <Select value={format} onChange={(e) => setFormat(e.target.value as any)} className="py-1.5 text-xs">
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="transparent">Transparent PNG</option>
                </Select>
              </div>
            </div>

            <Button 
              variant="primary" 
              onClick={handleExport}
              disabled={isExporting || success}
              className="w-full relative overflow-hidden transition-all duration-300 h-10"
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isExporting ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${success ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <CheckCircle2 className="w-4 h-4" /> Exported
              </div>
              <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${!isExporting && !success ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <Download className="w-4 h-4" /> Export Asset
              </div>
            </Button>

            {/* Daily Export Limit Progress Info */}
            <div className="pt-3 border-t border-[var(--panel-border)]/60 mt-1 select-none">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                <span>BATAS EKSPOR HARIAN</span>
                <span>{isPremium ? 'PRO (Tanpa Batas)' : `${exportCount} / 30`}</span>
              </div>
              {!isPremium ? (
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-[var(--root-bg)] rounded-full overflow-hidden border border-[var(--panel-border)]/50">
                    <div 
                      className="h-full rounded-full transition-all duration-500 bg-[var(--accent)]"
                      style={{ width: `${Math.min(100, (exportCount / 30) * 100)}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      onUpgradeClick();
                    }}
                    className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors w-full text-center block hover:underline cursor-pointer"
                  >
                    Dapatkan Ekspor Tanpa Batas (PRO) →
                  </button>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 justify-center py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Keanggotaan PRO Anda Aktif
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
