import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Grid3X3, Crosshair, Sun, Moon } from 'lucide-react';
import { Button } from '../ui';

interface Props {
  scale: number;
  setScale: (scale: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  centerCanvas: () => void;
  cardTheme: 'light' | 'dark';
  onCardThemeChange: (theme: 'light' | 'dark') => void;
}

export function Toolbar({ scale, setScale, showGrid, setShowGrid, centerCanvas, cardTheme, onCardThemeChange }: Props) {
  const predefinedScales = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-[var(--panel-bg)]/85 backdrop-blur-md border border-[var(--panel-border)] shadow-lg rounded-lg z-20">
      {/* Premium On/Off Switch style toggle with symbols for light/dark card background */}
      <button
        onClick={() => onCardThemeChange(cardTheme === 'light' ? 'dark' : 'light')}
        className="relative flex items-center h-8 w-14 rounded-full bg-[var(--root-bg)] border border-[var(--panel-border)] p-1 transition-all duration-300 cursor-pointer select-none group focus:outline-none hover:border-[var(--accent)]/50"
        title={`Change Card Background Theme to ${cardTheme === 'light' ? 'Dark' : 'Light'}`}
      >
        <div className="flex w-full justify-between items-center px-0.5 text-[var(--text-muted)] pointer-events-none">
          <Sun className="w-3.5 h-3.5 opacity-40 group-hover:opacity-60 transition-opacity" />
          <Moon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-60 transition-opacity" />
        </div>
        <div 
          className={`absolute top-[3px] left-[3px] flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ${
            cardTheme === 'dark' 
              ? 'translate-x-6 bg-slate-800 text-[var(--accent)] border border-slate-700' 
              : 'translate-x-0 bg-white text-[var(--accent)] border border-gray-100'
          }`}
        >
          {cardTheme === 'light' ? (
            <Sun className="w-3.5 h-3.5" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      <div className="w-[1px] h-4 bg-[var(--panel-border)] mx-1" />

      <Button variant="ghost" onClick={() => setScale(Math.max(0.25, scale - 0.1))} title="Zoom Out">
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <div className="relative group">
        <button className="px-3 py-1.5 text-xs font-medium text-[var(--root-fg)] hover:bg-[var(--root-bg)] rounded-lg transition-colors min-w-[60px]">
          {Math.round(scale * 100)}%
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-1.5 bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col min-w-[100px]">
          {predefinedScales.map(s => (
            <button 
              key={s} 
              onClick={() => setScale(s)}
              className={`px-4 py-2 text-xs text-left hover:bg-[var(--root-bg)] transition-colors ${scale === s ? 'font-semibold text-[var(--accent)]' : 'text-[var(--root-fg)]'}`}
            >
              {s * 100}%
            </button>
          ))}
          <div className="h-[1px] bg-[var(--panel-border)] my-1" />
          <button 
            onClick={centerCanvas}
            className="px-4 py-2 text-xs text-left hover:bg-[var(--root-bg)] transition-colors text-[var(--root-fg)]"
          >
            Fit Screen
          </button>
        </div>
      </div>

      <Button variant="ghost" onClick={() => setScale(Math.min(3, scale + 0.1))} title="Zoom In">
        <ZoomIn className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-4 bg-[var(--panel-border)] mx-1" />

      <Button variant="ghost" onClick={centerCanvas} title="Reset Position">
        <Crosshair className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        onClick={() => setShowGrid(!showGrid)} 
        title="Toggle Grid"
        className={showGrid ? 'bg-[var(--root-bg)] text-[var(--accent)]' : ''}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
    </div>
  );
}
