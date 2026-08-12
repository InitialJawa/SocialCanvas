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

export function TikTokPreview({ state, onThemeToggle, onReplyClick, onEditReply }: Props) {
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

  const isReply = state.tiktokTemplate === 'reply';
  const isDark = state.theme === 'dark';
  
  const defaultBg = isReply 
    ? (isDark ? 'rgba(0,0,0,0.9)' : '#ffffff') 
    : (isDark ? '#121212' : '#ffffff');
    
  const bubbleBg = (isReply && state.replyBubbleColor) ? state.replyBubbleColor : defaultBg;
  const bubbleStyle = { backgroundColor: bubbleBg };
    
  const textColor = (isReply && state.replyBubbleColor) ? '#ffffff' : (isDark ? 'text-white' : 'text-black');
  const textColorClass = (isReply && state.replyBubbleColor) ? '' : textColor;
  const mutedText = isDark ? 'text-neutral-400' : 'text-gray-500';

  if (isReply) {
    const replyWidth = state.cardWidth ? Math.max(260, state.cardWidth - 30) : 450;
    return (
      <div className="relative max-w-full pb-[18px] pt-1 px-1 flex justify-center">
        <div 
          className="flex flex-col relative max-w-full shadow-md"
          style={{
            ...bubbleStyle,
            padding: `${state.padding ?? 16}px 20px`,
            borderRadius: `${state.borderRadius ?? 12}px`,
            borderBottomLeftRadius: '0px',
            width: (state.autoWidth ?? true) ? 'fit-content' : `${replyWidth}px`,
            maxWidth: `${replyWidth}px`
          }}
        >
          {/* Reply Tail */}
          <svg 
            className="absolute"
            style={{
              bottom: '-14px',
              left: '0px',
              color: bubbleBg,
            }}
            width="24"
            height="15"
            viewBox="0 0 24 15"
            fill="none"
          >
            <path 
              d="M 0 0 V 15 C 4 10, 10 0, 24 0 Z" 
              fill="currentColor" 
            />
          </svg>
          
          <div className="relative flex items-center w-full">
            {/* Avatar */}
            {state.avatarUrl && (
              <img src={state.avatarUrl} alt="Avatar" className="w-[52px] h-[52px] rounded-full object-cover mr-4 bg-neutral-800 shrink-0" />
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className={`text-[15px] font-medium ${(isReply && state.replyBubbleColor) ? 'text-white/80' : mutedText} truncate mb-0.5`}>
                Reply to {state.username}'s comment
              </span>
              <p 
                className={`${textColorClass} leading-[1.25] font-bold text-left break-words whitespace-pre-wrap`}
                style={{ fontSize: `${(state.fontSize || 15) + 6}px`, color: (isReply && state.replyBubbleColor) ? '#ffffff' : undefined }}
              >
                {renderFormattedText(state.commentText)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col relative max-w-full"
      style={{
        backgroundColor: defaultBg,
        padding: `${state.padding ?? 16}px`,
        borderRadius: `${state.borderRadius ?? 12}px`,
        width: (state.autoWidth ?? true) ? 'fit-content' : `${state.cardWidth ?? 480}px`,
        maxWidth: `${state.cardWidth ?? 480}px`
      }}
    >
      {state.isPinned && (
        <div className="flex items-center text-[13px] text-gray-500 font-medium mb-1 pl-12">
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h4.5v6.5l1.5 1.5 1.5-1.5V16H18v-2l-2-2z"/>
          </svg>
          Disematkan
        </div>
      )}
      <div className="relative flex items-start w-full">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover mr-3 bg-neutral-800 shrink-0" />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex flex-col mb-1">
            <div className="flex items-center mt-0.5">
              <span className={`text-[13px] font-bold ${isDark ? 'text-neutral-300' : 'text-gray-900'} mr-1.5 hover:underline cursor-pointer truncate`}>
                {state.username}
              </span>
              {state.isVerified && (
                <div className="bg-[#20D5EC] rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <p 
            className={`${textColorClass} leading-[1.3] font-medium text-left break-words whitespace-pre-wrap mt-0.5`}
            style={{ fontSize: `${state.fontSize || 15}px` }}
          >
            {renderFormattedText(state.commentText)}
          </p>
          
          <div className="flex items-center mt-2 space-x-4">
            <span className={`text-[13px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
              {state.timestamp}
            </span>
            <div className="relative inline-block group/balas">
              <button 
                onClick={(e) => { e.stopPropagation(); onReplyClick?.(); }}
                className={`text-[13px] ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-500 hover:text-gray-700'} font-semibold tracking-wide cursor-pointer`}
              >
                Balas
              </button>
              
              {/* Overlay Tooltip Simpel */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 flex flex-col items-center pointer-events-none no-export z-30 animate-bounce" style={{ animationDuration: '3s' }} data-html2canvas-ignore="true">
                  <div className="w-1.5 h-1.5 bg-[#FE2B54] rotate-45 -mb-0.5"></div>
                  <div className="bg-[#FE2B54] text-white text-[9px] font-semibold py-0.5 px-2 rounded-full whitespace-nowrap shadow-md flex items-center gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse shrink-0" />
                    Klik balas untuk tambah balasan
                  </div>
                </div>
              )}
            </div>
            {state.creatorLiked && (
              <div className={`flex items-center text-[12px] font-medium leading-none px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-neutral-800 text-[#FE2B54]' : 'bg-gray-100 text-[#FE2B54]'}`}>
                Disukai oleh kreator
              </div>
            )}
          </div>
        </div>
        
        {/* Like Button */}
        <div className={`flex flex-col items-center ml-2 shrink-0 ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
          <Heart className="w-5 h-5 mb-1 opacity-80" strokeWidth={1.5} />
          {state.likeCount && (
            <span className="text-[11px] opacity-80 font-medium">{state.likeCount}</span>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {state.nestedReplies && state.nestedReplies.length > 0 && (
        <div className="flex flex-col mt-4 pl-12 space-y-4">
          {state.nestedReplies.map(reply => (
            <div 
              key={reply.id} 
              onClick={() => onEditReply?.(reply.id)}
              className="relative flex items-start w-fit max-w-lg sm:max-w-xl cursor-pointer group/reply hover:bg-neutral-500/10 p-2 -m-2 rounded-xl transition-all"
              title="Klik untuk edit / hapus balasan ini"
            >
              <img src={reply.avatarUrl} alt="Avatar" className="w-6 h-6 border shrink-0 border-neutral-700 rounded-full object-cover mr-3 bg-neutral-800" />
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center mt-0.5 mb-1">
                  <span className={`text-[13px] font-bold ${isDark ? 'text-neutral-300' : 'text-gray-900'} mr-1.5 hover:underline truncate`}>
                    {reply.username}
                  </span>
                  {reply.isVerified && (
                    <div className="bg-[#20D5EC] rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M9 16.17L4.83 12l-1.42 1.41L9 16.17z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p 
                  className={`${isDark ? 'text-white' : 'text-black'} leading-[1.3] font-medium text-left break-words whitespace-pre-wrap`}
                  style={{ fontSize: `${state.fontSize || 15}px`, opacity: 0.9 }}
                >
                  {renderFormattedText(reply.commentText)}
                </p>
                <div className="flex items-center mt-1.5 space-x-4">
                  <span className={`text-[13px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                    {reply.timestamp}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onReplyClick?.(reply.id); }}
                    className={`text-[13px] ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-500 hover:text-gray-700'} font-semibold tracking-wide cursor-pointer`}
                  >
                    Balas
                  </button>
                  {reply.creatorLiked && (
                    <div className={`flex items-center text-[12px] font-medium leading-none px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-neutral-800 text-[#FE2B54]' : 'bg-gray-100 text-[#FE2B54]'}`}>
                      Disukai oleh kreator
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex flex-col items-center ml-2 shrink-0 ${isDark ? 'text-neutral-500' : 'text-gray-400'}`}>
                <Heart className="w-4 h-4 mb-1 opacity-80" strokeWidth={1.5} />
                {reply.likeCount && reply.likeCount !== '0' && (
                  <span className="text-[11px] opacity-80 font-medium">{reply.likeCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

