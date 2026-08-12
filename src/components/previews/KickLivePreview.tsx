import React from 'react';
import { CommentState } from '../../types';
import { renderFormattedText } from '../../utils';
import { Sword, Star, Hexagon } from 'lucide-react';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
  onReplyClick?: (commentId?: string) => void;
  onEditReply?: (commentId: string) => void;
}

const nameColors = ['#53FC18', '#00DF9E', '#E467FF', '#FF9A00', '#00D6FE', '#FF5B5B', '#FFFF00'];

const getColorForUsername = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nameColors[Math.abs(hash) % nameColors.length];
};

const getBadges = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hasSub = Math.abs(hash) % 2 === 0;
  const hasMod = Math.abs(hash) % 5 === 0;
  return { hasSub, hasMod };
};

export function KickLivePreview({ state, onThemeToggle, onReplyClick, onEditReply }: Props) {
  const isDark = state.theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgClass = state.hideLiveBackground ? 'bg-transparent' : (isDark ? 'bg-[#0B0E14]' : 'bg-white');
  const borderClass = state.hideLiveBackground ? 'border-transparent' : (isDark ? 'border-[#1E232B]' : 'border-gray-200');

  const containerClasses = `max-w-full text-left flex flex-col relative cursor-pointer hover:bg-neutral-500/5 transition-all ${bgClass} ${
    !state.hideLiveBackground ? `border ${borderClass} overflow-hidden shadow-lg` : ''
  }`;

  const renderComment = (comment: any, isMain = false) => {
    const color = getColorForUsername(comment.username);
    const { hasSub, hasMod } = getBadges(comment.username);
    
    return (
      <div 
        key={comment.id || 'main'} 
        onClick={() => !isMain && onEditReply?.(comment.id)}
        className={`px-3 py-1.5 w-full transition-colors ${
          !isMain ? 'cursor-pointer hover:bg-neutral-500/10 rounded-lg' : ''
        }`}
        title={!isMain ? "Klik untuk edit / hapus komentar ini" : undefined}
      >
        <div className="leading-relaxed font-semibold text-left">
          <span className="inline-flex items-center align-middle mr-1.5 gap-1 relative -top-[1px]">
            {comment.avatarUrl && !comment.avatarUrl.includes('avatars.githubusercontent.com') && (
              <img src={comment.avatarUrl} className="w-[14px] h-[14px] rounded-sm object-cover shrink-0" alt="badge" />
            )}
            
            {comment.avatarUrl && hasSub && (
              <div className="bg-teal-500 rounded-sm w-[14px] h-[14px] flex items-center justify-center shrink-0">
                <Star className="w-2.5 h-2.5 text-white fill-current" />
              </div>
            )}
            
            {comment.avatarUrl && hasMod && (
              <div className="bg-purple-600 rounded-sm w-[14px] h-[14px] flex items-center justify-center shrink-0">
                <Sword className="w-2.5 h-2.5 text-white fill-current" />
              </div>
            )}
            
            {comment.isVerified && (
              <svg className="w-[14px] h-[14px] text-black bg-[#53FC18] rounded-[3px] p-[1.5px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </span>
          <span className="font-bold mr-0.5" style={{ color }}>
            {comment.username}
          </span>
          <span className={`${textColor} opacity-60 font-bold mr-1.5`}>:</span>
          <span className={`${textColor} break-words whitespace-pre-wrap font-medium`} style={{ fontSize: `${state.fontSize || 14}px` }}>
            {renderFormattedText(comment.commentText)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onReplyClick?.()}
      className={containerClasses} 
      style={{ 
        padding: state.hideLiveBackground ? '0' : `${state.padding ?? 16}px`,
        borderRadius: state.hideLiveBackground ? '0' : `${state.borderRadius ?? 12}px`,
        width: (state.autoWidth ?? true) ? 'fit-content' : `${state.cardWidth ?? 360}px`,
        maxWidth: `${state.cardWidth ?? 360}px`
      }}
    >
      {renderComment(state, true)}
      {(state.additionalComments || []).map((comment) => renderComment(comment))}
    </div>
  );
}
