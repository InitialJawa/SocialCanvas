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
  const { language, setLanguage } = useLanguage();

  const btnBase = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer";

  return (
    <header className="h-14 px-3 lg:px-4 flex items-center justify-between bg-[var(--panel-bg-translucent)] backdrop-blur-xl border-b border-[var(--panel-border)] shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3 min-w-0">
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none hover:opacity-90 active:scale-95 transition-all shrink-0"
          title="Beranda"
        >
          <CapybaraLogo className="w-7 h-7 shrink-0" />
          <span className="text-sm font-bold tracking-tight hidden sm:inline">SocialCanvas</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onGoHome}
          className={`${btnBase} hidden sm:flex`}
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className={btnBase}
          title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="font-semibold">{language === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {currentUser ? (
          <button
            onClick={onLoginClick}
            className={`${btnBase} gap-2`}
            title={`${currentUser.name} (${isPremium ? 'Pro' : 'Free'})`}
          >
            <div className={`p-[1.5px] rounded-full flex items-center justify-center shrink-0 ${
              isPremium
                ? 'bg-[var(--accent)] shadow-[0_0_8px_rgba(255,177,61,0.4)]'
                : 'bg-gray-400/50 dark:bg-gray-600'
            }`}>
              <img src={currentUser.avatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover border border-[var(--root-bg)]" referrerPolicy="no-referrer" />
            </div>
            <span className="max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline font-semibold">{currentUser.name}</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className={btnBase}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk</span>
          </button>
        )}

        <button
          onClick={onThemeChange}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer"
          title="Ganti tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}