import React from 'react';
import { CommentState } from '../../types';
import { ThumbsDown, ThumbsUp, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
  onReplyClick?: (replyId?: string) => void;
  onEditReply?: (replyId: string) => void;
}

export function YouTubePreview({ state, onThemeToggle, onReplyClick, onEditReply }: Props) {
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
  
  const bgColor = isDark ? 'bg-[#0F0F0F]' : 'bg-white';
  const textColor = isDark ? 'text-[#F1F1F1]' : 'text-[#0F0F0F]';
  const mutedColor = isDark ? 'text-[#AAAAAA]' : 'text-[#606060]';
  const btnHover = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const linkColor = isDark ? 'text-[#3EA6FF]' : 'text-[#065FD4]';

  return (
    <div 
      className={`max-w-full ${bgColor} text-left flex flex-col`}
      style={{ 
        padding: `${state.padding ?? 16}px`,
        borderRadius: `${state.borderRadius ?? 12}px`,
        width: (state.autoWidth ?? true) ? 'fit-content' : `${state.cardWidth ?? 520}px`,
        maxWidth: `${state.cardWidth ?? 520}px`
      }}
    >
      {state.isPinned && (
        <div className={`flex items-center text-[12px] font-medium mb-3 pl-14 ${mutedColor}`}>
          <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h4.5v6.5l1.5 1.5 1.5-1.5V16H18v-2l-2-2z"/>
          </svg>
          Disematkan oleh @{state.username.replace(/\s+/g, '').toLowerCase()}
        </div>
      )}
      <div className="flex items-start">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className={`w-[40px] h-[40px] rounded-full object-cover mr-4 bg-gray-200 shrink-0 ${isDark ? 'border border-gray-800' : ''}`} />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className={`text-[13px] font-medium ${textColor} mr-1 truncate max-w-[200px]`}>
              @{state.username.replace(/\s+/g, '').toLowerCase()}
            </span>
            {state.isVerified && (
               <svg className={`w-3.5 h-3.5 ${mutedColor} mr-2 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
               </svg>
            )}
            <span className={`text-[12px] ${mutedColor}`}>
              {state.timestamp}
            </span>
          </div>
          
          <p 
            className={`${textColor} leading-[1.4] break-words whitespace-pre-wrap mb-2`}
            style={{ fontSize: `${state.fontSize || 14}px` }}
          >
            {renderFormattedText(state.commentText)}
          </p>
          
          <div className="flex items-center space-x-1">
            {/* Like */}
            <div className="flex items-center cursor-pointer p-1">
              <ThumbsUp className={`w-[18px] h-[18px] ${textColor}`} strokeWidth={1.5} />
              {state.likeCount && (
                <span className={`text-[12px] ${mutedColor} ml-1.5`}>{state.likeCount}</span>
              )}
            </div>
            {/* Dislike */}
            <div className="flex items-center cursor-pointer p-1 px-3">
              <ThumbsDown className={`w-[18px] h-[18px] ${textColor}`} strokeWidth={1.5} />
            </div>
            {/* Reply */}
            <div className="relative inline-block group/balas ml-2">
              <span 
                onClick={(e) => { e.stopPropagation(); onReplyClick?.(); }}
                className={`text-[12px] font-medium ${textColor} ${btnHover} px-3 py-1.5 rounded-full cursor-pointer inline-block`}
              >
                Balas
              </span>
              
              {/* Overlay Tooltip Simpel */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 flex flex-col items-center pointer-events-none no-export z-30 animate-bounce" style={{ animationDuration: '3s' }} data-html2canvas-ignore="true">
                  <div className="w-1.5 h-1.5 bg-[#FF0000] rotate-45 -mb-0.5"></div>
                  <div className="bg-[#FF0000] text-white text-[9px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap shadow-md flex items-center gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse shrink-0" />
                    Klik balas untuk tambah balasan
                  </div>
                </div>
              )}
            </div>
            {/* Creator Liked */}
            {state.creatorLiked && (
              <div className="flex items-center ml-2 cursor-pointer relative">
                <img src={state.avatarUrl} alt="Creator" className="w-5 h-5 rounded-full" />
                <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5 border border-white dark:border-black">
                   <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                   </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Nested Replies or Reply Count dummy */}
          {state.nestedReplies && state.nestedReplies.length > 0 ? (
            <div className="mt-4 space-y-4">
              {state.nestedReplies.map(reply => (
                <div 
                  key={reply.id} 
                  onClick={() => onEditReply?.(reply.id)}
                  className="flex items-start cursor-pointer hover:bg-neutral-500/10 p-2 -m-2 rounded-xl transition-all"
                  title="Klik untuk edit / hapus balasan ini"
                >
                  <img src={reply.avatarUrl} alt="Avatar" className={`w-[24px] h-[24px] rounded-full object-cover mr-3 bg-gray-200 shrink-0 ${isDark ? 'border border-gray-800' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-0.5">
                      <span className={`text-[12px] font-medium ${textColor} mr-1 truncate max-w-[150px]`}>
                        @{reply.username.replace(/\s+/g, '').toLowerCase()}
                      </span>
                      {reply.isVerified && (
                        <svg className={`w-3 h-3 ${mutedColor} mr-2 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      )}
                      <span className={`text-[11px] ${mutedColor}`}>{reply.timestamp}</span>
                    </div>
                    <p className={`${textColor} leading-[1.4] break-words whitespace-pre-wrap mb-1.5`} style={{ fontSize: `${(state.fontSize || 14) - 1}px` }}>
                      {renderFormattedText(reply.commentText)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center cursor-pointer p-1">
                        <ThumbsUp className={`w-[14px] h-[14px] ${textColor}`} strokeWidth={1.5} />
                        {reply.likeCount && reply.likeCount !== '0' && <span className={`text-[11px] ${mutedColor} ml-1.5`}>{reply.likeCount}</span>}
                      </div>
                      <div className="flex items-center cursor-pointer p-1 px-2">
                        <ThumbsDown className={`w-[14px] h-[14px] ${textColor}`} strokeWidth={1.5} />
                      </div>
                      <span 
                        onClick={(e) => { e.stopPropagation(); onReplyClick?.(reply.id); }}
                        className={`text-[11px] font-medium ${textColor} ml-1 ${btnHover} px-2 py-1.5 rounded-full cursor-pointer`}
                      >
                        Balas
                      </span>
                      {reply.creatorLiked && (
                        <div className="flex items-center ml-2 cursor-pointer relative">
                          <img src={reply.avatarUrl} alt="Creator" className="w-4 h-4 rounded-full" />
                          <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-[1px] border border-white dark:border-black">
                            <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            state.replyCount && parseInt(state.replyCount.replace(/\D/g, '')) > 0 && (
              <div className="flex items-center mt-1 cursor-pointer">
                 <svg className={`w-4 h-4 ${linkColor} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
                 <span className={`text-[14px] font-medium ${linkColor}`}>
                   {state.replyCount} balasan
                 </span>
              </div>
            )
          )}
        </div>
        
        {/* Top right menu icon dummy */}
        <div className="ml-2 shrink-0 p-1">
           <svg className={`w-5 h-5 ${textColor}`} fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
           </svg>
        </div>
      </div>
    </div>
  );
}
