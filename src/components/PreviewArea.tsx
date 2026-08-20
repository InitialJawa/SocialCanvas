import React, { useRef, useState, useEffect } from 'react';
import { CommentState, Platform } from '../types';
import { TikTokPreview } from './previews/TikTokPreview';
import { InstagramPreview } from './previews/InstagramPreview';
import { YouTubePreview } from './previews/YouTubePreview';
import { TwitterPreview } from './previews/TwitterPreview';
import { KickLivePreview } from './previews/KickLivePreview';
import { IGLivePreview } from './previews/IGLivePreview';
import html2canvas from 'html2canvas';
import { toPng, toCanvas } from 'html-to-image';
import { Toolbar } from './Canvas/Toolbar';
import { ExportCard } from './Canvas/ExportCard';
import { 
  TikTokColoredIcon, 
  InstagramColoredIcon, 
  YouTubeColoredIcon, 
  TwitterColoredIcon, 
  KickColoredIcon 
} from './icons';
import { motion, useMotionValue } from 'motion/react';
import { Sun, Moon, X, Trash2, Shuffle, Check, MessageSquare, Highlighter, EyeOff, Scissors, RotateCcw, Image } from 'lucide-react';
import { maleUsernames, femaleUsernames, getRandomAvatarUrl } from '../utils';

interface Props {
  state: CommentState;
  onStateChange: (state: Partial<CommentState>) => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
  incrementExportCount: () => boolean;
  exportCount: number;
  onSaveToHistory?: (state: CommentState) => void;
  editingItemId?: string | null;
  setEditingItemId?: (id: string | null) => void;
  isAddingNew?: boolean;
  setIsAddingNew?: (adding: boolean) => void;
  onAddSnapshot?: (url: string) => void;
  onRandomize?: () => void;
}

