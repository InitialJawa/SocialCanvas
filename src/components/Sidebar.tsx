import React from 'react';
import { CommentState, DraftItem, HistoryItem } from '../types';
import { SectionAppearance } from './Sidebar/SectionAppearance';
import { SectionReplies } from './Sidebar/SectionReplies';
import { Label, Input, Textarea, Button, Select } from './ui';
import { 
  Shuffle, RotateCcw, Sliders, MessageSquare, Palette, MessageCircle, 
  Sparkles, FolderHeart, Image, Highlighter, EyeOff, Scissors, Trash2,
  Heart, Pin, BadgeCheck, HelpCircle, User, Type, Clock,
  Cloud, CloudOff, Copy, Search, Plus, Edit, Edit2, Loader2, Check
} from 'lucide-react';
import { maleUsernames, femaleUsernames, getRandomAvatarUrl } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
  onReset?: () => void;
  isPremium: boolean;
  exportCount: number;
  onUpgradeClick: () => void;
  drafts: DraftItem[];
  history: HistoryItem[];
  onSaveDraft: (name: string, state: CommentState) => void;
  onDeleteDraft: (id: string) => void;
  onRenameDraft: (id: string, newName: string) => void;
  onClearHistory: () => void;
  onEditReply?: (id: string) => void;
  onAddReply?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  snapshots: {id: string, url: string, timestamp: string, name?: string}[];
  onDeleteSnapshot: (id: string) => void;
  onDeleteSnapshots?: (ids: string[]) => void;
  onRenameSnapshot?: (id: string, newName: string) => void;
}

