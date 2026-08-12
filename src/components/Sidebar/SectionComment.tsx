import React, { useRef } from 'react';
import { CommentState } from '../../types';
import { Label, Input, Textarea, Button } from '../ui';
import { Highlighter, EyeOff, Scissors, RotateCcw, Zap } from 'lucide-react';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
}

export function SectionComment({ state, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      alert('Tandai / blok teks komentar terlebih dahulu!');
    }
  };

  const resetFormat = () => {
    const newText = state.commentText.replace(/\[\/?(highlight|blur|cut)\]/g, '');
    onChange({ commentText: newText });
  };

  const presets = [
    { icon: "🔥", category: "Viral", label: "Kawal FYP", text: "Kawal sampai tembus fyp 🔥🚀" },
    { icon: "😂", category: "Funny", label: "Relate", text: "Agak laen emang, tapi relate banget woy 😭😭" },
    { icon: "🙏", category: "Spill", label: "Spill", text: "Spill produknya dung kak 🙏" },
    { icon: "🩴", category: "Wait", label: "Nitip", text: "Nitip sendal, kalo rame kabarin 🩴" },
    { icon: "💼", category: "Info", label: "Loker", text: "Info loker info maseehhh" },
    { icon: "🥶", category: "Respect", label: "Suhu", text: "The real suhu emang beda 🥶" },
    { icon: "🇮🇩", category: "Political", label: "Jokowi", text: "HIDUP JOKOWI!!" },
    { icon: "😡", category: "Hater", label: "Asing", text: "HEEYY.. ANTEK ANTEK ASING!" }
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Username</Label>
          <Input 
            value={state.username} 
            onChange={e => onChange({ username: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        
        {state.platform === 'twitter' && (
          <div className="col-span-2">
            <Label>@Handle</Label>
            <Input 
              value={state.handle} 
              onChange={e => onChange({ handle: e.target.value })}
              placeholder="@johndoe"
            />
          </div>
        )}

        <div>
          <Label>Likes</Label>
          <Input 
            value={state.likeCount} 
            onChange={e => onChange({ likeCount: e.target.value })}
            placeholder="1.2K"
          />
        </div>

        <div>
          <Label>Waktu</Label>
          <Input 
            value={state.timestamp} 
            onChange={e => onChange({ timestamp: e.target.value })}
            placeholder="2j lalu"
          />
        </div>

        {state.platform === 'twitter' && (
          <>
            <div>
              <Label>Retweets</Label>
              <Input 
                value={state.retweetCount} 
                onChange={e => onChange({ retweetCount: e.target.value })}
                placeholder="800"
              />
            </div>
            <div>
              <Label>Views</Label>
              <Input 
                value={state.viewCount} 
                onChange={e => onChange({ viewCount: e.target.value })}
                placeholder="1.2M"
              />
            </div>
          </>
        )}

        {state.platform === 'youtube' && (
          <div>
            <Label>Replies</Label>
            <Input 
              value={state.replyCount} 
              onChange={e => onChange({ replyCount: e.target.value })}
              placeholder="24"
            />
          </div>
        )}

        {/* Checkboxes */}
        <div className="col-span-2 flex flex-col gap-2 mt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={state.isVerified}
              onChange={e => onChange({ isVerified: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
            />
            <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Verified Badge</span>
          </label>
          
          {(state.platform === 'tiktok' || state.platform === 'youtube' || state.platform === 'instagram') && (
            <>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={state.creatorLiked}
                  onChange={e => onChange({ creatorLiked: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--panel-border)] text-red-500 focus:ring-red-500 bg-[var(--root-bg)] cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-red-500 transition-colors">Creator Liked</span>
              </label>

              {!(state.platform === 'tiktok' && state.tiktokTemplate === 'reply') && !(state.platform === 'instagram' && state.instagramTemplate === 'live') && (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={state.isPinned}
                    onChange={e => onChange({ isPinned: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--panel-border)] text-[var(--text-muted)] focus:ring-gray-500 bg-[var(--root-bg)] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-[var(--text-muted)] transition-colors">Pinned Comment</span>
                </label>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-[var(--panel-border)]" />

      <div>
        <div className="flex justify-between items-end mb-2">
          <Label className="mb-0">Comment Text</Label>
          <div className="flex gap-1">
            {['👍', '❤️', '😂', '🔥', '😭'].map(emoji => (
              <button 
                key={emoji}
                onClick={() => onChange({ commentText: state.commentText + emoji })}
                className="text-xs hover:bg-[var(--root-bg)] border border-transparent hover:border-[var(--panel-border)] w-6 h-6 rounded flex items-center justify-center transition shadow-sm"
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
          className="h-28"
          placeholder="Type something..."
        />
        
        {/* Advanced Edits */}
        <div className="mt-3 flex items-center justify-between bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
          <div className="flex gap-1">
            <button title="Highlight" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('highlight'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-yellow-500 transition">
              <Highlighter className="w-4 h-4" />
            </button>
            <button title="Blur" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('blur'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-blue-500 transition">
              <EyeOff className="w-4 h-4" />
            </button>
            <button title="Cut" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('cut'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition">
              <Scissors className="w-4 h-4" />
            </button>
          </div>
          <div className="w-[1px] h-4 bg-[var(--panel-border)] mx-1" />
          <button title="Reset Formatting" type="button" onClick={resetFormat} className="w-8 h-8 rounded-md hover:bg-[var(--panel-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--root-fg)] transition">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          <Label className="mb-0">Quick Presets</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => onChange({ commentText: preset.text, likeCount: Math.floor(Math.random() * 50) + 1 + 'K' })}
              className="flex items-center gap-2 text-left bg-[var(--root-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] px-3 py-2 rounded-lg transition group"
            >
              <span className="text-sm">{preset.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--root-fg)]">{preset.label}</span>
                <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[90px]">{preset.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