export function PreviewArea({ 
  state, 
  onStateChange, 
  isPremium, 
  onUpgradeClick, 
  incrementExportCount, 
  exportCount, 
  onSaveToHistory,
  editingItemId: propEditingItemId,
  setEditingItemId: propSetEditingItemId,
  isAddingNew: propIsAddingNew,
  setIsAddingNew: propSetIsAddingNew,
  onAddSnapshot,
  onRandomize
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [bgStyle, setBgStyle] = useState<'checkerboard' | 'solid' | 'transparent' | 'gradient'>('gradient');
  const [showHint, setShowHint] = useState(true);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const centerCanvas = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  const canvas2dCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d', { willReadFrequently: true }) : null;

  const convertColorFunctionToRgb = (colorExpr: string): string => {
    if (!colorExpr) return 'transparent';
    if (!canvas2dCtx) return '#888888';
    try {
      canvas2dCtx.fillStyle = 'rgba(0, 0, 0, 0)';
      canvas2dCtx.fillStyle = colorExpr;
      const res = canvas2dCtx.fillStyle;
      if (res && !/(oklch|oklab|lch|lab|color-mix|color\()/i.test(res)) {
        return res;
      }
    } catch {
      // ignore
    }
    return '#888888';
  };

  const sanitizeCssString = (cssText: string): string => {
    if (!cssText || !/(oklch|oklab|lch|lab|color-mix|color)\s*\(/i.test(cssText)) {
      return cssText;
    }
    let prev = '';
    let current = cssText;
    let passes = 0;
    while (current !== prev && passes < 6 && /(oklch|oklab|lch|lab|color-mix|color)\s*\(/i.test(current)) {
      prev = current;
      current = current.replace(/(oklch|oklab|lch|lab|color-mix|color)\s*\([^;{}"]+\)/gi, (match) => {
        return convertColorFunctionToRgb(match);
      });
      passes++;
    }
    return current;
  };

  const inlineComputedStyles = (sourceEl: HTMLElement, targetEl: HTMLElement) => {
    const sourceChildren = Array.from(sourceEl.querySelectorAll('*'));
    const targetChildren = Array.from(targetEl.querySelectorAll('*'));

    const sources = [sourceEl, ...sourceChildren];
    const targets = [targetEl, ...targetChildren];

    const len = Math.min(sources.length, targets.length);
    const props = [
      'color', 'background-color', 'border-color', 'border-top-color', 'border-right-color',
      'border-bottom-color', 'border-left-color', 'border-width', 'border-style', 'border-radius',
      'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
      'text-align', 'text-decoration', 'opacity', 'box-shadow', 'text-shadow', 'fill', 'stroke',
      'object-fit', 'gap', 'row-gap', 'column-gap'
    ];

    for (let i = 0; i < len; i++) {
      const src = sources[i] as HTMLElement;
      const tgt = targets[i] as HTMLElement;
      if (!src || !tgt) continue;

      try {
        const computed = window.getComputedStyle(src);
        for (const prop of props) {
          const val = computed.getPropertyValue(prop);
          if (val) {
            const cleanVal = sanitizeCssString(val);
            tgt.style.setProperty(prop, cleanVal);
          }
        }
      } catch {
        // ignore
      }
    }
  };

  const fetchImageAsBase64 = async (src: string): Promise<string> => {
    if (!src || src.startsWith('data:')) return src;
    try {
      const res = await fetch(src, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // ignore fetch error
    }
    try {
      return await new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const cvs = document.createElement('canvas');
            cvs.width = img.naturalWidth || img.width || 100;
            cvs.height = img.naturalHeight || img.height || 100;
            const ctx = cvs.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve(cvs.toDataURL('image/png'));
              return;
            }
          } catch {
            // Tainted
          }
          resolve('');
        };
        img.onerror = () => resolve('');
        img.src = src;
      });
    } catch {
      return '';
    }
  };

  const captureNodeToCanvas = async (
    targetNode: HTMLElement,
    exportScale: number,
    format: 'png' | 'jpg' | 'webp' | 'transparent'
  ): Promise<HTMLCanvasElement> => {
    // Clone node to avoid layout shifts or canvas transform issues
    const clone = targetNode.cloneNode(true) as HTMLElement;

    // Remove no-export elements
    const noExports = clone.querySelectorAll('.no-export, [data-html2canvas-ignore="true"]');
    noExports.forEach(el => el.remove());

    const rect = targetNode.getBoundingClientRect();
    const width = Math.round(targetNode.offsetWidth || rect.width || 600);
    const height = Math.round(targetNode.offsetHeight || rect.height || 400);

    // Create isolated offscreen container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.zIndex = '-9999';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.overflow = 'hidden';
    container.style.background = 'transparent';

    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      // Replace all image sources with base64 data URLs
      const images = Array.from(clone.querySelectorAll('img'));
      await Promise.all(
        images.map(async (img) => {
          const src = img.src;
          if (!src || src.startsWith('data:')) return;
          const base64 = await fetchImageAsBase64(src);
          if (base64 && base64.startsWith('data:')) {
            img.src = base64;
          } else {
            // Fallback SVG avatar placeholder if cross-origin image fails completely
            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222225"/><circle cx="50" cy="40" r="22" fill="%2344444a"/><path d="M18 88 Q50 56 82 88" fill="%2344444a"/></svg>';
          }
        })
      );

      // Inline computed styles onto cloned nodes to convert and freeze color values
      inlineComputedStyles(targetNode, clone);

      // Brief pause for layout settling
      await new Promise(r => setTimeout(r, 80));

      const isJpg = format === 'jpg';
      const canvas = await html2canvas(clone, {
        scale: exportScale || 2,
        useCORS: true,
        allowTaint: false, // CRITICAL: false to prevent DOMException on export
        backgroundColor: isJpg 
          ? (state.theme === 'dark' ? '#121212' : '#ffffff')
          : null,
        logging: false,
        width: width,
        height: height,
        onclone: (clonedDoc) => {
          // Sanitize all <style> elements in the cloned document to remove any oklch color declarations
          const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
          styleTags.forEach((style) => {
            if (style.textContent && /(oklch|oklab|lch|lab|color-mix)/i.test(style.textContent)) {
              style.textContent = sanitizeCssString(style.textContent);
            }
          });

          // Sanitize inline style attributes on all elements in clonedDoc
          const allElements = Array.from(clonedDoc.querySelectorAll('*'));
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.getAttribute && htmlEl.getAttribute('style')) {
              const styleAttr = htmlEl.getAttribute('style') || '';
              if (/(oklch|oklab|lch|lab|color-mix)/i.test(styleAttr)) {
                htmlEl.setAttribute('style', sanitizeCssString(styleAttr));
              }
            }
          });
        }
      });

      return canvas;
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  const handleExport = async (exportScale: number, format: 'png' | 'jpg' | 'webp' | 'transparent') => {
    if (!previewRef.current) return;
    
    // Check and increment export limit
    const allowed = incrementExportCount();
    if (!allowed) {
      onUpgradeClick();
      return;
    }

    // Save current design to history automatically
    if (onSaveToHistory) {
      onSaveToHistory(state);
    }
    
    setIsExporting(true);

    try {
      const canvas = await captureNodeToCanvas(previewRef.current, exportScale, format);

      const fileExt = format === 'transparent' ? 'png' : format;
      const fileName = `sosmedcomment-${state.platform}-${Date.now()}.${fileExt}`;
      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';

      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      if (!dataUrl) {
        throw new Error('Export produced empty image data');
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 300);

    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Gagal mengekspor gambar. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSnapshot = async () => {
    if (!previewRef.current || !onAddSnapshot) return;
    try {
      const canvas = await captureNodeToCanvas(previewRef.current, 1, 'png');
      const dataUrl = canvas.toDataURL('image/png');
      if (dataUrl) {
        onAddSnapshot(dataUrl);
      }
    } catch (err) {
      console.error('Failed to create snapshot:', err);
    }
  };

  // Interactive Reply and Comments Modal States
  const [localEditingItemId, localSetEditingItemId] = useState<string | null>(null);
  const [localIsAddingNew, localSetIsAddingNew] = useState(false);

  const editingItemId = propEditingItemId !== undefined ? propEditingItemId : localEditingItemId;
  const setEditingItemId = propSetEditingItemId !== undefined ? propSetEditingItemId : localSetEditingItemId;
  const isAddingNew = propIsAddingNew !== undefined ? propIsAddingNew : localIsAddingNew;
  const setIsAddingNew = propSetIsAddingNew !== undefined ? propSetIsAddingNew : localSetIsAddingNew;

  const [modalUsername, setModalUsername] = useState('');
  const [modalHandle, setModalHandle] = useState('');
  const [modalText, setModalText] = useState('');
  const [modalAvatar, setModalAvatar] = useState('');
  const [modalVerified, setModalVerified] = useState(false);
  const [modalTimestamp, setModalTimestamp] = useState('');
  const [modalLikes, setModalLikes] = useState('');
  const [modalCreatorLiked, setModalCreatorLiked] = useState(false);
  const [modalPinned, setModalPinned] = useState(false);

  const modalTextareaRef = useRef<HTMLTextAreaElement>(null);

  const applyModalFormat = (tag: string) => {
    if (!modalTextareaRef.current) return;
    const start = modalTextareaRef.current.selectionStart;
    const end = modalTextareaRef.current.selectionEnd;
    const text = modalText;
    if (start !== end) {
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + `[${tag}]` + selectedText + `[/${tag}]` + text.substring(end);
      setModalText(newText);
      
      setTimeout(() => {
        modalTextareaRef.current?.focus();
        modalTextareaRef.current?.setSelectionRange(start, start + tag.length * 2 + 5 + selectedText.length);
      }, 0);
    } else {
      alert('Tandai / blok teks balasan terlebih dahulu!');
    }
  };

  const resetModalFormat = () => {
    const newText = modalText.replace(/\[\/?(highlight|blur|cut)\]/g, '');
    setModalText(newText);
  };

  const handleReplyClick = (replyId?: string) => {
    const isMale = Math.random() > 0.5;
    const array = isMale ? maleUsernames : femaleUsernames;
    const newName = array[Math.floor(Math.random() * array.length)];
    const newHandle = `@${newName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    
    setModalUsername(newName);
    setModalHandle(newHandle);
    setModalAvatar(getRandomAvatarUrl(isMale ? 'male' : 'female'));
    setModalVerified(false);
    
    const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
    if (isLiveMode) {
      setModalText('Komentar tambahan...');
    } else {
      const replyUser = replyId ? (state.nestedReplies?.find(r => r.id === replyId)?.username || state.username) : state.username;
      setModalText(`@${replyUser.replace(/\s+/g, '').toLowerCase()} `);
    }
    
    setModalTimestamp('1j lalu');
    setModalLikes('0');
    setModalCreatorLiked(false);
    setModalPinned(false);
    
    setIsAddingNew(true);
    setEditingItemId(null);
  };

  const handleEditReply = (itemId: string) => {
    const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
    const listKey = isLiveMode ? 'additionalComments' : 'nestedReplies';
    const items = state[listKey] || [];
    const item = (items as any[]).find((i: any) => i.id === itemId);
    if (!item) return;

    setEditingItemId(itemId);
    setIsAddingNew(false);
    setModalUsername(item.username || '');
    setModalHandle(item.handle || '');
    setModalAvatar(item.avatarUrl || '');
    setModalVerified(item.isVerified || false);
    setModalText(item.commentText || '');
    setModalTimestamp(item.timestamp || '1j lalu');
    setModalLikes(item.likeCount || '0');
    setModalCreatorLiked(item.creatorLiked || false);
    setModalPinned(item.isPinned || false);
  };

  const handleSaveModal = () => {
    const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
    const listKey = isLiveMode ? 'additionalComments' : 'nestedReplies';
    const items = [...(state[listKey] || [])];

    if (isAddingNew) {
      const id = Math.random().toString(36).substring(7);
      const newItem = isLiveMode ? {
        id,
        username: modalUsername,
        avatarUrl: modalAvatar,
        isVerified: modalVerified,
        commentText: modalText,
        handle: modalHandle,
        timestamp: modalTimestamp,
        likeCount: modalLikes,
        creatorLiked: modalCreatorLiked,
        isPinned: modalPinned,
      } : {
        id,
        username: modalUsername,
        handle: modalHandle,
        avatarUrl: modalAvatar,
        isVerified: modalVerified,
        commentText: modalText,
        timestamp: modalTimestamp,
        likeCount: modalLikes,
        creatorLiked: modalCreatorLiked,
        isPinned: modalPinned,
      };
      onStateChange({ [listKey]: [...items, newItem] });
    } else if (editingItemId) {
      const updated = items.map((item: any) => {
        if (item.id === editingItemId) {
          return isLiveMode ? {
            ...item,
            username: modalUsername,
            avatarUrl: modalAvatar,
            isVerified: modalVerified,
            commentText: modalText,
            handle: modalHandle,
            timestamp: modalTimestamp,
            likeCount: modalLikes,
            creatorLiked: modalCreatorLiked,
            isPinned: modalPinned,
          } : {
            ...item,
            username: modalUsername,
            handle: modalHandle,
            avatarUrl: modalAvatar,
            isVerified: modalVerified,
            commentText: modalText,
            timestamp: modalTimestamp,
            likeCount: modalLikes,
            creatorLiked: modalCreatorLiked,
            isPinned: modalPinned,
          };
        }
        return item;
      });
      onStateChange({ [listKey]: updated });
    }

    // Reset states
    setIsAddingNew(false);
    setEditingItemId(null);
  };

  const handleDeleteModal = () => {
    if (!editingItemId) return;
    const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
    const listKey = isLiveMode ? 'additionalComments' : 'nestedReplies';
    const items = state[listKey] || [];
    const filtered = items.filter((item: any) => item.id !== editingItemId);
    onStateChange({ [listKey]: filtered });
    setIsAddingNew(false);
    setEditingItemId(null);
  };

  const handleRandomizeProfile = () => {
    const isMale = Math.random() > 0.5;
    const array = isMale ? maleUsernames : femaleUsernames;
    const name = array[Math.floor(Math.random() * array.length)];
    const handle = `@${name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    setModalUsername(name);
    setModalHandle(handle);
    setModalAvatar(getRandomAvatarUrl(isMale ? 'male' : 'female'));
  };

  const getPreviewComponent = () => {
    const props = {
      state,
      onReplyClick: handleReplyClick,
      onEditReply: handleEditReply
    };

    switch (state.platform) {
      case 'tiktok': return <TikTokPreview {...props} />;
      case 'instagram': return state.instagramTemplate === 'live' ? <IGLivePreview {...props} /> : <InstagramPreview {...props} />;
      case 'youtube': return <YouTubePreview {...props} />;
      case 'twitter': return <TwitterPreview {...props} />;
      case 'kick_live': return <KickLivePreview {...props} />;
      default: return null;
    }
  };

  const getFontFamilyStyle = () => {
    switch (state.fontFamily) {
      case 'roboto': return { fontFamily: '"Roboto", sans-serif' };
      case 'inter': return { fontFamily: '"Inter", sans-serif' };
      case 'space-grotesk': return { fontFamily: '"Space Grotesk", sans-serif' };
      case 'playfair-display': return { fontFamily: '"Playfair Display", serif' };
      case 'poppins': return { fontFamily: '"Poppins", sans-serif' };
      case 'jetbrains-mono': return { fontFamily: '"JetBrains Mono", monospace' };
      case 'san-francisco': return { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
      default: return {};
    }
  };

  // Handle Mouse Wheel Zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(s => Math.min(Math.max(0.25, s + delta), 3));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-4.5 h-4.5" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-5 h-5" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-5 h-5" /> },
    { id: 'twitter', label: 'Twitter / X', icon: <TwitterColoredIcon className="w-5 h-5" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-4 h-4 text-[10px]" /> },
  ];

  return (
    <div className="flex-1 w-full flex flex-col glass-panel rounded-lg shadow-xl overflow-hidden relative bg-[var(--root-bg)]">
      {/* Top Header Row */}
      <div className="flex flex-row justify-between items-center gap-2 p-2 sm:p-3 border-b border-[var(--panel-border)] bg-[var(--panel-bg)]/30 z-20 shrink-0">
        {/* Platform Dock */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto custom-scrollbar max-w-[60%]">
           {platforms.map((p) => {
             const isActive = state.platform === p.id;
             return (
               <button
                 key={p.id}
                 onClick={() => onStateChange({ platform: p.id })}
                 className={`relative flex items-center justify-center shrink-0 p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                   isActive 
                     ? 'bg-[var(--root-bg)] shadow-sm text-[var(--root-fg)] border border-[var(--panel-border)]' 
                     : 'text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)]/40 border border-transparent'
                 }`}
                 title={`Switch to ${p.label}`}
               >
                 <span className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center transition-transform ${isActive ? 'scale-110' : 'opacity-80'}`}>
                   {p.icon}
                 </span>
               </button>
             );
           })}
        </div>
        
        {/* Action Buttons: Randomize, Snapshot, and Export */}
        <div className="flex flex-nowrap items-center justify-end gap-1.5 shrink-0">
          <button
            onClick={onRandomize}
            className="flex items-center justify-center w-8 h-8 lg:w-auto lg:h-auto lg:px-3 lg:py-1.5 bg-[var(--root-bg)] border border-[var(--panel-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer select-none"
            title="Randomize Content"
          >
            <Shuffle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span className="hidden lg:inline lg:ml-1.5">Randomize</span>
          </button>
          <button
            onClick={handleSnapshot}
            className="flex items-center justify-center w-8 h-8 lg:w-auto lg:h-auto lg:px-3 lg:py-1.5 bg-[var(--root-bg)] border border-[var(--panel-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer select-none"
            title="Quick Snapshot"
          >
            <Image className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span className="hidden lg:inline lg:ml-1.5">Snapshot</span>
          </button>
          
          <ExportCard 
            onExport={handleExport} 
            isExporting={isExporting} 
            isPremium={isPremium}
            exportCount={exportCount}
            onUpgradeClick={onUpgradeClick}
          />
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 ${
          bgStyle === 'solid' 
            ? 'bg-[var(--root-bg)]' 
            : bgStyle === 'gradient'
              ? 'bg-gradient-to-br from-[#15171c] via-[#23262d] to-[#0c0e12]'
              : ''
        }`}
        style={bgStyle === 'transparent' ? {
          backgroundColor: '#ffffff',
          backgroundImage: 'repeating-linear-gradient(45deg, #e5e5e5 25%, transparent 25%, transparent 75%, #e5e5e5 75%, #e5e5e5), repeating-linear-gradient(45deg, #e5e5e5 25%, #ffffff 25%, #ffffff 75%, #e5e5e5 75%, #e5e5e5)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px'
        } : {}}
      >
        {/* Figma like checkerboard via CSS class or inline style */}
        {bgStyle === 'checkerboard' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, var(--panel-border) 25%, transparent 25%, transparent 75%, var(--panel-border) 75%, var(--panel-border)), repeating-linear-gradient(45deg, var(--panel-border) 25%, var(--root-bg) 25%, var(--root-bg) 75%, var(--panel-border) 75%, var(--panel-border))',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}></div>
        )}

        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, var(--root-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--root-fg) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        )}

        <motion.div
          drag
          dragMomentum={false}
          style={{ x, y, scale }}
          className="relative z-10 flex justify-center items-center"
        >
          <div 
            ref={previewRef} 
            className={`flex justify-center transition-shadow preview-card-font ${state.hasDropShadow ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]' : ''}`}
            style={getFontFamilyStyle()}
          >
             {getPreviewComponent()}
          </div>
        </motion.div>

        {/* Beautiful Floating Inline Editor Modal for Nest Replies / Live Comments */}
        {(isAddingNew || editingItemId) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md max-h-full flex flex-col bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--root-fg)] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-2.5 sm:p-3.5 border-b border-[var(--panel-border)] bg-[var(--root-bg)]/40 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm">
                    {isAddingNew ? 'Balasan Baru' : 'Edit Balasan'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleRandomizeProfile}
                    title="Acak Profil"
                    className="ml-1 sm:ml-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)] rounded-md hover:bg-[var(--accent)]/20 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={() => { setIsAddingNew(false); setEditingItemId(null); }}
                  className="p-1 sm:p-1.5 hover:bg-[var(--button-hover)] rounded-md transition text-[var(--text-muted)] hover:text-[var(--root-fg)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3 flex-1 overflow-y-auto custom-scrollbar">
                {/* Profile row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Username</label>
                    <input 
                      type="text" 
                      value={modalUsername} 
                      onChange={(e) => setModalUsername(e.target.value)}
                      placeholder="username"
                      className="w-full text-xs py-1.5 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)]"
                    />
                  </div>
                  {!(state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live')) && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Handle / Tag</label>
                      <input 
                        type="text" 
                        value={modalHandle} 
                        onChange={(e) => setModalHandle(e.target.value)}
                        placeholder="@handle"
                        className="w-full text-xs py-1.5 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)]"
                      />
                    </div>
                  )}
                </div>

                {/* Avatar URL input */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Avatar URL</label>
                  <div className="flex gap-2 items-center">
                    {modalAvatar && (
                      <img src={modalAvatar} alt="preview" className="w-7 h-7 rounded-full border border-[var(--panel-border)] object-cover bg-[var(--root-bg)] shrink-0" />
                    )}
                    <input 
                      type="text" 
                      value={modalAvatar} 
                      onChange={(e) => setModalAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs py-1.5 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)]"
                    />
                  </div>
                </div>

                {/* Comment Textarea with emoji selection and styling toolbar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Isi Balasan</label>
                    <div className="flex gap-0.5 bg-[var(--root-bg)] p-0.5 rounded border border-[var(--panel-border)]">
                      {['👍', '❤️', '😂', '🔥', '😭'].map(emoji => (
                        <button 
                          key={emoji}
                          type="button"
                          onClick={() => setModalText(modalText + emoji)}
                          className="text-xs hover:bg-[var(--button-hover)] w-5 h-5 rounded flex items-center justify-center transition cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    ref={modalTextareaRef}
                    value={modalText} 
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="Tulis balasan..."
                    rows={2}
                    className="w-full text-xs py-2 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)] resize-none"
                    autoFocus
                  />
                  
                  {/* Advanced Formatting Toolbar inside modal */}
                  <div className="flex items-center justify-between bg-[var(--root-bg)] border border-[var(--panel-border)] rounded p-1 mt-1">
                    <div className="flex gap-1">
                      <button 
                        title="Highlight" 
                        type="button" 
                        onMouseDown={(e) => { e.preventDefault(); applyModalFormat('highlight'); }} 
                        className="w-6 h-6 rounded hover:bg-[var(--button-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] transition cursor-pointer"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        title="Blur" 
                        type="button" 
                        onMouseDown={(e) => { e.preventDefault(); applyModalFormat('blur'); }} 
                        className="w-6 h-6 rounded hover:bg-[var(--button-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-blue-500 transition cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        title="Cut" 
                        type="button" 
                        onMouseDown={(e) => { e.preventDefault(); applyModalFormat('cut'); }} 
                        className="w-6 h-6 rounded hover:bg-[var(--button-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition cursor-pointer"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="w-[1px] h-3 bg-[var(--panel-border)] mx-1" />
                    <button 
                      title="Reset Formatting" 
                      type="button" 
                      onClick={resetModalFormat} 
                      className="w-6 h-6 rounded hover:bg-[var(--button-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--root-fg)] transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional items for normal comment templates only */}
                {!(state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live')) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Timestamp</label>
                      <input 
                        type="text" 
                        value={modalTimestamp} 
                        onChange={(e) => setModalTimestamp(e.target.value)}
                        placeholder="1j lalu"
                        className="w-full text-xs py-1.5 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Likes</label>
                      <input 
                        type="text" 
                        value={modalLikes} 
                        onChange={(e) => setModalLikes(e.target.value)}
                        placeholder="2.4K"
                        className="w-full text-xs py-1.5 px-2.5 rounded bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/50 outline-none transition text-[var(--root-fg)]"
                      />
                    </div>
                  </div>
                )}

                {/* Switches / Checkboxes */}
                <div className="flex flex-wrap gap-2.5 bg-[var(--root-bg)]/50 p-2.5 rounded border border-[var(--panel-border)]">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-[var(--root-fg)]/80 hover:text-[var(--root-fg)]">
                    <input 
                      type="checkbox" 
                      checked={modalVerified} 
                      onChange={(e) => setModalVerified(e.target.checked)}
                      className="rounded border-[var(--panel-border)] bg-[var(--root-bg)] w-3.5 h-3.5 text-[var(--accent)] focus:ring-0 cursor-pointer"
                    />
                    <span>Verified</span>
                  </label>

                  {!(state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live')) && (
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-[var(--root-fg)]/80 hover:text-[var(--root-fg)]">
                      <input 
                        type="checkbox" 
                        checked={modalCreatorLiked} 
                        onChange={(e) => setModalCreatorLiked(e.target.checked)}
                        className="rounded border-[var(--panel-border)] bg-[var(--root-bg)] w-3.5 h-3.5 text-[var(--accent)] focus:ring-0 cursor-pointer"
                      />
                      <span>Liked</span>
                    </label>
                  )}

                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-[var(--root-fg)]/80 hover:text-[var(--root-fg)]">
                    <input 
                      type="checkbox" 
                      checked={modalPinned} 
                      onChange={(e) => setModalPinned(e.target.checked)}
                      className="rounded border-[var(--panel-border)] bg-[var(--root-bg)] w-3.5 h-3.5 text-[var(--accent)] focus:ring-0 cursor-pointer"
                    />
                    <span>Pinned</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-[var(--panel-border)] bg-[var(--root-bg)]/40 gap-2 shrink-0">
                <div>
                  {!isAddingNew && (
                    <button
                      type="button"
                      onClick={handleDeleteModal}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/10 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingItemId(null); }}
                    className="text-xs font-semibold py-2 px-4 rounded-lg hover:bg-[var(--button-hover)] text-[var(--text-muted)] hover:text-[var(--root-fg)] cursor-pointer transition border border-[var(--panel-border)]"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModal}
                    className="flex items-center gap-1.5 text-xs font-bold py-2 px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] cursor-pointer transition shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Footer Toolbar */}
      <div className="flex flex-row justify-center items-center p-2 border-t border-[var(--panel-border)] bg-[var(--panel-bg)]/30 z-20 shrink-0">
        <Toolbar 
          scale={scale} 
          setScale={setScale} 
          showGrid={showGrid} 
          setShowGrid={setShowGrid} 
          centerCanvas={centerCanvas} 
          cardTheme={state.theme}
          onCardThemeChange={(theme) => onStateChange({ theme })}
        />
      </div>

      {/* Canvas Status Bar */}
      <div className="h-8 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] flex items-center px-4 justify-between text-[11px] text-[var(--text-muted)] shrink-0 select-none relative z-30">
        <div className="flex gap-4 items-center">
          <span>{Math.round(scale * 100)}%</span>
          <span className="opacity-30">|</span>
          <button 
            onClick={() => {
              const styles: ('checkerboard' | 'solid' | 'transparent' | 'gradient')[] = ['gradient', 'checkerboard', 'solid', 'transparent'];
              const nextIndex = (styles.indexOf(bgStyle) + 1) % styles.length;
              setBgStyle(styles[nextIndex]);
            }}
            className="hover:text-[var(--root-fg)] transition-colors cursor-pointer flex items-center gap-1.5 group"
            title="Cycle background style"
          >
            <span>Background</span>
            <span className="bg-[var(--button-hover)] text-[var(--root-fg)] px-1.5 py-0.5 rounded text-[11px] font-semibold group-hover:text-[var(--accent)] transition-all">
              {bgStyle}
            </span>
          </button>
          <span className="opacity-30">|</span>
          <span>Auto Saved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
