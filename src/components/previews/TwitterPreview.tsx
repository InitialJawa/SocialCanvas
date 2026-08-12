import React from 'react';
import { CommentState } from '../../types';
import { MessageCircle, Repeat2, Heart, BarChart3, Upload, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
  onReplyClick?: (replyId?: string) => void;
  onEditReply?: (replyId: string) => void;
}

export function TwitterPreview({ state, onThemeToggle, onReplyClick, onEditReply }: Props) {
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
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const textColor = isDark ? 'text-[#E7E9EA]' : 'text-[#0F1419]';
  const nameColor = isDark ? 'text-white' : 'text-[#0F1419]';
  const mutedColor = isDark ? 'text-[#71767B]' : 'text-[#536471]';

  return (
    <div 
      className={`max-w-full ${bgColor} text-left ${nameColor} border ${borderColor} flex flex-col`}
      style={{ 
        padding: `${state.padding ?? 16}px`,
        borderRadius: `${state.borderRadius ?? 12}px`,
        width: (state.autoWidth ?? true) ? 'fit-content' : `${state.cardWidth ?? 520}px`,
        maxWidth: `${state.cardWidth ?? 520}px`
      }}
    >
      {state.isPinned && (
        <div className={`flex items-center text-[13px] font-bold mb-2 pl-9 ${mutedColor}`}>
          <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1.95L1.95 12 12 22.05 22.05 12 12 1.95zM12 19L5 12l7-7 7 7-7 7z"/> {/* Dummy Pinned Icon */}
          </svg>
          Disematkan
        </div>
      )}
      <div className="flex items-start">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover mr-3 bg-neutral-800 shrink-0" />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-[15px] mb-0.5">
            <span className={`font-bold ${nameColor} mr-1 truncate hover:underline cursor-pointer`}>
              {state.username}
            </span>
            {state.isVerified && (
               <svg className="w-[18px] h-[18px] text-[#1D9BF0] mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.865 3.45-.065.29-.092.593-.092.895 0 2.21 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C8.818 21.585 10.126 22.5 12 22.5c1.516 0 2.816-.917 3.337-2.25.416.165.866.25 1.336.25 2.21 0 3.918-1.79 3.918-4 0-.302-.027-.605-.092-.895 1.124-.704 1.865-1.99 1.865-3.45zm-10.46 4.38l-4.24-4.24 1.41-1.41 2.83 2.83 6.36-6.36 1.41 1.41-7.77 7.77z"/>
               </svg>
            )}
            <span className={`${mutedColor} truncate`}>
              {state.handle}
            </span>
            <span className={`${mutedColor} mx-1`}>·</span>
            <span className={`${mutedColor} hover:underline cursor-pointer shrink-0`}>
              {state.timestamp.replace(' lalu', '')}
            </span>
          </div>
          
          <div 
            className={`leading-normal break-words whitespace-pre-wrap mb-3 ${textColor}`}
            style={{ fontSize: `${state.fontSize || 15}px` }}
          >
            {renderFormattedText(state.commentText)}
          </div>
          
          {/* Action Bar */}
          <div className={`flex items-center justify-between ${mutedColor} max-w-md`}>
            <div className="relative inline-block group/balas">
              <div 
                onClick={(e) => { e.stopPropagation(); onReplyClick?.(); }}
                className="flex items-center group cursor-pointer"
              >
                <div className="p-2 -mx-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition">
                  <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
                </div>
                <span className="text-[13px] ml-1 group-hover:text-[#1D9BF0]">{state.replyCount}</span>
              </div>
              
              {/* Overlay Tooltip Simpel */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 flex flex-col items-center pointer-events-none no-export z-30 animate-bounce" style={{ animationDuration: '3s' }} data-html2canvas-ignore="true">
                  <div className="w-1.5 h-1.5 bg-[#1D9BF0] rotate-45 -mb-0.5"></div>
                  <div className="bg-[#1D9BF0] text-white text-[9px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap shadow-md flex items-center gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse shrink-0" />
                    Klik balas untuk tambah balasan
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center group cursor-pointer">
              <div className="p-2 -mx-2 rounded-full group-hover:bg-[#00BA7C]/10 group-hover:text-[#00BA7C] transition">
                <Repeat2 className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              <span className="text-[13px] ml-1 group-hover:text-[#00BA7C]">{state.retweetCount}</span>
            </div>
            
            <div className="flex items-center group cursor-pointer">
              <div className="p-2 -mx-2 rounded-full group-hover:bg-[#F91880]/10 group-hover:text-[#F91880] transition">
                <Heart className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              <span className="text-[13px] ml-1 group-hover:text-[#F91880]">{state.likeCount}</span>
            </div>
            
            <div className="flex items-center group cursor-pointer">
              <div className="p-2 -mx-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition">
                <BarChart3 className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              <span className="text-[13px] ml-1 group-hover:text-[#1D9BF0]">{state.viewCount}</span>
            </div>
            
            <div className="flex items-center group cursor-pointer">
              <div className="p-2 -mx-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition">
                <Upload className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          {/* Nested Replies */}
          {state.nestedReplies && state.nestedReplies.length > 0 && (
            <div className="mt-2 pt-2 border-t border-transparent space-y-4">
              {state.nestedReplies.map((reply, i) => (
                <div 
                  key={reply.id} 
                  onClick={() => onEditReply?.(reply.id)}
                  className="flex flex-col relative mt-2 cursor-pointer hover:bg-neutral-500/10 p-2 -m-2 rounded-xl transition-all"
                  title="Klik untuk edit / hapus balasan ini"
                >
                  <div className="absolute top-0 bottom-0 left-[-14px] w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-start">
                    <img src={reply.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover mr-3 bg-neutral-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-[15px] mb-0.5">
                        <span className={`font-bold ${nameColor} mr-1 truncate hover:underline`}>
                          {reply.username}
                        </span>
                        {reply.isVerified && (
                          <svg className="w-[18px] h-[18px] text-[#1D9BF0] mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.865 3.45-.065.29-.092.593-.092.895 0 2.21 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C8.818 21.585 10.126 22.5 12 22.5c1.516 0 2.816-.917 3.337-2.25.416.165.866.25 1.336.25 2.21 0 3.918-1.79 3.918-4 0-.302-.027-.605-.092-.895 1.124-.704 1.865-1.99 1.865-3.45zm-10.46 4.38l-4.24-4.24 1.41-1.41 2.83 2.83 6.36-6.36 1.41 1.41-7.77 7.77z"/>
                          </svg>
                        )}
                        <span className={`${mutedColor} truncate`}>{reply.handle}</span>
                        <span className={`${mutedColor} mx-1`}>·</span>
                        <span className={`${mutedColor} hover:underline shrink-0`}>{reply.timestamp.replace(' lalu', '')}</span>
                      </div>
                      <div className={`leading-normal break-words whitespace-pre-wrap mb-3 ${textColor}`} style={{ fontSize: `${state.fontSize || 15}px` }}>
                        {renderFormattedText(reply.commentText)}
                      </div>
                      <div className={`flex items-center justify-between ${mutedColor} max-w-sm`}>
                        <div 
                          onClick={(e) => { e.stopPropagation(); onReplyClick?.(reply.id); }}
                          className="flex items-center group cursor-pointer p-1 rounded hover:bg-neutral-500/15"
                        >
                          <MessageCircle className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex items-center group cursor-pointer"><Repeat2 className="w-4 h-4" strokeWidth={2} /></div>
                        <div className="flex items-center group cursor-pointer">
                          <Heart className="w-4 h-4" strokeWidth={2} /><span className="text-[13px] ml-1">{reply.likeCount !== '0' ? reply.likeCount : ''}</span>
                        </div>
                        <div className="flex items-center group cursor-pointer"><BarChart3 className="w-4 h-4" strokeWidth={2} /></div>
                        <div className="flex items-center group cursor-pointer"><Upload className="w-4 h-4" strokeWidth={2} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Top right menu icon dummy */}
        <div className={`ml-2 shrink-0 p-2 -mr-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} cursor-pointer`}>
           <svg className={`w-[18px] h-[18px] ${mutedColor}`} fill="currentColor" viewBox="0 0 24 24">
             <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
           </svg>
        </div>
      </div>
    </div>
  );
}
