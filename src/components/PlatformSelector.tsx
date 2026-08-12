import React from 'react';
import { Platform } from '../types';
import { TikTokColoredIcon, InstagramColoredIcon, YouTubeColoredIcon, TwitterColoredIcon, KickColoredIcon } from './icons';

interface Props {
  platform: Platform;
  onChange: (p: Platform) => void;
}

export function PlatformSelector({ platform, onChange }: Props) {
  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-7 h-7 drop-shadow-sm" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-8 h-8 drop-shadow-sm" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-8 h-8 drop-shadow-sm" /> },
    { id: 'twitter', label: 'Twitter', icon: <TwitterColoredIcon className="w-8 h-8 drop-shadow-sm" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-7 h-7 drop-shadow-sm" /> },
  ];

  return (
    <div className="flex bg-[var(--panel-bg)] p-1.5 rounded-2xl border border-[var(--panel-border)] mb-4 overflow-x-auto custom-scrollbar justify-center">
      <div className="flex items-center gap-2">
        {platforms.map((p) => (
          <button
            key={p.id}
            title={p.label}
            onClick={() => onChange(p.id)}
            className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
              platform === p.id 
                ? 'bg-[var(--button-bg)] shadow-inner scale-105 border border-[var(--panel-border)] ring-1 ring-[var(--accent)]/30' 
                : 'hover:bg-[var(--button-hover)] hover:scale-105 opacity-60 hover:opacity-100 border border-transparent'
            }`}
          >
            {p.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