export function Sidebar({ 
  state, 
  onChange, 
  onReset, 
  isPremium, 
  exportCount, 
  onUpgradeClick,
  drafts,
  history,
  onSaveDraft,
  onDeleteDraft,
  onRenameDraft,
  onClearHistory,
  onEditReply,
  onAddReply,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  snapshots,
  onDeleteSnapshot,
  onDeleteSnapshots,
  onRenameSnapshot
}: Props) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'comment' | 'engagement' | 'advanced' | 'gallery'>('comment');
  const [selectedSnapshotIds, setSelectedSnapshotIds] = React.useState<string[]>([]);
  
  // Gallery Sub-tabs and actions state
  const [gallerySubTab, setGallerySubTab] = React.useState<'workspace' | 'snapshots' | 'history'>('workspace');
  const [draftSearch, setDraftSearch] = React.useState('');
  const [editingSnapshotId, setEditingSnapshotId] = React.useState<string | null>(null);
  const [editingSnapshotName, setEditingSnapshotName] = React.useState('');
  const [comparingSnapshotId, setComparingSnapshotId] = React.useState<string | null>(null);
  const [compareWithId, setCompareWithId] = React.useState<string>('live');
  const [viewingHistoryItem, setViewingHistoryItem] = React.useState<HistoryItem | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [editingDraftId, setEditingDraftId] = React.useState<string | null>(null);
  const [editingDraftName, setEditingDraftName] = React.useState('');
  const [isSyncingGlobal, setIsSyncingGlobal] = React.useState(false);

  // Virtualization state and helpers for history list (when items exceed 100)
  const ITEM_HEIGHT = 110;
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const containerHeight = 500; // estimated available height
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + 3; // +3 buffer
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 1);
  const endIndex = Math.min(history.length, startIndex + visibleCount);

  const visibleItems = history.slice(startIndex, endIndex);
  const totalHeight = history.length * ITEM_HEIGHT;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setSelectedSnapshotIds(prev => prev.filter(id => snapshots.some(s => s.id === id)));
  }, [snapshots]);

  const triggerStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 2500);
  };

  const handleDuplicateDraft = (d: DraftItem) => {
    onSaveDraft(`${d.name} (Copy)`, d.state);
    triggerStatus(language === 'id' ? `Draf "${d.name}" berhasil diduplikasi!` : `Draft "${d.name}" successfully duplicated!`);
  };

  const handleManualSync = () => {
    if (!isPremium) return;
    setIsSyncingGlobal(true);
    setTimeout(() => {
      setIsSyncingGlobal(false);
      triggerStatus(language === 'id' ? 'Sinkronisasi cloud berhasil!' : 'Cloud sync successful!');
    }, 1200);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return language === 'id' ? 'Baru saja' : 'Just now';
    }
  };

  const getHistoryItemDescription = (item: HistoryItem, prevItem?: HistoryItem) => {
    const isIndonesian = language === 'id';
    const base = prevItem ? prevItem.state : state;
    const current = item.state;
    
    if (current.commentText !== base.commentText) return isIndonesian ? 'Mengubah teks komentar' : 'Updated comment text';
    if (current.username !== base.username) return isIndonesian ? 'Mengubah nama pengguna' : 'Updated username';
    if (current.platform !== base.platform) return isIndonesian ? `Beralih platform ke ${current.platform}` : `Switched platform to ${current.platform}`;
    if (current.fontSize !== base.fontSize) return isIndonesian ? 'Mengubah ukuran font' : 'Changed font size';
    if (current.fontFamily !== base.fontFamily) return isIndonesian ? 'Mengubah jenis font' : 'Changed font family';
    if (current.theme !== base.theme) return isIndonesian ? `Mengubah tema ke ${current.theme}` : `Changed theme to ${current.theme}`;
    if (current.likeCount !== base.likeCount) return isIndonesian ? 'Memperbarui jumlah suka' : 'Updated likes count';
    if (current.isVerified !== base.isVerified) return isIndonesian ? 'Mengubah lencana verifikasi' : 'Toggled verification badge';
    if (current.isPinned !== base.isPinned) return isIndonesian ? 'Mengubah status pin komentar' : 'Toggled pinned comment';
    if (current.creatorLiked !== base.creatorLiked) return isIndonesian ? 'Mengubah status disukai kreator' : 'Toggled creator liked';
    if (current.borderRadius !== base.borderRadius) return isIndonesian ? 'Menyesuaikan radius sudut' : 'Adjusted border radius';
    if (current.padding !== base.padding) return isIndonesian ? 'Menyesuaikan padding' : 'Adjusted padding';
    
    return isIndonesian ? 'Membuat draf baru' : 'Created Draft';
  };

  const applyFormat = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = state.commentText;
    if (start !== end) {
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + `[${tag}]` + selectedText + `[/${tag}]` + text.substring(end);
      onChange({ commentText: newText });
      
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start, start + tag.length * 2 + 5 + selectedText.length);
      }, 0);
    } else {
      alert(language === 'id' ? 'Tandai / blok teks komentar terlebih dahulu!' : 'Mark / highlight the comment text first!');
    }
  };

  const resetFormat = () => {
    const newText = state.commentText.replace(/\[\/?(highlight|blur|cut)\]/g, '');
    onChange({ commentText: newText });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomAvatar = () => {
    const isMale = Math.random() > 0.5;
    const array = isMale ? maleUsernames : femaleUsernames;
    const newName = array[Math.floor(Math.random() * array.length)];
    const newHandle = `@${newName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    onChange({ 
      avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
      username: newName,
      handle: newHandle
    });
  };

  const presets = [
    { icon: "🔥", category: "Viral", label: language === 'id' ? "Kawal FYP" : "Guard FYP", text: language === 'id' ? "Kawal sampai tembus fyp 🔥🚀" : "Accompany until entering FYP 🔥🚀" },
    { icon: "😂", category: "Funny", label: language === 'id' ? "Relate" : "Relate", text: language === 'id' ? "Agak laen emang, tapi relate banget woy 😭😭" : "Quite different indeed, but highly relatable 😭😭" },
    { icon: "🙏", category: "Spill", label: language === 'id' ? "Spill" : "Spill", text: language === 'id' ? "Spill produknya dung kak 🙏" : "Spill the product please 🙏" },
    { icon: "🩴", category: "Wait", label: language === 'id' ? "Nitip" : "Park", text: language === 'id' ? "Nitip sendal, kalo rame kabarin 🩴" : "Parking my sandals, let me know if it gets crowded 🩴" }
  ];

  return (
    <div className="flex flex-col md:h-full glass-panel rounded-2xl md:overflow-hidden w-full md:w-[280px] lg:w-[365px] shrink-0 shadow-lg">
      {/* Scrollable area for properties */}
      <div className={`md:flex-1 ${activeTab === 'gallery' ? 'md:overflow-hidden min-h-0' : 'md:overflow-y-auto custom-scrollbar'} flex flex-col`}>
        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[var(--panel-border)] bg-[var(--panel-bg-translucent)] sticky top-0 z-20">
          <div className="flex w-full m-2 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('comment')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'comment' ? 'bg-[var(--panel-bg)] text-[var(--root-fg)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              {t('sidebar.tab.comment')}
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'engagement' ? 'bg-[var(--panel-bg)] text-[var(--root-fg)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              {t('sidebar.tab.engagement')}
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'advanced' ? 'bg-[var(--panel-bg)] text-[var(--root-fg)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              {t('sidebar.tab.advanced')}
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-[var(--panel-bg)] text-[var(--root-fg)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              {t('sidebar.tab.gallery')}
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* COMMENT TAB */}
          {activeTab === 'comment' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* TEMPLATE (Visible only for TikTok/Instagram) */}
              {(state.platform === 'tiktok' || state.platform === 'instagram') && (
                <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                  {state.platform === 'tiktok' && (
                    <div>
                      <Label className="text-[var(--root-fg)] mb-2 block">{t('sidebar.tiktokTemplate')}</Label>
                      <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                        <button
                          onClick={() => onChange({ tiktokTemplate: 'video' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.tiktokTemplate === 'video' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          {t('sidebar.tiktokTemplate.video')}
                        </button>
                        <button
                          onClick={() => onChange({ tiktokTemplate: 'reply' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.tiktokTemplate === 'reply' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          {t('sidebar.tiktokTemplate.reply')}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {state.platform === 'instagram' && (
                    <div>
                      <Label className="text-[var(--root-fg)] mb-2 block">{t('sidebar.instagramTemplate')}</Label>
                      <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                        <button
                          onClick={() => onChange({ instagramTemplate: 'comment' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.instagramTemplate === 'comment' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          {t('sidebar.instagramTemplate.comment')}
                        </button>
                        <button
                          onClick={() => onChange({ instagramTemplate: 'live' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.instagramTemplate === 'live' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          {t('sidebar.instagramTemplate.live')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AVATAR */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                <Label className="text-[var(--root-fg)]">{t('sidebar.avatar')}</Label>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 relative group">
                    {state.avatarUrl ? (
                      <img src={state.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-[var(--panel-border)] bg-[var(--root-bg)] shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-dashed border-[var(--text-muted)] bg-[var(--root-bg)] flex items-center justify-center">
                        <Image className="w-5 h-5 text-[var(--text-muted)] opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        id="sidebar-avatar-upload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload} 
                      />
                      <label 
                        htmlFor="sidebar-avatar-upload" 
                        className="flex-1 cursor-pointer inline-flex items-center justify-center px-3 py-1.5 bg-[var(--root-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-lg text-xs text-[var(--root-fg)] font-semibold transition-all shadow-sm"
                      >
                        {t('sidebar.avatar.upload')}
                      </label>
                      <Button variant="secondary" onClick={handleRandomAvatar} className="flex-1 text-xs py-1.5 px-3 rounded-lg cursor-pointer font-semibold" title={language === 'id' ? "Acak Profil" : "Randomize Profile"}>
                        {t('sidebar.avatar.random')}
                      </Button>
                    </div>
                    {state.avatarUrl && (
                      <Button variant="danger" onClick={() => onChange({ avatarUrl: '' })} className="w-full text-xs py-1 h-auto cursor-pointer font-semibold">
                        {t('sidebar.avatar.remove')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* USERNAME */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                <div>
                  <Label className="text-[var(--root-fg)] mb-1.5">{t('sidebar.username')}</Label>
                  <Input 
                    value={state.username} 
                    onChange={e => onChange({ username: e.target.value })}
                    placeholder="John Doe"
                    className="w-full text-xs"
                  />
                </div>
                
                {state.platform === 'twitter' && (
                  <div>
                    <Label className="text-[var(--root-fg)] mb-1.5">{t('sidebar.handle')}</Label>
                    <Input 
                      value={state.handle} 
                      onChange={e => onChange({ handle: e.target.value })}
                      placeholder="@johndoe"
                      className="w-full text-xs"
                    />
                  </div>
                )}
              </div>

              {/* COMMENT TEXT */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-2.5">
                <div className="flex justify-between items-end mb-1">
                  <Label className="mb-0 text-[var(--root-fg)]">{t('sidebar.commentText')}</Label>
                  <div className="flex gap-1 bg-[var(--root-bg)] p-0.5 rounded border border-[var(--panel-border)]">
                    {['👍', '❤️', '😂', '🔥', '😭'].map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => onChange({ commentText: state.commentText + emoji })}
                        className="text-xs hover:bg-[var(--panel-border)] w-5.5 h-5.5 rounded flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea 
                  ref={textareaRef}
                  value={state.commentText} 
                  onChange={e => onChange({ commentText: e.target.value })}
                  className="h-28 text-xs"
                  placeholder={t('sidebar.commentText.placeholder')}
                />
                
                {/* Advanced Formatting Toolbar */}
                <div className="flex items-center justify-between bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                  <div className="flex gap-1">
                    <button title={t('sidebar.formatting.highlight')} type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('highlight'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-yellow-500 transition-colors cursor-pointer">
                      <Highlighter className="w-4 h-4" />
                    </button>
                    <button title={t('sidebar.formatting.blur')} type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('blur'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-blue-500 transition-colors cursor-pointer">
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button title={t('sidebar.formatting.cut')} type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('cut'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                      <Scissors className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-[1px] h-4 bg-[var(--panel-border)] mx-1" />
                  <button title={t('sidebar.formatting.reset')} type="button" onClick={resetFormat} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ENGAGEMENT TAB */}
          {activeTab === 'engagement' && (
            <div className="flex flex-col p-4.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('sidebar.likes')}</Label>
                  <Input 
                    value={state.likeCount} 
                    onChange={e => onChange({ likeCount: e.target.value })}
                    placeholder="1.2K"
                    className="text-xs"
                  />
                </div>

                <div>
                  <Label>{t('sidebar.time')}</Label>
                  <Input 
                    value={state.timestamp} 
                    onChange={e => onChange({ timestamp: e.target.value })}
                    placeholder={language === 'id' ? "2j lalu" : "2h ago"}
                    className="text-xs"
                  />
                </div>

                {state.platform === 'twitter' && (
                  <>
                    <div>
                      <Label>{t('sidebar.retweets')}</Label>
                      <Input 
                        value={state.retweetCount} 
                        onChange={e => onChange({ retweetCount: e.target.value })}
                        placeholder="800"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label>{t('sidebar.views')}</Label>
                      <Input 
                        value={state.viewCount} 
                        onChange={e => onChange({ viewCount: e.target.value })}
                        placeholder="1.2M"
                        className="text-xs"
                      />
                    </div>
                  </>
                )}

                {state.platform === 'youtube' && (
                  <div>
                    <Label>{t('sidebar.replies')}</Label>
                    <Input 
                      value={state.replyCount} 
                      onChange={e => onChange({ replyCount: e.target.value })}
                      placeholder="24"
                      className="text-xs"
                    />
                  </div>
                )}

                {/* Checkboxes */}
                <div className="col-span-2 flex flex-col gap-2 mt-2 pt-4 border-t border-[var(--panel-border)]">
                  <Label>{t('sidebar.badges')}</Label>
                  <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.isVerified}
                      onChange={e => onChange({ isVerified: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">{t('sidebar.badge.verified')}</span>
                  </label>
                  
                  {(state.platform === 'tiktok' || state.platform === 'youtube' || state.platform === 'instagram') && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={state.creatorLiked}
                          onChange={e => onChange({ creatorLiked: e.target.checked })}
                          className="w-4 h-4 rounded border-[var(--panel-border)] text-red-500 focus:ring-red-500 bg-[var(--root-bg)] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-red-500 transition-colors">{t('sidebar.badge.creatorLiked')}</span>
                      </label>

                      {!(state.platform === 'tiktok' && state.tiktokTemplate === 'reply') && !(state.platform === 'instagram' && state.instagramTemplate === 'live') && (
                        <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                          <input 
                            type="checkbox" 
                            checked={state.isPinned}
                            onChange={e => onChange({ isPinned: e.target.checked })}
                            className="w-4 h-4 rounded border-[var(--panel-border)] text-[var(--text-muted)] focus:ring-gray-500 bg-[var(--root-bg)] cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-[var(--text-muted)] transition-colors">{t('sidebar.badge.pinned')}</span>
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-xs font-semibold mb-1.5 block">{t('sidebar.platform')}</Label>
                <Select 
                  value={state.platform}
                  onChange={e => onChange({ platform: e.target.value as any })}
                  className="w-full text-xs"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="kick_live">Kick Live</option>
                </Select>
              </div>

              {/* NESTED REPLIES */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <div className="flex items-center justify-between mb-3.5">
                  <Label className="text-[var(--root-fg)] mb-0 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live') ? t('sidebar.liveComments') : t('sidebar.nestedReplies')}
                  </Label>
                </div>
                <SectionReplies state={state} onChange={onChange} onEditReply={onEditReply} onAddReply={onAddReply} />
              </div>

              {/* APPEARANCE */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-[var(--root-fg)] mb-3.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {t('sidebar.appearanceWatermark')}
                </Label>
                <SectionAppearance state={state} onChange={onChange} />
              </div>

              {/* ANIMATION FUTURE */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-[var(--text-muted)] mb-1.5">{t('sidebar.animation')}</Label>
                <div className="text-[10px] text-[var(--text-muted)] bg-[var(--root-bg)] border border-dashed border-[var(--panel-border)] rounded-xl p-3 leading-relaxed">
                  {t('sidebar.animation.desc')}
                </div>
              </div>

              {/* CUSTOM CSS FUTURE */}
              <div className="p-4.5">
                <Label className="text-[var(--text-muted)] mb-1.5">{t('sidebar.customCss')}</Label>
                <div className="text-[10px] text-[var(--text-muted)] bg-[var(--root-bg)] border border-dashed border-[var(--panel-border)] rounded-xl p-3 leading-relaxed">
                  {t('sidebar.customCss.desc')}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Compact Toolbar for Undo / Redo */}
              <div className="flex items-center justify-between px-4 py-2 bg-[var(--root-bg)]/40 border-b border-[var(--panel-border)] shrink-0 select-none">
                <span className="text-[var(--text-muted)]">
                  {language === 'id' ? 'Riwayat Editor' : 'Editor History'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={onUndo} 
                    disabled={!canUndo}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${canUndo ? 'text-[var(--accent)] hover:text-[var(--accent-hover)] hover:bg-[var(--root-bg)]/40' : 'text-[var(--text-muted)] cursor-not-allowed opacity-40'}`}
                    title={language === 'id' ? 'Batalkan (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
                  >
                    <RotateCcw className="w-3.5 h-3.5 -scale-x-100" />
                    <span>{t('sidebar.undo')}</span>
                  </button>
                  <div className="w-[1px] h-3 bg-[var(--panel-border)]" />
                  <button 
                    onClick={onRedo} 
                    disabled={!canRedo}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${canRedo ? 'text-[var(--accent)] hover:text-[var(--accent-hover)] hover:bg-[var(--root-bg)]/40' : 'text-[var(--text-muted)] cursor-not-allowed opacity-40'}`}
                    title={language === 'id' ? 'Ulangi (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('sidebar.redo')}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs Segmented Control */}
              <div className="mx-4 my-3 shrink-0 p-1 bg-[var(--root-bg)]/40 border border-[var(--panel-border)] rounded-xl relative flex">
                {(['workspace', 'snapshots', 'history'] as const).map((tabId) => {
                  const isActive = gallerySubTab === tabId;
                  const label = tabId === 'workspace' 
                    ? (language === 'id' ? 'Workspace' : 'Workspace') 
                    : tabId === 'snapshots' 
                      ? (language === 'id' ? 'Snapshots' : 'Snapshots') 
                      : (language === 'id' ? 'History' : 'History');
                  return (
                    <button
                      key={tabId}
                      onClick={() => setGallerySubTab(tabId)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg relative cursor-pointer z-10 transition-colors text-center ${isActive ? 'text-[var(--root-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeGalleryTabIndicator"
                          className="absolute inset-0 bg-[var(--accent)] rounded-lg -z-10 shadow-sm"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Message Toast / Banner */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mx-4 mb-2 p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent-hover)] text-[10px] font-medium rounded-xl text-center"
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scrollable Sub-tab Content Area */}
              <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* TAB 1: WORKSPACE */}
                  {gallerySubTab === 'workspace' && (
                    <motion.div
                      key="workspace-tab"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden"
                    >
                      {/* Primary CTA: New Draft */}
                      <button 
                        onClick={() => {
                          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const defaultName = `Draft ${timeStr}`;
                          onSaveDraft(defaultName, state);
                          triggerStatus(language === 'id' ? `Draf "${defaultName}" disimpan!` : `Draft "${defaultName}" saved!`);
                        }}
                        className="w-full py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-[0.98] text-[var(--root-bg)] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'id' ? 'Buat Draf Baru' : 'New Draft'}</span>
                      </button>

                      {/* Draft Search (compact, elegant) */}
                      <div className="relative shrink-0">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          placeholder={language === 'id' ? 'Cari draf...' : 'Search drafts...'}
                          value={draftSearch}
                          onChange={(e) => setDraftSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[var(--root-bg)]/40 border border-[var(--panel-border)] focus:border-[var(--accent)]/50 rounded-xl text-xs text-[var(--root-fg)] placeholder-[var(--text-muted)] focus:outline-none transition-all"
                        />
                        {draftSearch && (
                          <button 
                            onClick={() => setDraftSearch('')}
                            className="absolute right-3 top-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--root-fg)]"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Compact Banner for Sync Status */}
                      <div className="flex items-center justify-between p-2.5 bg-[var(--root-bg)]/25 border border-[var(--panel-border)] rounded-xl text-[10px] shrink-0">
                        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                          {isPremium ? (
                            <Cloud className="w-3.5 h-3.5 text-[var(--accent)] fill-[var(--accent)]/10 shrink-0" />
                          ) : (
                            <CloudOff className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          )}
                          <span className="truncate max-w-[150px]">
                            {isPremium 
                              ? (language === 'id' ? 'Cloud Sync Aktif' : 'Cloud Sync Active') 
                              : (language === 'id' ? 'Penyimpanan Lokal Saja' : 'Local Storage Only')}
                          </span>
                        </div>
                        {isPremium ? (
                          <button 
                            onClick={handleManualSync}
                            disabled={isSyncingGlobal}
                            className="text-[var(--accent)] font-bold hover:text-[var(--accent-hover)] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {isSyncingGlobal ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span>Sync</span>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={onUpgradeClick}
                            className="text-[var(--accent)] font-bold hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
                          >
                            PRO SYNC
                          </button>
                        )}
                      </div>

                      {/* Drafts List */}
                      <div className="flex-1 overflow-y-auto min-h-0 space-y-2.5 gallery-scrollbar pr-1 pb-2">
                        {drafts.filter(d => d.name.toLowerCase().includes(draftSearch.toLowerCase())).length === 0 ? (
                          <div className="text-center py-6 text-[11px] text-[var(--text-muted)]">
                            {language === 'id' ? 'Tidak ada draf ditemukan' : 'No drafts found'}
                          </div>
                        ) : (
                          drafts
                            .filter(d => d.name.toLowerCase().includes(draftSearch.toLowerCase()))
                            .map((draft) => {
                              const isEditingName = editingDraftId === draft.id;
                              
                              // Brand colors for platform badge
                              const badgeStyle = draft.platform === 'tiktok' 
                                ? 'bg-black text-white border-white/10'
                                : draft.platform === 'instagram'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : draft.platform === 'youtube'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                    : draft.platform === 'twitter'
                                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                      : 'bg-green-500/10 text-green-400 border-green-500/20';

                              return (
                                <div 
                                  key={draft.id}
                                  className="group bg-[var(--root-bg)]/40 border border-[var(--panel-border)] hover:border-[var(--accent)]/30 rounded-xl p-3 flex flex-col gap-2.5 transition-all duration-200 hover:-translate-y-[2px] shadow-sm relative overflow-hidden"
                                >
                                  {/* Draft Header */}
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-2">
                                      {isEditingName ? (
                                        <input
                                          type="text"
                                          value={editingDraftName}
                                          onChange={(e) => setEditingDraftName(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              onRenameDraft(draft.id, editingDraftName);
                                              setEditingDraftId(null);
                                              triggerStatus(language === 'id' ? 'Nama draf diperbarui!' : 'Draft renamed!');
                                            }
                                          }}
                                          autoFocus
                                          className="w-full px-2 py-0.5 bg-[var(--root-bg)] border border-[var(--accent)]/50 rounded text-xs text-[var(--root-fg)] focus:outline-none"
                                        />
                                      ) : (
                                        <h4 className="text-xs font-semibold text-[var(--root-fg)] truncate group-hover:text-[var(--accent-hover)] transition-colors">
                                          {draft.name}
                                        </h4>
                                      )}
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badgeStyle}`}>
                                          {draft.platform}
                                        </span>
                                        <span className="text-[10px] text-[var(--text-muted)] truncate">
                                          {t('drafts.updated')} {formatTime(draft.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quick Preview of text */}
                                  <p className="text-[10px] text-[var(--text-muted)] italic line-clamp-1 opacity-70">
                                    "{draft.state.commentText}"
                                  </p>

                                  {/* Draft Action Buttons */}
                                  <div className="flex items-center justify-between border-t border-[var(--panel-border)] pt-2 mt-1">
                                    <div className="flex items-center gap-1.5">
                                      {/* Load / Edit Action */}
                                      <button
                                        onClick={() => {
                                          onChange(draft.state);
                                          triggerStatus(language === 'id' ? 'Draf dimuat!' : 'Draft loaded!');
                                        }}
                                        className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer"
                                        title={language === 'id' ? 'Muat draf' : 'Load draft'}
                                      >
                                        <Check className="w-3 h-3 text-[var(--accent)]" />
                                        <span>{language === 'id' ? 'Gunakan' : 'Load'}</span>
                                      </button>

                                      <div className="w-[1px] h-2 bg-[var(--panel-border)]" />

                                      {/* Rename Action */}
                                      <button
                                        onClick={() => {
                                          if (isEditingName) {
                                            onRenameDraft(draft.id, editingDraftName);
                                            setEditingDraftId(null);
                                            triggerStatus(language === 'id' ? 'Nama draf diperbarui!' : 'Draft renamed!');
                                          } else {
                                            setEditingDraftId(draft.id);
                                            setEditingDraftName(draft.name);
                                          }
                                        }}
                                        className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer"
                                      >
                                        <Edit className="w-3 h-3" />
                                        <span>{isEditingName ? 'Save' : (language === 'id' ? 'Ubah' : 'Rename')}</span>
                                      </button>

                                      <div className="w-[1px] h-2 bg-[var(--panel-border)]" />

                                      {/* Duplicate Action */}
                                      <button
                                        onClick={() => handleDuplicateDraft(draft)}
                                        className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer"
                                        title={language === 'id' ? 'Duplikat draf' : 'Duplicate draft'}
                                      >
                                        <Copy className="w-3 h-3" />
                                        <span>{language === 'id' ? 'Duplikat' : 'Duplicate'}</span>
                                      </button>
                                    </div>

                                    {/* Delete Draft */}
                                    <button
                                      onClick={() => {
                                        onDeleteDraft(draft.id);
                                        triggerStatus(language === 'id' ? 'Draf dihapus' : 'Draft deleted');
                                      }}
                                      className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                      title={language === 'id' ? 'Hapus draf' : 'Delete draft'}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: SNAPSHOTS */}
                  {gallerySubTab === 'snapshots' && (
                    <motion.div
                      key="snapshots-tab"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden"
                    >
                      {/* Take Snapshot Trigger */}
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('trigger-snapshot'))}
                        className="w-full py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-[0.98] text-[var(--root-bg)] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
                      >
                        <Image className="w-4 h-4" />
                        <span>{language === 'id' ? 'Ambil Snapshot Baru' : 'Take New Snapshot'}</span>
                      </button>

                      {snapshots.length === 0 ? (
                        /* Compact Empty State (110px) */
                        <div className="flex flex-col items-center justify-center p-4 bg-[var(--root-bg)]/25 border border-dashed border-[var(--panel-border)] rounded-xl h-[110px] shrink-0">
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-semibold">
                            <span>📸</span>
                            <span>{language === 'id' ? 'Belum ada snapshot' : 'No snapshots yet'}</span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] text-center mt-1 max-w-[240px] leading-relaxed">
                            {language === 'id' ? 'Ambil snapshot dari panel pratinjau untuk membandingkan versi.' : 'Create a snapshot from the Preview panel to compare versions.'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
                          {/* Bulk Controls */}
                          <div className="flex items-center justify-between gap-2 bg-[var(--root-bg)]/25 p-2 rounded-xl border border-[var(--panel-border)] shrink-0 select-none">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox"
                                id="selectAllSnapshots"
                                checked={snapshots.length > 0 && selectedSnapshotIds.length === snapshots.length}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = selectedSnapshotIds.length > 0 && selectedSnapshotIds.length < snapshots.length;
                                  }
                                }}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSnapshotIds(snapshots.map(s => s.id));
                                  } else {
                                    setSelectedSnapshotIds([]);
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded border-[var(--panel-border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--root-bg)] cursor-pointer"
                              />
                              <label 
                                htmlFor="selectAllSnapshots" 
                                className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--root-fg)] cursor-pointer"
                              >
                                {selectedSnapshotIds.length === snapshots.length ? t('sidebar.gallery.deselectAll') : t('sidebar.gallery.selectAll')}
                              </label>
                            </div>

                            {selectedSnapshotIds.length > 0 && (
                              <button
                                onClick={() => {
                                  if (onDeleteSnapshots) {
                                    onDeleteSnapshots(selectedSnapshotIds);
                                  } else {
                                    selectedSnapshotIds.forEach(id => onDeleteSnapshot(id));
                                  }
                                  setSelectedSnapshotIds([]);
                                  triggerStatus(language === 'id' ? 'Snapshot terpilih dihapus!' : 'Selected snapshots deleted!');
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{selectedSnapshotIds.length} Del</span>
                              </button>
                            )}
                          </div>

                          {/* Snapshot Grid */}
                          <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-2 gap-3 gallery-scrollbar pr-1 pb-2">
                            {snapshots.map(snap => {
                              const isSelected = selectedSnapshotIds.includes(snap.id);
                              const isEditingName = editingSnapshotId === snap.id;
                              const displayName = snap.name || snap.timestamp;

                              return (
                                <div 
                                  key={snap.id} 
                                  className={`relative group rounded-xl overflow-hidden border transition-all duration-200 bg-[var(--root-bg)]/40 hover:-translate-y-[2px] ${
                                    isSelected 
                                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/30' 
                                      : 'border-[var(--panel-border)] hover:border-[var(--accent)]/40'
                                  }`}
                                >
                                  {/* Selection Checkbox overlay */}
                                  <div className={`absolute top-2 left-2 z-20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <input 
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSnapshotIds(prev => [...prev, snap.id]);
                                        } else {
                                          setSelectedSnapshotIds(prev => prev.filter(id => id !== snap.id));
                                        }
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/40 bg-[var(--root-bg)]/60 checked:bg-[var(--accent)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer shadow-md"
                                    />
                                  </div>

                                  {/* Snapshot thumbnail */}
                                  <div className="aspect-video w-full bg-[var(--root-bg)]/30 flex items-center justify-center overflow-hidden border-b border-[var(--panel-border)] relative">
                                    <img src={snap.url} alt="Snapshot preview" className="w-full h-full object-cover" />
                                  </div>

                                  {/* Snapshot Metadata & Inline actions */}
                                  <div className="p-2 bg-[var(--root-bg)]/25">
                                    {isEditingName ? (
                                      <input
                                        type="text"
                                        value={editingSnapshotName}
                                        onChange={(e) => setEditingSnapshotName(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            if (onRenameSnapshot) onRenameSnapshot(snap.id, editingSnapshotName);
                                            setEditingSnapshotId(null);
                                            triggerStatus(language === 'id' ? 'Nama snapshot disimpan!' : 'Snapshot name saved!');
                                          }
                                        }}
                                        autoFocus
                                        className="w-full px-1.5 py-0.5 bg-[var(--root-bg)] border border-[var(--accent)]/50 rounded text-[10px] text-[var(--root-fg)] focus:outline-none"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="text-[10px] font-semibold text-[var(--text-muted)] truncate flex-1 block">
                                          {displayName}
                                        </span>
                                        <button
                                          onClick={() => {
                                            setEditingSnapshotId(snap.id);
                                            setEditingSnapshotName(snap.name || snap.timestamp);
                                          }}
                                          className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors"
                                          title="Rename"
                                        >
                                          <Edit className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    )}

                                    {/* Action links */}
                                    <div className="flex items-center justify-between gap-1.5 border-t border-[var(--panel-border)] pt-1.5 mt-1 text-[9px]">
                                      {/* Compare trigger */}
                                      <button
                                        onClick={() => {
                                          setComparingSnapshotId(snap.id);
                                          setCompareWithId('live');
                                        }}
                                        className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-bold cursor-pointer"
                                      >
                                        Compare
                                      </button>

                                      <div className="flex items-center gap-1.5">
                                        {/* Download */}
                                        <a 
                                          href={snap.url} 
                                          download={`snapshot-${snap.id}.png`}
                                          className="text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors font-semibold"
                                        >
                                          Save
                                        </a>

                                        {/* Delete */}
                                        <button
                                          onClick={() => {
                                            onDeleteSnapshot(snap.id);
                                            setSelectedSnapshotIds(prev => prev.filter(id => id !== snap.id));
                                            triggerStatus(language === 'id' ? 'Snapshot dihapus' : 'Snapshot deleted');
                                          }}
                                          className="text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: HISTORY TIMELINE */}
                  {gallerySubTab === 'history' && (
                    <motion.div
                      key="history-tab"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden"
                    >
                      {/* Clear history option */}
                      <div className="flex justify-between items-center bg-[var(--root-bg)]/25 px-3 py-2 rounded-xl border border-[var(--panel-border)] shrink-0">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {t('sidebar.draft.count', { count: history.length })}
                        </span>
                        {history.length > 0 && (
                          <button
                            onClick={() => {
                              onClearHistory();
                              triggerStatus(language === 'id' ? 'Seluruh riwayat dibersihkan!' : 'All history cleared!');
                            }}
                            className="text-[9px] font-bold uppercase text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      {history.length === 0 ? (
                        <div className="text-center py-10 text-[11px] text-[var(--text-muted)] shrink-0">
                          {language === 'id' ? 'Belum ada aktivitas terekam.' : 'No activity logged yet.'}
                        </div>
                      ) : history.length > 100 ? (
                        /* Virtualized Chronological Activity Timeline */
                        <div 
                          ref={scrollContainerRef}
                          onScroll={handleScroll}
                          className="flex-1 overflow-y-auto min-h-0 gallery-scrollbar pr-1.5 pb-2 relative border-l border-[var(--panel-border)] ml-2 pl-4"
                          style={{ overflowX: 'hidden' }}
                        >
                          <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
                            {visibleItems.map((hist, localIndex) => {
                              const absoluteIndex = startIndex + localIndex;
                              const prevHist = absoluteIndex < history.length - 1 ? history[absoluteIndex + 1] : undefined;
                              const actionLabel = getHistoryItemDescription(hist, prevHist);
                              const formattedTime = formatTime(hist.createdAt);

                              return (
                                <div 
                                  key={hist.id} 
                                  className="absolute left-0 right-0 group/timeline"
                                  style={{ 
                                    top: `${absoluteIndex * ITEM_HEIGHT}px`, 
                                    height: `${ITEM_HEIGHT - 12}px`, 
                                  }}
                                >
                                  {/* Timeline Node Accent Dot */}
                                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--panel-bg)] group-hover/timeline:bg-[var(--accent)] transition-colors" />

                                  <div 
                                    className="flex flex-col gap-0.5 bg-[var(--root-bg)]/25 hover:bg-[var(--root-bg)]/50 border border-[var(--panel-border)] hover:border-[var(--accent)]/50 rounded-xl p-2.5 transition-all h-full justify-between cursor-pointer group/card"
                                    onClick={() => {
                                      onChange(hist.state);
                                      triggerStatus(language === 'id' ? 'Riwayat dipulihkan ke Kanvas!' : 'State restored to Canvas!');
                                    }}
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      {/* Timestamp metadata */}
                                      <span className="text-[9px] font-mono font-semibold text-[var(--text-muted)] block">
                                        {formattedTime}
                                      </span>

                                      {/* Action Label Description */}
                                      <span className="text-[11px] font-semibold text-[var(--root-fg)] truncate block group-hover/card:text-[var(--accent)] transition-colors">
                                        {actionLabel}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-[var(--panel-border)]/50">
                                      {/* Platform details */}
                                      <span className="text-xs font-semibold text-[var(--accent)]">
                                        {hist.platform}
                                      </span>

                                      {/* Quick Actions */}
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(hist.state);
                                            triggerStatus(language === 'id' ? 'Riwayat dipulihkan ke Kanvas!' : 'State restored to Canvas!');
                                          }}
                                          className="text-[9px] text-[var(--accent)] hover:text-[var(--accent-hover)] font-bold transition-colors cursor-pointer flex items-center gap-1 bg-[var(--accent)]/10 px-1.5 py-0.5 rounded"
                                        >
                                          <RotateCcw className="w-2.5 h-2.5" />
                                          <span>{language === 'id' ? 'Pulihkan' : 'Restore'}</span>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingHistoryItem(hist);
                                          }}
                                          className="text-[9px] text-[var(--text-muted)] hover:text-[var(--root-fg)] font-semibold transition-colors cursor-pointer px-1 py-0.5 hover:bg-[var(--root-bg)]/40 rounded"
                                        >
                                          {language === 'id' ? 'Detail' : 'Detail'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Normal Chronological Activity Timeline */
                        <div 
                          className="flex-1 overflow-y-auto min-h-0 gallery-scrollbar pr-1.5 pb-2 relative border-l border-[var(--panel-border)] ml-2 pl-4 space-y-4 py-1" 
                          style={{ overflowX: 'hidden' }}
                        >
                          {history.map((hist, index) => {
                            const prevHist = index < history.length - 1 ? history[index + 1] : undefined;
                            const actionLabel = getHistoryItemDescription(hist, prevHist);
                            const formattedTime = formatTime(hist.createdAt);

                            return (
                              <div key={hist.id} className="relative group/timeline">
                                {/* Timeline Node Accent Dot */}
                                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--panel-bg)] group-hover/timeline:bg-[var(--accent)] transition-colors" />

                                <div 
                                  className="flex flex-col gap-1 bg-[var(--root-bg)]/25 hover:bg-[var(--root-bg)]/50 border border-[var(--panel-border)] hover:border-[var(--accent)]/50 rounded-xl p-2.5 transition-all cursor-pointer group/card"
                                  onClick={() => {
                                    onChange(hist.state);
                                    triggerStatus(language === 'id' ? 'Riwayat dipulihkan ke Kanvas!' : 'State restored to Canvas!');
                                  }}
                                >
                                  {/* Timestamp metadata */}
                                  <span className="text-[9px] font-mono font-semibold text-[var(--text-muted)] block">
                                    {formattedTime}
                                  </span>

                                  {/* Action Label Description */}
                                  <span className="text-xs font-semibold text-[var(--root-fg)] group-hover/card:text-[var(--accent)] transition-colors">
                                    {actionLabel}
                                  </span>

                                  <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-[var(--panel-border)]/50">
                                    {/* Platform details */}
                                    <span className="text-xs font-semibold text-[var(--accent)]">
                                      {hist.platform}
                                    </span>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onChange(hist.state);
                                          triggerStatus(language === 'id' ? 'Riwayat dipulihkan ke Kanvas!' : 'State restored to Canvas!');
                                        }}
                                        className="text-[10px] text-[var(--accent)] hover:text-[var(--accent-hover)] font-bold transition-colors cursor-pointer flex items-center gap-1 bg-[var(--accent)]/10 px-2 py-0.5 rounded"
                                      >
                                        <RotateCcw className="w-2.5 h-2.5" />
                                        <span>{language === 'id' ? 'Pulihkan' : 'Restore'}</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingHistoryItem(hist);
                                        }}
                                        className="text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] font-semibold transition-colors cursor-pointer px-1.5 py-0.5 hover:bg-[var(--root-bg)]/40 rounded"
                                      >
                                        {language === 'id' ? 'Detail' : 'Detail'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Snapshot Compare Modal */}
              <AnimatePresence>
                {comparingSnapshotId && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-[var(--root-fg)]">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-[var(--panel-border)] flex justify-between items-center bg-[var(--root-bg)]/40">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--root-fg)] flex items-center gap-2">
                            <span>📊</span> {language === 'id' ? 'Perbandingan Snapshot' : 'Snapshot Comparison'}
                          </h3>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            {language === 'id' ? 'Bandingkan checkpoint visual secara berdampingan' : 'Compare visual checkpoints side-by-side'}
                          </p>
                        </div>
                        <button 
                          onClick={() => setComparingSnapshotId(null)}
                          className="text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors p-1 bg-[var(--root-bg)]/40 hover:bg-[var(--panel-border)] rounded-lg cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Comparison Workspace */}
                      <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6 items-stretch justify-center">
                        {/* Left Card: Selected Snapshot */}
                        <div className="flex-1 flex flex-col gap-2 border border-[var(--panel-border)] rounded-xl p-3 bg-[var(--root-bg)]/25">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                              Snapshot A
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)] font-mono">
                              {snapshots.find(s => s.id === comparingSnapshotId)?.name || snapshots.find(s => s.id === comparingSnapshotId)?.timestamp}
                            </span>
                          </div>
                          <div className="flex-1 min-h-[250px] md:min-h-[350px] flex items-center justify-center bg-[var(--root-bg)]/40 rounded-lg overflow-hidden border border-[var(--panel-border)] relative">
                            <img 
                              src={snapshots.find(s => s.id === comparingSnapshotId)?.url} 
                              alt="Snapshot A" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Middle vs Separator */}
                        <div className="flex items-center justify-center text-xs font-black text-[var(--text-muted)] py-2 md:py-0">
                          VS
                        </div>

                        {/* Right Card: Comparison Target */}
                        <div className="flex-1 flex flex-col gap-2 border border-[var(--panel-border)] rounded-xl p-3 bg-[var(--root-bg)]/25">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full shrink-0">
                              Snapshot B
                            </span>
                            <select
                              value={compareWithId}
                              onChange={(e) => setCompareWithId(e.target.value)}
                              className="bg-[var(--root-bg)]/60 border border-[var(--panel-border)] rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[var(--root-fg)] focus:outline-none cursor-pointer max-w-[180px] truncate"
                            >
                              <option value="live">Current Design (Live)</option>
                              {snapshots
                                .filter(s => s.id !== comparingSnapshotId)
                                .map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.name || s.timestamp}
                                  </option>
                                ))}
                            </select>
                          </div>
                          
                          <div className="flex-1 min-h-[250px] md:min-h-[350px] flex items-center justify-center bg-[var(--root-bg)]/40 rounded-lg overflow-hidden border border-[var(--panel-border)] relative">
                            {compareWithId === 'live' ? (
                              <div className="text-center p-4">
                                <p className="text-xs text-[var(--text-muted)] font-semibold mb-1">{language === 'id' ? 'Desain langsung aktif di editor' : 'Live design is active in editor'}</p>
                                <p className="text-[10px] text-[var(--text-muted)] max-w-[200px] mx-auto leading-relaxed">
                                  {language === 'id' ? 'Bandingkan dengan melihat kembali panel kanvas pratinjau di layar utama.' : 'Compare by looking back at the preview canvas on the main screen.'}
                                </p>
                              </div>
                            ) : (
                              <img 
                                src={snapshots.find(s => s.id === compareWithId)?.url} 
                                alt="Snapshot B" 
                                className="max-w-full max-h-full object-contain"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 border-t border-[var(--panel-border)] flex justify-end gap-3 bg-[var(--root-bg)]/25">
                        <button 
                          onClick={() => setComparingSnapshotId(null)}
                          className="px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold rounded-xl text-xs transition-all cursor-pointer border border-[var(--panel-border)]"
                        >
                          {language === 'id' ? 'Tutup' : 'Close'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* View History Item Modal */}
              <AnimatePresence>
                {viewingHistoryItem && (
                  <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-[var(--root-fg)]"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setViewingHistoryItem(null);
                    }}
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl w-full max-w-md p-5 flex flex-col overflow-hidden shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--root-fg)]">
                            {language === 'id' ? 'Detail Aktivitas Riwayat' : 'History Activity Details'}
                          </h3>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            {new Date(viewingHistoryItem.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => setViewingHistoryItem(null)}
                          className="text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4 flex-1">
                        <div className="p-3.5 bg-[var(--root-bg)]/25 border border-[var(--panel-border)] rounded-xl space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-muted)]">{language === 'id' ? 'Platform' : 'Platform'}</span>
                            <span className="font-bold text-[var(--root-fg)] uppercase">{viewingHistoryItem.platform}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-muted)]">{language === 'id' ? 'Pengguna' : 'User'}</span>
                            <span className="font-bold text-[var(--root-fg)]">{viewingHistoryItem.state.username}</span>
                          </div>
                          {viewingHistoryItem.state.handle && (
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--text-muted)]">{language === 'id' ? 'Handle' : 'Handle'}</span>
                              <span className="font-mono text-[var(--text-muted)]">{viewingHistoryItem.state.handle}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block mb-1">
                            {language === 'id' ? 'Teks Komentar' : 'Comment Text'}
                          </span>
                          <div className="p-3 bg-[var(--root-bg)]/40 rounded-xl border border-[var(--panel-border)] text-xs text-[var(--root-fg)] italic max-h-[120px] overflow-y-auto">
                            "{viewingHistoryItem.state.commentText || 'Empty comment text'}"
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 bg-[var(--root-bg)]/25 border border-[var(--panel-border)] rounded-xl text-center">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase block">Likes</span>
                            <span className="text-xs font-bold text-[var(--root-fg)] mt-1 block">{viewingHistoryItem.state.likeCount || '0'}</span>
                          </div>
                          <div className="p-2.5 bg-[var(--root-bg)]/25 border border-[var(--panel-border)] rounded-xl text-center">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase block">Font size</span>
                            <span className="text-xs font-bold text-[var(--root-fg)] mt-1 block">{viewingHistoryItem.state.fontSize}px</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6 border-t border-[var(--panel-border)] pt-4">
                        <button 
                          onClick={() => {
                            onChange(viewingHistoryItem.state);
                            setViewingHistoryItem(null);
                            triggerStatus(language === 'id' ? 'Riwayat dipulihkan!' : 'History restored!');
                          }}
                          className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] font-semibold rounded-xl text-xs transition-all cursor-pointer"
                        >
                          {language === 'id' ? 'Pulihkan' : 'Restore State'}
                        </button>
                        <button 
                          onClick={() => setViewingHistoryItem(null)}
                          className="px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold rounded-xl text-xs transition-all cursor-pointer border border-[var(--panel-border)]"
                        >
                          {language === 'id' ? 'Batal' : 'Cancel'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
