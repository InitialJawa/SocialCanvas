import React from 'react';
import { CommentState } from '../../types';
import { Button } from '../ui';
import { Plus, Trash2, GripVertical, Copy, Edit2 } from 'lucide-react';
import { Reorder } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
  onEditReply?: (id: string) => void;
  onAddReply?: () => void;
}

export function SectionReplies({ state, onChange, onEditReply, onAddReply }: Props) {
  const { language, t } = useLanguage();
  const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
  
  // Choose which list to render
  const listKey = isLiveMode ? 'additionalComments' : 'nestedReplies';
  const items = state[listKey] || [];

  const handleRemove = (id: string) => {
    if (isLiveMode) {
      onChange({ additionalComments: (state.additionalComments || []).filter(c => c.id !== id) });
    } else {
      onChange({ nestedReplies: (state.nestedReplies || []).filter(r => r.id !== id) });
    }
  };

  const handleDuplicate = (item: any) => {
    const newId = Math.random().toString(36).substring(7);
    if (isLiveMode) {
      onChange({ additionalComments: [...(state.additionalComments || []), { ...item, id: newId }] });
    } else {
      onChange({ nestedReplies: [...(state.nestedReplies || []), { ...item, id: newId }] });
    }
  };

  const handleReorder = (newItems: any[]) => {
    onChange({ [listKey]: newItems } as any);
  };

  const itemTypeName = isLiveMode ? t('replies.comment') : t('replies.reply');

  return (
    <div className="flex flex-col gap-4">
      <Button 
        variant="secondary" 
        onClick={onAddReply} 
        className="w-full font-bold bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/20 cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('replies.add', { type: itemTypeName })}
      </Button>

      {items.length === 0 && (
        <div className="text-center py-8 text-xs text-[var(--text-muted)] border border-dashed border-[var(--panel-border)] rounded-lg bg-[var(--root-bg)]">
          {t('replies.empty', { type: itemTypeName.toLowerCase() })}
          <br />
          <span className="opacity-70 mt-1 block">{t('replies.emptyDesc')}</span>
        </div>
      )}

      {items.length > 0 && (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="flex flex-col gap-2">
          {items.map((rawItem) => {
            const item = rawItem as any;
            return (
              <Reorder.Item 
                key={item.id} 
                value={item} 
                className="bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl overflow-hidden shadow-sm hover:border-[var(--text-muted)]/50 transition-all"
              >
                <div 
                  className="flex items-center p-3 gap-2.5 bg-[var(--panel-bg)] hover:bg-[var(--root-bg)] transition-colors cursor-pointer group"
                  onClick={() => onEditReply?.(item.id)}
                  title={t('replies.clickToEdit')}
                >
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-muted)] hover:text-[var(--root-fg)] shrink-0" 
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  
                  {item.avatarUrl ? (
                    <img 
                      src={item.avatarUrl} 
                      className="w-7 h-7 rounded-full border border-[var(--panel-border)] object-cover bg-white shrink-0" 
                      alt="Avatar" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-dashed border-[var(--panel-border)] shrink-0 bg-[var(--root-bg)]"></div>
                  )}

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[var(--root-fg)] truncate">
                        {item.username || 'Anonymous'}
                      </span>
                      {item.isVerified && (
                        <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white shrink-0 scale-75">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {item.commentText || (language === 'id' ? '(Kosong)' : '(Empty)')}
                    </span>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onEditReply?.(item.id)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] rounded-md hover:bg-[var(--accent)]/10 cursor-pointer transition-all"
                      title={t('replies.edit')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDuplicate(item)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] rounded-md hover:bg-[var(--accent)]/10 cursor-pointer transition-all"
                      title={t('replies.duplicate')}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-500 rounded-md hover:bg-red-500/10 cursor-pointer transition-all"
                      title={t('replies.remove')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}
