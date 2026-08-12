import React from 'react';
import { CommentState } from '../../types';
import { Label, Select, Button } from '../ui';
import { Image, Shuffle } from 'lucide-react';
import { maleUsernames, femaleUsernames, getRandomAvatarUrl } from '../../utils';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
}

export function SectionBasic({ state, onChange }: Props) {
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

  return (
    <div className="flex flex-col gap-5">
      {state.platform === 'tiktok' && (
        <div>
          <Label>Template TikTok</Label>
          <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
            <button
              onClick={() => onChange({ tiktokTemplate: 'video' })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${state.tiktokTemplate === 'video' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              Video Comment
            </button>
            <button
              onClick={() => onChange({ tiktokTemplate: 'reply' })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${state.tiktokTemplate === 'reply' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              Reply Bubble
            </button>
          </div>
        </div>
      )}

      {state.platform === 'instagram' && (
        <div>
          <Label>Template Instagram</Label>
          <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
            <button
              onClick={() => onChange({ instagramTemplate: 'comment' })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${state.instagramTemplate === 'comment' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              Comment
            </button>
            <button
              onClick={() => onChange({ instagramTemplate: 'live' })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${state.instagramTemplate === 'live' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
            >
              Live
            </button>
          </div>
        </div>
      )}

      <div>
        <Label>Avatar</Label>
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
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload} 
              />
              <label 
                htmlFor="avatar-upload" 
                className="flex-1 cursor-pointer inline-flex items-center justify-center px-3 py-1.5 bg-[var(--root-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-lg text-xs text-[var(--root-fg)] font-medium transition shadow-sm"
              >
                Upload
              </label>
              <Button variant="secondary" onClick={handleRandomAvatar} className="flex-1 text-xs py-1.5 px-3 rounded-lg" title="Acak Profil">
                <Shuffle className="w-3.5 h-3.5 mr-1.5" />
                Random
              </Button>
            </div>
            {state.avatarUrl && (
              <Button variant="danger" onClick={() => onChange({ avatarUrl: '' })} className="w-full text-xs py-1.5 h-auto">
                Remove Avatar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
