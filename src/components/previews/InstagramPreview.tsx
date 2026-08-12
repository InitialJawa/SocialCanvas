import React from 'react';
import { CommentState } from '../../types';
import { Heart, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
  onReplyClick?: (replyId?: string) => void;
  onEditReply?: (replyId: string) => void;
}

export function InstagramPreview({ state, onThemeToggle, onReplyClick, onEditReply }: Props) {
  const [showTooltip, setShowTooltip] = React.useState(() => {
    try {
      return !localStorage.getItem('sc_reply_tooltip_shown');
    } catch (e) {
      return true;
    }
  });

  React.useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
        try {
          localStorage.setItem('sc_reply_tooltip_shown', 'true');
        } catch (e) {
          // ignore
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const isDark = state.theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const mutedColor = isDark ? 'text-[#A8A8A8]' : 'text-gray-500';

  return (
    <div 
      className={`max-w-full ${bgColor} text-left flex flex-col`}
      style={{ 
        padding: `${state.padding ?? 16}px`,
        borderRadius: `${state.borderRadius ?? 12}px`,
        width: (state.autoWidth ?? true) ? 'fit-content' : `${state.cardWidth ?? 480}px`,
        maxWidth: `${state.cardWidth ?? 480}px`
      }}
    >
      {state.isPinned && (
        <div className={`flex items-center text-[12px] font-medium mb-2 pl-11 ${mutedColor}`}>
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h4.5v6.5l1.5 1.5 1.5-1.5V16H18v-2l-2-2z"/>
          </svg>
          Disematkan
        </div>
      )}
      <div className="flex items-start">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className={`w-8 h-8 rounded-full object-cover mr-3 bg-gray-200 shrink-0 ${isDark ? '' : 'border border-gray-100'}`} />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <p className={`leading-tight break-words whitespace-pre-wrap ${textColor}`} style={{ fontSize: `${state.fontSize || 14}px` }}>
            <span className="font-semibold mr-1 inline-flex items-center">
              {state.username.replace(/\s+/g, '').toLowerCase()}
              {state.isVerified && (
                <svg className="w-3.5 h-3.5 text-[#0095F6] ml-1 mb-0.5 inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </span>
            <span>{renderFormattedText(state.commentText)}</span>
          </p>
          
          <div className="flex flex-wrap items-center mt-2 gap-x-3 gap-y-1">
            <span className={`text-[12px] ${mutedColor} font-medium`}>
              {state.timestamp.replace(' lalu', '')}
            </span>
            {state.likeCount && (
              <span className={`text-[12px] ${mutedColor} font-medium`}>
                {state.likeCount} suka
              </span>
            )}
            <div className="relative inline-block group/balas">
              <button 
                onClick={(e) => { e.stopPropagation(); onReplyClick?.(); }}
                className={`text-[12px] ${mutedColor} font-semibold ${isDark ? 'hover:text-white' : 'hover:text-black'} cursor-pointer`}
              >
                Balas
              </button>
              
              {/* Overlay Tooltip Simpel */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 flex flex-col items-center pointer-events-none no-export z-30 animate-bounce" style={{ animationDuration: '3s' }} data-html2canvas-ignore="true">
                  <div className="w-1.5 h-1.5 bg-[#ee2a7b] rotate-45 -mb-0.5"></div>
                  <div className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[9px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap shadow-md flex items-center gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse shrink-0" />
                    Klik balas untuk tambah balasan
                  </div>
                </div>
              )}
            </div>
            <button className={`text-[12px] ${mutedColor} font-semibold ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
              Kirim
            </button>
          </div>
          
          {state.creatorLiked && (
            <div className="flex items-center mt-1">
              <img src={state.avatarUrl} alt="Creator" className="w-4 h-4 border border-white dark:border-black rounded-full" />
              <div className="bg-red-500 w-3 h-3 rounded-full flex items-center justify-center -ml-1 border-2 border-white dark:border-black z-10">
                <Heart className="w-2 h-2 text-white" fill="currentColor" />
              </div>
              <span className={`text-[11px] ml-1.5 ${mutedColor}`}>
                Disukai oleh pembuat
              </span>
            </div>
          )}

          {/* Nested Replies */}
          {state.nestedReplies && state.nestedReplies.length > 0 ? (
            <div className="mt-3 space-y-3">
              {state.nestedReplies.map(reply => (
                <div 
                  key={reply.id} 
                  onClick={() => onEditReply?.(reply.id)}
                  className="flex items-start cursor-pointer hover:bg-neutral-500/10 p-2 -m-2 rounded-xl transition-all"
                  title="Klik untuk edit / hapus balasan ini"
                >
                  <img src={reply.avatarUrl} alt="Avatar" className={`w-6 h-6 rounded-full object-cover mr-3 shrink-0 ${isDark ? '' : 'border border-gray-100'}`} />
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`leading-tight break-words whitespace-pre-wrap ${textColor}`} style={{ fontSize: `${state.fontSize || 14}px` }}>
                      <span className="font-semibold mr-1 inline-flex items-center">
                        {reply.username.replace(/\s+/g, '').toLowerCase()}
                        {reply.isVerified && (
                          <svg className="w-3.5 h-3.5 text-[#0095F6] ml-1 mb-0.5 inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        )}
                      </span>
                      <span>{renderFormattedText(reply.commentText)}</span>
                    </p>
                    <div className="flex flex-wrap items-center mt-1.5 gap-x-3 gap-y-1">
                      <span className={`text-[11px] ${mutedColor} font-medium`}>{reply.timestamp.replace(' lalu', '')}</span>
                      {reply.likeCount && reply.likeCount !== '0' && <span className={`text-[11px] ${mutedColor} font-medium`}>{reply.likeCount} suka</span>}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onReplyClick?.(reply.id); }}
                        className={`text-[11px] ${mutedColor} font-semibold cursor-pointer`}
                      >
                        Balas
                      </button>
                    </div>
                  </div>
                  <Heart className={`w-3 h-3 mt-1 shrink-0 ${isDark ? 'text-[#A8A8A8]' : 'text-gray-400'}`} strokeWidth={2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center mt-2 cursor-pointer">
               <div className="w-6 h-[1px] bg-gray-300 mr-3"></div>
               <span className={`text-[12px] ${mutedColor} font-medium`}>Lihat terjemahan</span>
            </div>
          )}
        </div>
        
        {/* Like Button */}
        <div className="flex flex-col items-center pt-2 shrink-0">
          <Heart className={`w-3 h-3 ${isDark ? 'text-[#A8A8A8]' : 'text-gray-400'}`} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
