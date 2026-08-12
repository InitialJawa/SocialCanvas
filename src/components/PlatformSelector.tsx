import React from 'react';
import { Platform } from '../types';
import { TikTokColoredIcon, InstagramColoredIcon, YouTubeColoredIcon, TwitterColoredIcon, KickColoredIcon } from './icons';

interface Props {
  platform: Platform;
  onChange: (p: Platform) => void;
}

export function PlatformSelector({ platform, onChange }: Props) {
  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-6 h-6" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-7 h-7" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-7 h-7" /> },
    { id: 'twitter', label: 'Twitter', icon: <TwitterColoredIcon className="w-7 h-7" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex bg-[var(--panel-bg)] p-1.5 rounded-xl border border-[var(--panel-border)] mb-4 overflow-x-auto custom-scrollbar justify-center">
      <div className="flex items-center gap-1.5">
        {platforms.map((p) => (
          <button
            key={p.id}
            title={p.label}
            onClick={() => onChange(p.id)}
            className={`flex items-center justify-center w-12 h-11 rounded-lg transition-all duration-200 cursor-pointer ${
              platform === p.id 
                ? 'bg-[var(--root-bg)] border border-[var(--panel-border)] ring-1 ring-[var(--accent)]/25' 
                : 'hover:bg-[var(--button-hover)] opacity-60 hover:opacity-100 border border-transparent'
            }`}
          >
            {p.icon}
          </button>
        ))}
      </div>
    </div>
  );
}