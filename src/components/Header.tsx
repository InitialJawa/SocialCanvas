import React from 'react';
import { Home, User, Moon, Sun, Globe } from 'lucide-react';
import { CapybaraLogo } from './CapybaraLogo';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

interface Props {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onGoHome: () => void;
  onLoginClick: () => void;
  currentUser: UserProfile | null;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export function Header({ 
  theme, 
  onThemeChange, 
  onGoHome, 
  onLoginClick, 
  currentUser,
  isPremium,
  onUpgradeClick
}: Props) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-14 px-3 lg:px-4 flex items-center justify-between bg-[var(--panel-bg-translucent)] backdrop-blur-xl border-b border-[var(--panel-border)] shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3 min-w-0">
        <div 
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer group select-none hover:opacity-90 active:scale-95 transition-all shrink-0"
          title={t('header.goHome')}
        >
          <CapybaraLogo className="w-7 h-7 drop-shadow-sm shrink-0 hover:rotate-6 transition-transform duration-300" />
          <span className="mono-label text-[11px] tracking-widest hidden sm:inline">{'SOCIALCANVAS'}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Home text button */}
        <button
          onClick={onGoHome}
          className="hidden sm:flex items-center gap-1 mono-label text-[10px] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors px-2.5 py-1.5 rounded-md hover:bg-[var(--button-hover)] cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t('header.home')}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--root-bg)] border border-[var(--panel-border)] mono-label text-[10px] hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
          title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>{language === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* User Account Button */}
        {currentUser ? (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-[var(--root-bg)] border border-[var(--panel-border)] mono-label text-[10px] hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
            title={`${currentUser.name} (${isPremium ? t('header.proAccount') : t('header.freeAccount')})`}
          >
            <div className={`p-[1.5px] rounded-full flex items-center justify-center shrink-0 ${
              isPremium 
                ? 'bg-[var(--accent)] shadow-[0_0_8px_rgba(255,177,61,0.4)]' 
                : 'bg-gray-400/50 dark:bg-gray-600'
            }`}>
              <img src={currentUser.avatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover border border-[var(--root-bg)]" referrerPolicy="no-referrer" />
            </div>
            <span className="max-w-[70px] sm:max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[var(--root-bg)] border border-[var(--panel-border)] mono-label text-[10px] hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('header.login')}</span>
          </button>
        )}

        <button
          onClick={onThemeChange}
          className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--root-bg)] text-[var(--root-fg)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer"
          title={t('header.switchTheme')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
